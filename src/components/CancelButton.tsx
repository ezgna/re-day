import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const CancelButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}>
      <Text style={styles.text}>Cancel</Text>
    </Pressable>
  );
};

export default CancelButton;

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
});
