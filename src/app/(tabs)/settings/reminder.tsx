import ReminderService from "@/src/services/ReminderService";
import { useReminderStore } from "@/src/stores/useReminderStore";
import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";
import React from "react";
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View, Animated, Easing } from "react-native";
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Plus, Trash2 } from "lucide-react-native";

const formatTime = (hour: number, minute: number) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const ReminderScreen = () => {
  const { enabled, timeSlots, skipIfCompleted, setEnabled, setTimeSlots, setSkipIfCompleted, timezone } = useReminderStore();
  const [pickerVisible, setPickerVisible] = React.useState(false);
  const [editingSlotId, setEditingSlotId] = React.useState<string | null>(null);
  const [tempDate, setTempDate] = React.useState<Date>(new Date());
  const animated = React.useRef(new Animated.Value(enabled ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      // 画面に戻ったタイミングで最新の設定を反映
      ReminderService.syncUpcoming().catch((e) => console.warn("syncUpcoming", e));
      return undefined;
    }, [])
  );

  const handleToggleEnabled = async (value: boolean) => {
    setEnabled(value);
    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const requested = await Notifications.requestPermissionsAsync();
        if (requested.status !== "granted") {
          Alert.alert(i18n.t("reminder.permissionTitle"), i18n.t("reminder.permissionBody"));
          return;
        }
      }
    }
    await ReminderService.handleSettingsChange();
  };

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: enabled ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [enabled, animated]);

  const handleSkipToggle = async (value: boolean) => {
    setSkipIfCompleted(value);
    await ReminderService.handleSettingsChange();
  };

  const addTimeSlot = async () => {
    if (timeSlots.length >= 3) {
      Alert.alert(i18n.t("reminder.maxSlotsTitle"), i18n.t("reminder.maxSlotsBody"));
      return;
    }
    const newSlot = { id: `slot-${Date.now()}`, hour: 20, minute: 0 };
    setTimeSlots([...timeSlots, newSlot]);
    await ReminderService.handleSettingsChange();
  };

  const openTimePicker = (slotId: string, hour: number, minute: number) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "time",
        value: d,
        is24Hour: true,
        onChange: (event: DateTimePickerEvent, selected) => handleAndroidChange(event, selected, slotId),
      });
      return;
    }
    setTempDate(d);
    setEditingSlotId(slotId);
    setPickerVisible(true);
  };

  const updateTimeSlot = async (id: string, hour: number, minute: number) => {
    setTimeSlots(timeSlots.map((slot) => (slot.id === id ? { ...slot, hour, minute } : slot)));
    await ReminderService.handleSettingsChange();
  };

  const handleAndroidChange = async (event: DateTimePickerEvent, selected: Date | undefined, slotId: string) => {
    if (event.type === "dismissed" || !selected) return;
    await updateTimeSlot(slotId, selected.getHours(), selected.getMinutes());
  };

  const handleConfirmTime = async (date: Date) => {
    if (!editingSlotId) {
      setPickerVisible(false);
      return;
    }
    await updateTimeSlot(editingSlotId, date.getHours(), date.getMinutes());
    setPickerVisible(false);
    setEditingSlotId(null);
  };

  const handleCancelPicker = () => {
    setPickerVisible(false);
    setEditingSlotId(null);
  };

  const removeTimeSlot = async (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    await ReminderService.handleSettingsChange();
  };

  const sendTestNotification = async () => {
    try {
      await ReminderService.sendTestNotification();
      Alert.alert(i18n.t("reminder.testScheduledTitle"), i18n.t("reminder.testScheduledBody"));
    } catch (error) {
      Alert.alert(i18n.t("reminder.permissionTitle"), i18n.t("reminder.permissionBody"));
      console.error("sendTestNotification", error);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: theme.spacing.lg }}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{i18n.t("reminder.sectionTitle")}</Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{i18n.t("reminder.enabledLabel")}</Text>
              <Text style={styles.helper}>{i18n.t("reminder.enabledHint")}</Text>
            </View>
            <Switch value={enabled} onValueChange={handleToggleEnabled} />
          </View>

          <Animated.View
            style={[
              styles.collapse,
              {
                height: animated.interpolate({ inputRange: [0, 1], outputRange: [0, contentHeight || 1] }),
                opacity: animated,
                transform: [
                  { scaleY: animated.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                ],
              },
            ]}
            pointerEvents={enabled ? "auto" : "none"}
          >
            <View
              style={styles.collapseInner}
              onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
            >
              <View style={styles.timeHeader}>
                <Text style={styles.label}>{i18n.t("reminder.timeSlotsLabel")}</Text>
                <Pressable onPress={addTimeSlot} style={styles.addButton}>
                  <Plus size={18} color={theme.colors.secondary} />
                  <Text style={styles.addButtonText}>{i18n.t("reminder.addTimeSlot")}</Text>
                </Pressable>
              </View>

              {timeSlots.length === 0 ? (
                <Text style={styles.helper}>{i18n.t("reminder.noSlot")}</Text>
              ) : (
                timeSlots.map((slot) => (
                  <Pressable
                    key={slot.id}
                    style={[styles.timeRow, !enabled && { opacity: 0.4 }]}
                    onPress={() => openTimePicker(slot.id, slot.hour, slot.minute)}
                    disabled={!enabled}
                  >
                    <View>
                      <Text style={styles.timeValue}>{formatTime(slot.hour, slot.minute)}</Text>
                      <Text style={styles.timeCaption}>{i18n.t("reminder.dailyCaption")}</Text>
                    </View>
                    <Pressable
                      onPress={() => removeTimeSlot(slot.id)}
                      style={[styles.iconButton, !enabled && { opacity: 0.4 }]}
                      disabled={!enabled}
                      accessibilityLabel={i18n.t("reminder.deleteSlot", { time: formatTime(slot.hour, slot.minute) })}
                    >
                      <Trash2 size={18} color={theme.colors.secondary} />
                    </Pressable>
                  </Pressable>
                ))
              )}

              <View style={[styles.rowBetween, { marginTop: theme.spacing.md, alignItems: "flex-start" }]}>
                <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
                  <Text style={styles.label}>{i18n.t("reminder.skipLabel")}</Text>
                  <Text style={styles.helper}>{i18n.t("reminder.skipHint")}</Text>
                </View>
                <Switch value={skipIfCompleted} onValueChange={handleSkipToggle} disabled={!enabled} />
              </View>

              <Pressable onPress={sendTestNotification} style={[styles.testButton, !enabled && { opacity: 0.4 }]} disabled={!enabled}>
                <Text style={styles.testButtonText}>{i18n.t("reminder.testButton")}</Text>
              </Pressable>

              <Text style={styles.helper}>{i18n.t("reminder.timezoneLabel", { tz: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone })}</Text>
            </View>
          </Animated.View>
        </View>

        {Platform.OS === "ios" && pickerVisible ? (
          <Modal transparent animationType="slide" visible={pickerVisible} onRequestClose={handleCancelPicker}>
            <Pressable style={styles.modalOverlay} onPress={handleCancelPicker}>
              <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={tempDate}
                    mode="time"
                    display="spinner"
                    minuteInterval={5}
                    onChange={(_, date) => date && setTempDate(date)}
                    locale={i18n.locale === "ja" ? "ja-JP" : "en-US"}
                    is24Hour
                    style={styles.datePicker}
                  />
                </View>
                <View style={styles.modalActions}>
                  <Pressable onPress={handleCancelPicker} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>{i18n.t("cancel")}</Text>
                  </Pressable>
                  <Pressable onPress={() => handleConfirmTime(tempDate)} style={[styles.modalButton, styles.modalPrimary]}>
                    <Text style={[styles.modalButtonText, { color: "white" }]}>{i18n.t("save")}</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        ) : null}
      </ScrollView>
    </>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: theme.spacing.sm,
    color: theme.colors.secondary,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.placeholder,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  helper: {
    fontSize: 10.5,
    color: theme.colors.secondary,
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    fontWeight: "800",
    color: theme.colors.secondary,
    letterSpacing: 0.3,
  },
  timeRow: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.secondary,
  },
  timeCaption: {
    marginTop: 2,
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconButtonText: {
    fontSize: 18,
    color: theme.colors.secondary,
    fontWeight: "800",
    lineHeight: 22,
  },
  testButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.sm,
  },
  testButtonText: {
    color: "white",
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  modalCard: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    width: "100%",
  },
  datePickerContainer: {
    alignItems: "center",
  },
  datePicker: {
    width: "100%",
  },
  collapse: {
    overflow: "hidden",
  },
  collapseInner: {},
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
  },
  modalPrimary: {
    backgroundColor: theme.colors.secondary,
  },
  modalButtonText: {
    color: theme.colors.secondary,
    fontWeight: "700",
    textAlign: "center",
  },
});
