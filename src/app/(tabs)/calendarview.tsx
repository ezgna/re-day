import CancelButton from "@/src/components/CancelButton";
import PastEntry from "@/src/components/PastEntry";
import SaveButton from "@/src/components/SaveButton";
import { deleteEntry, fetchEntries, updateEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { formatToLocalDateString } from "@/utils/date";
import { theme } from "@/utils/theme";
import { router, useFocusEffect } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { SafeAreaView } from "react-native-safe-area-context";

const CalendarView = () => {
  const [selected, setSelected] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const params = useLocalSearchParams<{ pickedDate?: string; t?: string }>();

  // console.log(params)

  const loadEntries = useCallback(async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      console.error("loadEntries error:", error);
    }
  }, [setEntries]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  useEffect(() => {
    if (!params.pickedDate) return;
    setSelected(params.pickedDate);
  }, [params.pickedDate, params.t]);

  useEffect(() => {
    if (params.pickedDate) return;
    const now = new Date().toISOString();
    const today = formatToLocalDateString(now);
    setSelected(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      loadEntries();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: number, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const handleUpdate = async () => {
    if (!editingId) {
      console.log("you tried to handle update without editingId ");
      return;
    }
    const trimmedContent = editingContent.trim();
    if (!trimmedContent) {
      console.log("content_cannot_be_empty");
      return;
    }
    try {
      await updateEntry(editingId, trimmedContent);
      setEditingId(null);
      setEditingContent("");
      loadEntries();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async () => {
    setEditingId(null);
    setEditingContent("");
  };

  const filteredEntries = selected ? entries.filter((entry) => formatToLocalDateString(entry.created_at) === selected) : [];

  const dotMarkedDates = entries.reduce((acc, entry) => {
    const date = formatToLocalDateString(entry.created_at);
    acc[date] = {
      marked: true,
      dotColor: date === selected ? "white" : "#00B0FF",
    };
    return acc;
  }, {} as Record<string, MarkingProps>);

  if (selected) {
    dotMarkedDates[selected] = {
      ...(dotMarkedDates[selected] || {}),
      selected: true,
      selectedColor: "#00B0FF",
    };
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Calendar
        key={`${selected}-${params.t ?? ''}`} // t 変更で確実に再マウント
        current={selected} // pickedDateに合わせて月表示を変えるために必須
        style={styles.calendar}
        onDayPress={(day) => {
          setSelected(day.dateString);
          router.replace({
            // paramsをリセットするにはこれをやるしかないようだ
            pathname: "/calendarview",
            params: {},
          });
        }}
        markedDates={dotMarkedDates}
      />
      <View style={styles.entryContainer}>
        {editingId ? (
          <View style={styles.editorCard}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={editingContent} onChangeText={setEditingContent} multiline onBlur={() => Keyboard.dismiss()} />
              <View style={styles.buttonContainer}>
                <CancelButton onPress={handleCancel} />
                <SaveButton onPress={handleUpdate} />
              </View>
            </View>
          </View>
        ) : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <PastEntry entries={filteredEntries} onDelete={handleDelete} onEdit={handleEdit} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  container: {
    // marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flex: 1, // for scrollView
    backgroundColor: theme.colors.background,
  },
  calendar: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  entryContainer: {
    flex: 1, // for scrollView
  },
  editorCard: {
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  inputContainer: {
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    fontSize: 16,
    color: theme.colors.secondary,
    maxHeight: 120,
    minHeight: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
});
