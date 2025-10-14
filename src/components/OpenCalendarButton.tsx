import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const OpenCalendarButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <Text style={styles.text}>{i18n.t("openCalendar")}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    ...theme.shadows.light,
    marginBottom: theme.spacing.xs,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  text: {
    fontSize: 14,
    // fontWeight: "400",
    color: theme.colors.secondary,
  },
});

export default OpenCalendarButton;
