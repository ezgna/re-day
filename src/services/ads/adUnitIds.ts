import Constants from "expo-constants";
import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

type AdsExtra = {
  nativeAdUnitIdIos?: string;
  nativeAdUnitIdAndroid?: string;
};

const getAdsExtra = (): AdsExtra | undefined => {
  const extra = Constants.expoConfig?.extra ?? (Constants.manifest as { extra?: unknown } | null)?.extra;
  const ads = (extra as { ads?: unknown } | undefined)?.ads;
  return ads as AdsExtra | undefined;
};

export const getNativeAdUnitId = (): string | null => {
  if (__DEV__) {
    return TestIds.NATIVE;
  }

  if (Platform.OS === "web") {
    return null;
  }

  const ads = getAdsExtra();
  const unitId = Platform.OS === "ios" ? ads?.nativeAdUnitIdIos : ads?.nativeAdUnitIdAndroid;
  if (typeof unitId !== "string" || unitId.trim().length === 0) {
    return null;
  }
  return unitId.trim();
};

