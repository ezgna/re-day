import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Reflect</Label>
        <Icon sf={"book"} drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendarview">
        <Label>Calendar</Label>
        <Icon sf={"calendar"} drawable="ic_menu_my_calendar" />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf={"gear"} drawable="ic_menu_my_manage" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
