import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { getLocales } from "expo-localization";
import i18n from "@/utils/i18n";
import { useEffect } from "react";

export default function RootLayout() {
  const deviceLanguage = getLocales()[0].languageCode ?? "en";
  i18n.locale = ["ja", "en"].includes(deviceLanguage) ? deviceLanguage : "en";
  
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
