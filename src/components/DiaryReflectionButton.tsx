import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator, Platform } from "react-native";
import CountDown from "react-native-countdown-component";

interface Props {
  onPress: () => void;
  loading: boolean;
  cooldownTime: number;
  isCountingDown: boolean;
  onFinish: () => void;
}

const DiaryReflectionButton: React.FC<Props> = ({ onPress, loading, cooldownTime, isCountingDown, onFinish }) => {
  const disabled = loading || isCountingDown;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.touch,
        disabled && styles.touchDisabled,
        pressed && !disabled && styles.touchPressed,
      ]}
    >
      {/* グラデ枠（縁取り） */}
      <LinearGradient
        colors={disabled ? ["#bdbdbd", "#bdbdbd"] : ["#8ea0ff", "#7456f0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.frameGradient}
      >
        {/* 本体グラデ（内側） */}
        <LinearGradient
          colors={disabled ? ["#bdbdbd", "#bdbdbd"] : ["#6b7cff", "#5a3ecf", "#4b2cb0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          {/* 底のリップ（奥行き影）※disabled時は描画しない */}
          {!disabled && (
            <LinearGradient
              colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.18)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.bottomLip}
              pointerEvents="none"
            />
          )}

          {/* 中身 */}
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
              digitStyle={{ height: 16, backgroundColor: "transparent" }}
              digitTxtStyle={{ color: theme.colors.card, lineHeight: 18 }}
              timeToShow={["M", "S"]}
              showSeparator
              separatorStyle={{ color: theme.colors.card, lineHeight: 18 }}
            />
          ) : (
            <Text style={styles.text}>{i18n.t("diaryReflectionButtonText")}</Text>
          )}
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // タップ領域（影はここで）
  touch: {
    borderRadius: theme.radius.md,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  touchPressed: {
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    transform: [{ translateY: Platform.OS === "ios" ? 1 : 0 }, { scale: 0.985 }],
  },
  touchDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },

  // 外枠のグラデ（縁取り）
  frameGradient: {
    borderRadius: theme.radius.md,
    padding: 0,
  },

  // 本体の塗り
  fill: {
    height: 55,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  // ボトムリップ（下端の濃い影で厚み）
  bottomLip: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 18,
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
  },

  text: {
    color: theme.colors.card,
    fontSize: 16.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default DiaryReflectionButton;