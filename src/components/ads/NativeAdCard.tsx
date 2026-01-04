import { selectNpa, useAdsConsentStore } from "@/src/stores/useAdsConsentStore";
import { getNativeAdUnitId } from "@/src/services/ads/adUnitIds";
import { getNativeAdRequestOptions } from "@/src/services/ads/requestOptions";
import { theme } from "@/utils/theme";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
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
      <View style={styles.headerRow}>
        {nativeAd.icon?.url ? (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        ) : null}

        <View style={styles.titleArea}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline} numberOfLines={1}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>
          {nativeAd.advertiser ? (
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text style={styles.advertiser} numberOfLines={1}>
                {nativeAd.advertiser}
              </Text>
            </NativeAsset>
          ) : null}
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>広告</Text>
        </View>
      </View>

      <NativeMediaView style={styles.media} />

      <View style={styles.footerRow}>
        {nativeAd.body ? (
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text style={styles.body} numberOfLines={2}>
              {nativeAd.body}
            </Text>
          </NativeAsset>
        ) : (
          <View style={styles.bodyPlaceholder} />
        )}

        {nativeAd.callToAction ? (
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <Text style={styles.cta} numberOfLines={1}>
              {nativeAd.callToAction}
            </Text>
          </NativeAsset>
        ) : null}
      </View>
    </NativeAdView>
  );
};

export default NativeAdCard;

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 0.5,
    borderColor: "gainsboro",
    padding: theme.spacing.md,
    ...theme.shadows.light,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
  },
  headline: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  advertiser: {
    marginTop: 2,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF1F6",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.secondary,
  },
  media: {
    marginTop: theme.spacing.sm,
    width: "100%",
    height: 120,
    borderRadius: theme.radius.sm,
  },
  footerRow: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  body: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.secondary,
  },
  bodyPlaceholder: {
    flex: 1,
  },
  cta: {
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
