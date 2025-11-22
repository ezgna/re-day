import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { Icon, Label, NativeTabs, type NativeTabsProps } from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const { colors } = theme;

  const androidTabsAppearance = Platform.select<Partial<NativeTabsProps>>({
    android: {
      backgroundColor: colors.card,
      iconColor: { default: colors.mutedForeground, selected: colors.onPrimary },
      indicatorColor: colors.selection,
      labelVisibilityMode: "selected",
      labelStyle: {
        default: { color: colors.mutedForeground },
        selected: { color: colors.primary },
      },
    },
    default: {},
  });

  return (
    <NativeTabs {...androidTabsAppearance}>
      <NativeTabs.Trigger name="index">
        <Label>{i18n.t("reflect")}</Label>
        <Icon sf={"book"} androidSrc={require("../../../assets/tabs/edit_note_24dp_5A6475_FILL0_wght400_GRAD0_opsz24.png")} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendarview">
        <Label>{i18n.t("calendar")}</Label>
        <Icon sf={"calendar"} androidSrc={require("../../../assets/tabs/calendar_month_24dp_5A6475_FILL0_wght400_GRAD0_opsz24.png")} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>{i18n.t("settings")}</Label>
        <Icon sf={"gear"} androidSrc={require("../../../assets/tabs/settings_24dp_5A6475_FILL0_wght400_GRAD0_opsz24.png")} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
