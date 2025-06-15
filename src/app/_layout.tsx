import i18n from "@/utils/i18n";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { getLocales } from "expo-localization";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

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
