import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";

const SaveButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable
      onPress={() => {
        onPress();
        Haptics.selectionAsync();
      }}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Text style={styles.text}>Save</Text>
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
    marginBottom: 6,
    borderRadius: 5,
    ...theme.shadows.light,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.secondary,
  },
});

export default SaveButton;
