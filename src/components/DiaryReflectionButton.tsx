import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator } from "react-native";
import CountDown from "react-native-countdown-component";

interface Props {
  onPress: () => void;
  loading: boolean;
  cooldownTime: number;
  isCountingDown: boolean;
  onFinish: () => void;
}

const DiaryReflectionButton: React.FC<Props> = ({ onPress, loading, cooldownTime, isCountingDown, onFinish }) => {
  return (
    <Pressable
      onPress={loading || isCountingDown ? undefined : onPress}
      disabled={loading || isCountingDown}
      style={({ pressed }) => [isCountingDown ? null : styles.pressable, pressed && styles.buttonPressed]}
    >
      <LinearGradient colors={isCountingDown ? ["#afafaf", "#afafaf"] : ["#667eea", "#764ba2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {loading ? (
          <ActivityIndicator size="small" color="#F4F6F7" />
        ) : isCountingDown ? (
          <CountDown
            until={cooldownTime}
            onFinish={onFinish}
            size={16}
            running={isCountingDown}
            timeLabels={{}}
            style={{ height: 16 }}
            digitStyle={{ height: 16 }}
            digitTxtStyle={{ color: theme.colors.card, lineHeight: 18 }}
            timeToShow={["M", "S"]}
            showSeparator
            separatorStyle={{ color: theme.colors.card, lineHeight: 18 }}
          />
        ) : (
          <Text style={styles.text}>{i18n.t("diaryReflectionButtonText")}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    ...theme.shadows.strong,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    // paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
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
