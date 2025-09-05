import React, { useEffect, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  flip: boolean;                 // true で裏面
  flipHorizontal?: boolean;      // デフォルト true
  flipVertical?: boolean;        // デフォルト false
  perspective?: number;          // デフォルト 1000
  duration?: number;             // デフォルト 300ms
  style?: StyleProp<ViewStyle>;  // コンテナ（cardスタイルを渡す想定）
  children: React.ReactNode;     // [front, back] の2子要素
  // 互換のため受け取るが未使用
  friction?: number;
  clickable?: boolean;
};

export default function FlipCardReanimated({
  flip,
  flipHorizontal = true,
  flipVertical = false,
  perspective = 1000,
  duration = 300,
  style,
  children,
}: Props) {
  // 0 = 表, 1 = 裏
  const progress = useSharedValue(flip ? 1 : 0);

  // 「どちらが前面か」をJS側の state で保持（pointerEvents 切替用）
  const [frontActive, setFrontActive] = useState(!flip);
  const [backActive, setBackActive] = useState(!!flip);

  // flip プロップの変更をアニメに反映
  useEffect(() => {
    progress.value = withTiming(flip ? 1 : 0, { duration });
  }, [flip, duration, progress]);

  // 0.5（= 90deg）を境に pointerEvents / zIndex を入れ替える
  useAnimatedReaction(
    () => progress.value,
    (p) => {
      const frontOn = p < 0.5;
      const backOn = p >= 0.5;
      // 前後両方で runOnJS しても軽いのでOK（1フレーム1回）
      runOnJS(setFrontActive)(frontOn);
      runOnJS(setBackActive)(backOn);
    }
  );

  // 子要素を front/back に分解
  const [front, back] = React.Children.toArray(children);

  const axis = flipVertical ? "X" : "Y";

  const frontStyle = useAnimatedStyle(() => {
    const deg = interpolate(progress.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective },
        { [`rotate${axis}`]: `${deg}deg` } as any,
      ],
      zIndex: progress.value < 0.5 ? 2 : 1,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const deg = interpolate(progress.value, [0, 1], [-180, 0]);
    return {
      transform: [
        { perspective },
        { [`rotate${axis}`]: `${deg}deg` } as any,
      ],
      zIndex: progress.value >= 0.5 ? 2 : 1,
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* 表面 */}
      <Animated.View
        style={[styles.side, frontStyle]}
        // 見えてない側はイベント無効化 → 透明な壁を防ぐ
        pointerEvents={frontActive ? "auto" : "none"}
      >
        {front}
      </Animated.View>

      {/* 裏面（重ねる） */}
      <Animated.View
        style={[styles.side, styles.back, backStyle]}
        pointerEvents={backActive ? "auto" : "none"}
      >
        {back}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: "hidden",
  },
  back: {
    // 裏面は absolute で重ねるだけ（zIndex はアニメで切替）
  },
});