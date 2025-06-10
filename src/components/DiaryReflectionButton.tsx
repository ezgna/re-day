import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator } from "react-native";

interface Props {
  onPress: () => void;
  loading: boolean;
}

const DiaryReflectionButton: React.FC<Props> = ({ onPress, loading }) => {
  return (
    <Pressable onPress={loading ? undefined : onPress} disabled={loading} style={({ pressed }) => [styles.pressable, pressed && styles.buttonPressed]}>
      <LinearGradient colors={["#667eea", "#764ba2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {loading ? <ActivityIndicator size="small" color="#F4F6F7" /> : <Text style={styles.text}>{i18n.t("diaryReflectionButtonText")}</Text>}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: theme.radius.md,
    ...theme.shadows.strong,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  text: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
    ...theme.shadows.medium,
  },
});

export default DiaryReflectionButton;
