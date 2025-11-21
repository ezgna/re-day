import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Re:Day",
  slug: "re-day",
  version: "1.3",
  orientation: "portrait",
  scheme: "reday",
  userInterfaceStyle: "light",
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
    icon: "assets/icons/app.icon",
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
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#503B73",
    },
    edgeToEdgeEnabled: true,
    package: "com.ezgna.reday",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/icons/favicon.png",
  },
  locales: {
    en: "./locales/en.json",
    ja: "./locales/ja.json",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/icons/splash.png",
        imageWidth: 125,
        // dark: {
        //   image: "./assets/icons/splash.png",
        //   backgroundColor: "#000000",
        // },
      },
    ],
    "expo-sqlite",
    "expo-localization",
    "expo-web-browser",
    "expo-mail-composer",
    "expo-notifications"
  ],
});
