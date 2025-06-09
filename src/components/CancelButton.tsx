import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const CancelButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cancelButton, { opacity: pressed ? 0.6 : 1 }]}>
      <Text style={styles.cancelText}>Cancel</Text>
    </Pressable>
  );
};

export default CancelButton;

const styles = StyleSheet.create({
  cancelButton: {
    marginRight: 12,
  },
  cancelText: {
    fontSize: 14,
    color: "gray",
    fontWeight: "500",
  },
});
