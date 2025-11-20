import i18n from "@/utils/i18n";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>{i18n.t("reflect")}</Label>
        <Icon sf={"book"} drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendarview">
        <Label>{i18n.t("calendar")}</Label>
        <Icon sf={"calendar"} drawable="ic_menu_my_calendar" />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="settings">
        <Label>{i18n.t("settings")}</Label>
        <Icon sf={"gear"} drawable="ic_menu_my_manage" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
