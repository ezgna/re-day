import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookCheck, ShieldCheck } from "lucide-react-native";

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Japanese">();

  const openPrivacyPolicy = () => {
    Alert.alert(i18n.t("external_link"), i18n.t("external_link_message"), [
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
      {
        text: i18n.t("continue"),
        onPress: async () => await Linking.openURL("https://www.ezgna.com/privacypolicy"),
      },
    ]);
  };

  const openTermsOfUse = () => {
    Alert.alert(i18n.t("external_link"), i18n.t("external_link_message"), [
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
      {
        text: i18n.t("continue"),
        onPress: async () => await Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.optionContainer}>
          {/* <Pressable style={styles.option}>
            <Ionicons name="options-outline" size={24} style={styles.icon} />
            <Text style={styles.optionText}>Customization</Text>
          </Pressable>

          <Pressable style={[styles.option, { borderBottomWidth: 0 }]}>
            <Ionicons name="cloud-upload-outline" size={24} style={styles.icon} />
            <Text style={styles.optionText}>Export / Import</Text>
          </Pressable> */}

          <Pressable onPress={openPrivacyPolicy} style={styles.option}>
            {/* <Feather name="external-link" size={24} style={styles.icon} /> */}
            <ShieldCheck size={28} color="dimgray" />
            <Text style={styles.optionText}>{i18n.t("privacy_policy")}</Text>
          </Pressable>

          <Pressable onPress={openTermsOfUse} style={[styles.option, { borderBottomWidth: 0 }]}>
            <BookCheck size={28} color="dimgray" />
            <Text style={styles.optionText}>{i18n.t("terms_of_use")}</Text>
          </Pressable>
        </View>
      </View>

      {/* <View style={{ flex: 1 }}>
        <Text style={styles.label}>LANGUAGE</Text> */}

      {/* this view is for android */}
      {/* <View style={{ elevation: 3, borderRadius: theme.radius.sm }}>
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
        </View> */}
      {/* </View> */}
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
    fontWeight: "800",
    color: theme.colors.secondary,
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
