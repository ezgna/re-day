import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Re:Day",
  slug: "re-day",
  version: "1.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "reday",
  userInterfaceStyle: "automatic",
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "c8aaf04f-9b9b-43da-bb79-d27c2ccd9c75",
    },
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      CFBundleLocalizations: ["en", "ja"],
      CFBundleDevelopmentRegion: "en",
      ITSAppUsesNonExemptEncryption: false,
    },
    bundleIdentifier: "com.ezgna.re-day",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#503B73",
    },
    edgeToEdgeEnabled: true,
    package: "com.ezgna.reday",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  locales: {
    ja: "./languages/japanese.json",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#4B367C",
        image: "./assets/images/icon.png",
        resizeMode: "contain",
      },
    ],
    "expo-sqlite",
    "expo-localization",
    "expo-web-browser",
    "expo-mail-composer",
  ],
});
