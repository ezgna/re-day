import { theme } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

const FlipPressable = ({ onPress, style }: { onPress: () => void; style?: StyleProp<ViewStyle> }) => {
  const handlePress = () => {
    onPress();
    Haptics.selectionAsync();
  };
  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [style, pressed && styles.pressed]}>
      <MaterialIcons name="flip" size={24} style={styles.icon} />
    </Pressable>
  );
};

export default FlipPressable;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
  icon: {
    color: theme.colors.secondary,
  },
});
