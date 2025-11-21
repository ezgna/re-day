import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useCountdown, formatMMSS } from "@/src/hooks/useCountdown";

interface Props {
  onPress: () => void;
  loading: boolean;
  // 残り秒（押下時や復帰時点の見込み秒数）
  cooldownTime: number;
  // カウントダウン中かどうか（表示切替用）
  isCountingDown: boolean;
  // 終了時のハンドラ
  onFinish: () => void;
}

const DiaryReflectionButton: React.FC<Props> = ({ onPress, loading, cooldownTime, isCountingDown, onFinish }) => {
  const disabled = loading || isCountingDown;

  // 既存の props を崩さず、内部で deadline を決定（stateで持ち即レンダー反映）
  const [deadline, setDeadline] = useState<number | null>(() => (isCountingDown ? Date.now() + cooldownTime * 1000 : null));
  useEffect(() => {
    if (isCountingDown) {
      // isCountingDown になったタイミングで基準となる deadline を設定
      // （親は復帰時に cooldownTime を再計算してくるため、ここでの now+sec は整合する）
      setDeadline(Date.now() + cooldownTime * 1000);
    } else {
      setDeadline(null);
    }
  }, [isCountingDown, cooldownTime]);

  const { mmss } = useCountdown(deadline, onFinish);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
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
              pointerEvents="none"
            />
          )}

          {/* 中身 */}
          {loading ? (
            <ActivityIndicator size="small" color="#F4F6F7" />
          ) : isCountingDown ? (
            <Text style={styles.text}>{deadline ? mmss : formatMMSS(cooldownTime)}</Text>
          ) : (
            <Text style={styles.text}>{i18n.t("diaryReflectionButtonText")}</Text>
          )}
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // 外枠のグラデ（縁取り）
  frameGradient: {
    borderRadius: 32,
  },

  // 本体の塗り
  fill: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
