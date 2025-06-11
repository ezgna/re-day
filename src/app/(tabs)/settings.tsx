import { theme } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Japanese">();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.optionContainer}>
          <Pressable style={styles.option}>
            <Ionicons name="options-outline" size={24} style={styles.icon} />
            <Text style={styles.optionText}>Customization</Text>
          </Pressable>

          <Pressable style={[styles.option, { borderBottomWidth: 0 }]}>
            <Ionicons name="cloud-upload-outline" size={24} style={styles.icon} />
            <Text style={styles.optionText}>Export / Import</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>LANGUAGE</Text>

        {/* this view is for android */}
        <View style={{ elevation: 3, borderRadius: theme.radius.sm }}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedLanguage(value)}
            value={selectedLanguage}
            placeholder={{}}
            useNativeAndroidPickerStyle={false} // android
            items={[
              { label: "English", value: "English" },
              { label: "Japanese", value: "Japanese" },
            ]}
            style={{
              inputIOSContainer: {
                pointerEvents: "none",
                padding: theme.spacing.md,
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.sm,
                flexDirection: "row",
                alignItems: "center",
                ...theme.shadows.light,
              },
              inputIOS: {
                fontSize: 16,
                color: theme.colors.secondary,
              },
              inputAndroidContainer: {
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.sm,
                flexDirection: "row",
                alignItems: "center",
              },
              inputAndroid: {
                fontSize: 16,
                color: theme.colors.secondary,
              },
              iconContainer: {
                marginRight: theme.spacing.md,
              },
            }}
            Icon={() => <Ionicons name="chevron-down" size={20} style={styles.icon} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  optionContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.medium,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  icon: {
    color: theme.colors.secondary,
  },
  optionText: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.placeholder,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
