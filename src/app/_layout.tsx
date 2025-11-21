import ReminderService from "@/src/services/ReminderService";
import i18n from "@/utils/i18n";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { getLocales } from "expo-localization";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Expo SDK 54 の NotificationBehavior では shouldShowBanner / shouldShowList が必須
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: Platform.OS === "ios",
  }),
});

export default function RootLayout() {
  const deviceLanguage = getLocales()[0].languageCode ?? "en";
  i18n.locale = ["ja", "en"].includes(deviceLanguage) ? deviceLanguage : "en";

  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    let responseSubscription: Notifications.Subscription | undefined;

    (async () => {
      await ReminderService.init();
      responseSubscription = ReminderService.addNotificationResponseListener();
    })();

    const sub = AppState.addEventListener("change", (status) => {
      if (appState.current.match(/inactive|background/) && status === "active") {
        ReminderService.handleAppForeground();
      }
      appState.current = status;
    });

    return () => {
      sub.remove();
      if (responseSubscription) {
        responseSubscription.remove();
      }
    };
  }, []);
  
  return (
    <RootSiblingParent>
      <ActionSheetProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ActionSheetProvider>
    </RootSiblingParent>
  );
}
