import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const SaveButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.6 : 1 }]}>
      <Text style={styles.text}>Save</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "gray",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: "#F4F6F7",
  },
});

export default SaveButton;
