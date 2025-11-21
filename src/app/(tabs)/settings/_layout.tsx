import i18n from "@/utils/i18n";
import { Stack } from "expo-router";
import React from "react";

export default function SettingsStack() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="reminder" options={{ title: i18n.t("reminder.screenTitle") }} />
    </Stack>
  );
}
