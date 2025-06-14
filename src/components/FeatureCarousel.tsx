import { theme } from "@/utils/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

export default function FeatureCarousel() {
  const [page, setPage] = useState(0);

  return (
    <View style={styles.container}>
      <PagerView style={styles.container} initialPage={0} onPageSelected={(e) => setPage(e.nativeEvent.position)}>
        <View style={styles.page} key="1">
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.iconBg}>
            <MaterialCommunityIcons name="pencil" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.title}>まずは一言書いてみよう！</Text>
          <Text style={styles.desc}>
            今日の出来事でも、今ふと思いついたことでも、{"\n"}単なるメモでもOK。{"\n"}
            {"\n"}
            保存した記録はカレンダーからいつでも見られます。
          </Text>
        </View>

        <View style={styles.page} key="2">
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.iconBg}>
            <MaterialCommunityIcons name="book-open-page-variant" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.title}>過去の思い出をワンタップで</Text>
          <Text style={styles.desc}>
            日記はつけているけど、振り返るのは面倒...。{"\n"}
            結局あまり見返さないんだよね...。{"\n"}
            {"\n"}
            そんな時のための、『振り返る』ボタン。{"\n"}
            試しに、一度押してみましょう！
          </Text>
        </View>

        <View style={styles.page} key="3">
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.iconBg}>
            <MaterialCommunityIcons name="robot-happy" style={styles.icon} />
          </LinearGradient>
          <Text style={styles.title}>AIおすすめの1日をピックアップ</Text>
          <Text style={styles.desc}>
            その日に書いた日記をAIが自動解析！{"\n"}
            {"\n"}
            忘れかけていた記憶を新たな視点から振り返ってみると{"\n"}
            思いがけない気づきや発見があるかも。{"\n"}
          </Text>
        </View>
      </PagerView>
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === page && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.sm,
    // marginBottom: theme.spacing.md,
    // marginHorizontal: theme.spacing.sm,
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
    marginBottom: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  desc: {
    fontSize: 14,
    fontWeight: "400",
    color: theme.colors.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    alignSelf: "center",
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
