import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const SaveButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.saveButton, { opacity: pressed ? 0.6 : 1 }]}>
      <Text style={styles.saveText}>Save</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "gray",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  saveText: {
    fontSize: 14,
    color: "#F4F6F7",
  },
});

export default SaveButton;
