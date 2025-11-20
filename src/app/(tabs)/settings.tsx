import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import * as Application from "expo-application";
import * as Device from "expo-device";
import * as MailComposer from "expo-mail-composer";
import { BookCheck, Mails, ShieldCheck } from "lucide-react-native";
import React from "react";
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const openSupportMail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(i18n.t("mail_app_unavailable"));
      return;
    }

    const deviceInfo = [`デバイス: ${Device.manufacturer} ${Device.modelName}`, `OS: ${Device.osName} ${Device.osVersion}`, `バージョン: ${Application.nativeBuildVersion}`].join(
      "\n"
    );

    const body = [
      "お手数ではございますが、以下に詳細をご入力ください。詳しくご記入いただくと、より適切に対応可能です。",
      "",
      "• お問い合わせ内容：",
      "• スクリーンショットや動画：",
      "• 返信を希望：する / しない",
      "",
      "================================",
      "※以下の項目は自動で入力されています。削除せずそのままお送りください。",
      "",
      deviceInfo,
      "",
      "本メールに含まれる情報は、サポートチームが収集・利用する場合があります。取得した情報は問い合わせ対応にのみ使用されます。",
      "削除していただくことも可能ですが、その際はサポート対応に制限が生じることがありますので、あらかじめご了承ください。",
    ].join("\n");

    await MailComposer.composeAsync({
      recipients: ["ensalfjsk@yahoo.com"],
      subject: "アプリ内お問い合わせ",
      body,
    });
  };

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

          <Pressable onPress={openSupportMail} style={styles.option}>
            <Mails size={28} color="dimgray" />
            <Text style={styles.optionText}>{i18n.t("contact")}</Text>
          </Pressable>

          <Pressable onPress={openPrivacyPolicy} style={styles.option}>
            <ShieldCheck size={28} color="dimgray" />
            <Text style={styles.optionText}>{i18n.t("privacy_policy")}</Text>
          </Pressable>

          {Platform.OS === "ios" && (
            <Pressable onPress={openTermsOfUse} style={[styles.option, { borderBottomWidth: 0 }]}>
              <BookCheck size={28} color="dimgray" />
              <Text style={styles.optionText}>{i18n.t("terms_of_use")}</Text>
            </Pressable>
          )}
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
