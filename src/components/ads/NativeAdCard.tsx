import { selectNpa, useAdsConsentStore } from "@/src/stores/useAdsConsentStore";
import { getNativeAdUnitId } from "@/src/services/ads/adUnitIds";
import { getNativeAdRequestOptions } from "@/src/services/ads/requestOptions";
import { theme } from "@/utils/theme";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Platform, StyleSheet, Text } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  type NativeAdRequestOptions,
} from "react-native-google-mobile-ads";

const NativeAdCard = () => {
  const isWeb = Platform.OS === "web";
  const npa = useAdsConsentStore(selectNpa);
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  const unitId = useMemo(() => getNativeAdUnitId(), []);
  const requestOptions: NativeAdRequestOptions = useMemo(() => getNativeAdRequestOptions(npa), [npa]);

  useEffect(() => {
    if (isWeb) return;
    if (!unitId) return;

    let active = true;
    NativeAd.createForAdRequest(unitId, requestOptions)
      .then((ad) => {
        if (!active) {
          ad.destroy();
          return;
        }
        setNativeAd(ad);
      })
      .catch((error) => {
        if (__DEV__) {
          console.warn("[Ads] NativeAd load failed", error);
        }
      });

    return () => {
      active = false;
    };
  }, [isWeb, unitId, requestOptions]);

  useEffect(() => {
    if (!nativeAd) return;
    return () => {
      nativeAd.destroy();
    };
  }, [nativeAd]);

  // 仕様: ロードできたら表示、失敗したら枠ごと消す
  if (isWeb || !nativeAd) return null;

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.container}>
      {/* 小さめのネイティブ広告（360x100相当を目指す）。iOSの警告回避のため、アセットはNativeAdView直下に配置する */}
      {nativeAd.icon?.url ? (
        <NativeAsset assetType={NativeAssetType.ICON}>
          <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
        </NativeAsset>
      ) : null}

      <NativeAsset assetType={NativeAssetType.HEADLINE}>
        <Text style={styles.headline} numberOfLines={2}>
          {nativeAd.headline}
        </Text>
      </NativeAsset>

      {/* <Text style={styles.badge} numberOfLines={1}>
        広告
      </Text> */}

      {nativeAd.callToAction ? (
        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <Text style={styles.cta} numberOfLines={1}>
            {nativeAd.callToAction}
          </Text>
        </NativeAsset>
      ) : null}
    </NativeAdView>
  );
};

export default NativeAdCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 0.5,
    borderColor: "gainsboro",
    height: 56,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 8,
  },
  headline: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF1F6",
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.secondary,
  },
  cta: {
    marginLeft: 72,
    minHeight: 32,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.onPrimary,
    backgroundColor: theme.colors.selection,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
});
