import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.optionContainer}>
        <Pressable style={styles.option}>
          <Ionicons name="options-outline" size={24} color="black" />
          <Text style={styles.optionText}>Customization</Text>
        </Pressable>
        
        <Pressable style={styles.option}>
          <Ionicons name="globe-outline" size={24} color="black" />
          <Text style={styles.optionText}>Language</Text>
        </Pressable>

        <Pressable style={[styles.option, { borderBottomWidth: 0 }]}>
          <Ionicons name="cloud-upload-outline" size={24} color="black" />
          <Text style={styles.optionText}>Export/Import</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  optionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingLeft: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
