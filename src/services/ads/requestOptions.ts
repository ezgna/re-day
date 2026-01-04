import { NativeAdChoicesPlacement, type NativeAdRequestOptions } from "react-native-google-mobile-ads";

export const getNativeAdRequestOptions = (npa: boolean): NativeAdRequestOptions => {
  return {
    // iOSのATTなどで「追跡しない」場合にNPAを要求する
    requestNonPersonalizedAdsOnly: npa,
    // 右上にAdChoicesを出す（デフォルトも右上だが明示）
    adChoicesPlacement: NativeAdChoicesPlacement.TOP_RIGHT,
    // 動画があっても初期はミュート
    startVideoMuted: true,
  };
};

