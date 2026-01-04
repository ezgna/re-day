import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Re:Day",
  slug: "re-day",
  version: "1.4",
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
    ads: {
      // ネイティブ（Native Advanced）広告の Ad Unit ID（ca-app-pub-.../...）
      // 未設定の場合はNativeAdを表示しない
      nativeAdUnitIdIos: "ca-app-pub-4363360791941587/3000754111",
      nativeAdUnitIdAndroid: "",
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
    ...(config.android || {}),
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: [...(config.android?.permissions ?? []), "android.permission.SCHEDULE_EXACT_ALARM"],
    edgeToEdgeEnabled: true,
    package: "com.ezgna.reday",
  },
  web: {
    bundler: "metro",
    output: "static",
    // favicon: "./assets/icons/favicon.png",
  },
  locales: {
    en: "./locales/en.json",
    ja: "./locales/ja.json",
  },

  runtimeVersion: { policy: "appVersion" },
  updates: {
    url: "https://u.expo.dev/c8aaf04f-9b9b-43da-bb79-d27c2ccd9c75",
  },

  plugins: [
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
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        // Android/iOSともに未設定だとネイティブSDKがクラッシュし得る
        // App ID（ca-app-pub-...~...）をここに直書きする
        // TODO: 後で自分のApp IDに差し替える
        androidAppId: "ca-app-pub-3940256099942544~3347511713",
        iosAppId: "ca-app-pub-4363360791941587~2522581277",
        userTrackingUsageDescription: "許可すると、あなたに合った広告が表示されるようになります。",
        skAdNetworkItems: [
          'cstr6suwn9.skadnetwork',
          '4fzdc2evr5.skadnetwork',
          '2fnua5tdw4.skadnetwork',
          'ydx93a7ass.skadnetwork',
          'p78axxw29g.skadnetwork',
          'v72qych5uu.skadnetwork',
          'ludvb6z3bs.skadnetwork',
          'cp8zw746q7.skadnetwork',
          '3sh42y64q3.skadnetwork',
          'c6k4g5qg8m.skadnetwork',
          's39g8k73mm.skadnetwork',
          '3qy4746246.skadnetwork',
          'f38h382jlk.skadnetwork',
          'hs6bdukanm.skadnetwork',
          'mlmmfzh3r3.skadnetwork',
          'v4nxqhlyqp.skadnetwork',
          'wzmmz9fp6w.skadnetwork',
          'su67r6k2v3.skadnetwork',
          'yclnxrl5pm.skadnetwork',
          't38b2kh725.skadnetwork',
          '7ug5zh24hu.skadnetwork',
          'gta9lk7p23.skadnetwork',
          'vutu7akeur.skadnetwork',
          'y5ghdn5j9k.skadnetwork',
          'v9wttpbfk9.skadnetwork',
          'n38lu8286q.skadnetwork',
          '47vhws6wlr.skadnetwork',
          'kbd757ywx3.skadnetwork',
          '9t245vhmpl.skadnetwork',
          'a2p9lx4jpn.skadnetwork',
          '22mmun2rn5.skadnetwork',
          '44jx6755aq.skadnetwork',
          'k674qkevps.skadnetwork',
          '4468km3ulz.skadnetwork',
          '2u9pt9hc89.skadnetwork',
          '8s468mfl3y.skadnetwork',
          'klf5c3l5u5.skadnetwork',
          'ppxm28t8ap.skadnetwork',
          'kbmxgpxpgc.skadnetwork',
          'uw77j35x4d.skadnetwork',
          '578prtvx9j.skadnetwork',
          '4dzt52r2t5.skadnetwork',
          'tl55sbb4fm.skadnetwork',
          'c3frkrj4fj.skadnetwork',
          'e5fvkxwrpn.skadnetwork',
          '8c4e2ghe7u.skadnetwork',
          '3rd42ekr43.skadnetwork',
          '97r2b46745.skadnetwork',
          '3qcr597p9d.skadnetwork',
        ],
      },
    ],
    "expo-router",
    "expo-sqlite",
    "expo-localization",
    "expo-web-browser",
    "expo-mail-composer",
    "expo-notifications",
  ],
});
