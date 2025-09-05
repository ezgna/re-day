import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

export default function FeatureCarousel() {
  const [page, setPage] = useState(0);

  return (
    <>
      <PagerView style={styles.container} initialPage={0} onPageSelected={(e) => setPage(e.nativeEvent.position)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.page} key="1">
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.iconBg}>
              <MaterialCommunityIcons name="pencil" style={styles.icon} />
            </LinearGradient>
            <Text style={styles.title}>{i18n.t("onboarding.step1.title")}</Text>
            {(i18n.t("onboarding.step1.description", { returnObjects: true }) as string[]).map((line, index) => (
              <Text key={`step1-${index}`} style={styles.desc}>
                {line === "" ? " " : line}
              </Text>
            ))}
          </View>
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.page} key="2">
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.iconBg}>
              <MaterialCommunityIcons name="book-open-page-variant" style={styles.icon} />
            </LinearGradient>
            <Text style={styles.title}>{i18n.t("onboarding.step2.title")}</Text>
            {(i18n.t("onboarding.step2.description", { returnObjects: true }) as string[]).map((line, index) => (
              <Text key={`step2-${index}`} style={styles.desc}>
                {line === "" ? " " : line}
              </Text>
            ))}
          </View>
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.page} key="3">
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.iconBg}>
              <MaterialCommunityIcons name="robot-happy" style={styles.icon} />
            </LinearGradient>
            <Text style={styles.title}>{i18n.t("onboarding.step3.title")}</Text>
            {(i18n.t("onboarding.step3.description", { returnObjects: true }) as string[]).map((line, index) => (
              <Text key={`step3-${index}`} style={styles.desc}>
                {line === "" ? " " : line}
              </Text>
            ))}
          </View>
        </ScrollView>
      </PagerView>
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === page && styles.activeDot]} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: theme.spacing.md,
  },
  page: {
    alignItems: "center",
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#fff",
    fontSize: 40,
    marginBottom: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  desc: {
    fontSize: Platform.select({
      ios: 14,
      android: 13,
    }),
    fontWeight: "400",
    color: theme.colors.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 16
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#667EEA",
    width: 16,
  },
});
