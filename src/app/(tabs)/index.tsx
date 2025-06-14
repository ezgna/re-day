import DiaryReflectionButton from "@/src/components/DiaryReflectionButton";
import FeatureCarousel from "@/src/components/FeatureCarousel";
import OpenCalendarButton from "@/src/components/OpenCalendarButton";
import SaveButton from "@/src/components/SaveButton";
import { fetchEntries, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { summarizeContent } from "@/utils/api";
import { formatDashedDateToSlashed, getRandomDateContents } from "@/utils/date";
import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import FlipCard from "react-native-flip-card";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const placeholders = ["placeholder1", "placeholder2", "placeholder3", "placeholder4", "placeholder5"];
const STORAGE_KEY = "summary_cache";
const DEADLINE_KEY = "reflectionCooldownDeadline";
const COOLDOWN_SEC = 5 * 60;

const Index = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [randomDateContents, setRandomDateContents] = useState<{ randomDate: string; contents: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholderKey, setPlaceholderKey] = useState("");
  const [pickedDate, setPickedDate] = useState("");
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(COOLDOWN_SEC);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(!!responseData);
  }, [responseData]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    setPlaceholderKey(placeholders[randomIndex]);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchEntries();
        setEntries(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  const loadCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { date, summary } = JSON.parse(raw);
        setResponseData(summary);
        setPickedDate(date);
      }
    } catch (error) {
      console.error("Failed to load cached summary:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await loadCache();
      // await AsyncStorage.removeItem(STORAGE_KEY); // debug
      // await AsyncStorage.removeItem(DEADLINE_KEY); // debug
    })();
  }, []);

  useEffect(() => {
    const result = getRandomDateContents(entries);
    setRandomDateContents(result);
  }, [entries]);

  // console.log(randomDateContents?.randomDate); // debug

  const handleInsert = async (content: string) => {
    if (!content.trim()) {
      Toast.show(i18n.t("content_cannot_be_empty"), {
        position: Toast.positions.TOP,
      });
      setContent("");
      return;
    }
    try {
      await insertEntry(content);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const openCalendar = () => {
    router.replace({
      pathname: "/calendarview",
      params: { pickedDate: pickedDate },
    });
  };

  const handleGenerateReflection = async () => {
    setLoading(true);
    try {
      if (randomDateContents) {
        const slashedRandomDate = formatDashedDateToSlashed(randomDateContents.randomDate);

        const summary = await summarizeContent(slashedRandomDate, randomDateContents.contents, "Japanese");
        setResponseData(summary);

        const cache = {
          date: randomDateContents.randomDate,
          summary,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
        await loadCache();

        const deadline = Date.now() + COOLDOWN_SEC * 1000;
        await AsyncStorage.setItem(DEADLINE_KEY, String(deadline));
        setIsCountingDown(true);
      } else {
        console.log("No randomDateContents");
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(DEADLINE_KEY);
      if (!raw) return;

      const deadline = Number(raw);
      const diff = Math.ceil((deadline - Date.now()) / 1000);

      if (diff > 0) {
        setCooldownTime(diff);
        setIsCountingDown(true);
      } else {
        await AsyncStorage.removeItem(DEADLINE_KEY);
      }
    })();
  }, []);

  const handleCountDownFinish = () => {
    setIsCountingDown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 2 }}>
        <FlipCard flip={flipped} style={styles.card} friction={30} perspective={1000} flipHorizontal={true} flipVertical={false} clickable={false}>
          <View style={styles.face}>
            <Pressable onPress={() => setFlipped(!flipped)} style={styles.flipPressable}>
              <MaterialIcons name="flip" size={24} style={styles.icon} />
            </Pressable>
            <FeatureCarousel />
          </View>

          <View style={styles.back}>
            {responseData ? (
              <>
                <Pressable onPress={() => setFlipped(!flipped)} style={styles.flipPressable}>
                  <MaterialIcons name="flip" size={24} style={styles.icon} />
                </Pressable>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.cardText}>{responseData}</Text>
                  <View style={styles.buttonContainer}>
                    <OpenCalendarButton onPress={openCalendar} />
                  </View>
                </ScrollView>
              </>
            ) : (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: theme.spacing.md, paddingRight: theme.spacing.sm }}>
                  <Text style={{ fontSize: 20, fontWeight: 600 }}>Sample Response</Text>
                  <Pressable onPress={() => setFlipped(!flipped)} style={{}}>
                    <MaterialIcons name="flip" size={24} style={styles.icon} />
                  </Pressable>
                </View>
                <Text style={[styles.cardText, { marginTop: theme.spacing.md }]}>
                  📌 2025/06/14（3件の記録） {"\n"}
                  {"\n"}
                  🌿 この日は、ちょっぴりだらりとした気分と小さなアクションが入り混じる一日だったみたい。
                  Netflixを満喫しすぎて次に何を見るかワクワクしつつ、合間のストレッチで体の軽さを実感したり、肩こりや姿勢の悩みもちょこっと顔を出していたね。
                  やろうと思っていた洗濯は、ついベッドの誘惑に負けてお昼寝タイムへ突入！
                  でも、「まぁいいか」と自分を許して、スーパーの用事なんかもちゃんと考えていて、等身大のゆるやかな一日だったんだなぁと感じるよ。{"\n"}
                  {"\n"}
                  💬 ちょっとした予定変更も、心や体を労わるサインだと前向きに捉えたいね。 自分のペースで過ごすことで、日々の小さな幸せや気づきがきっと次に繋がっていくはず！
                </Text>
              </>
            )}
          </View>
        </FlipCard>
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={i18n.t(placeholderKey)}
            placeholderTextColor={theme.colors.placeholder}
            value={content}
            onChangeText={setContent}
            multiline
          />
          <View style={styles.buttonContainer}>
            <SaveButton onPress={() => handleInsert(content)} />
          </View>
        </View>
        <DiaryReflectionButton onPress={handleGenerateReflection} loading={loading} cooldownTime={cooldownTime} isCountingDown={isCountingDown} onFinish={handleCountDownFinish} />
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  face: {
    flex: 1,
  },
  back: {
    flex: 1,
  },
  flipPressable: {
    alignSelf: "flex-end",
    paddingRight: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  icon: {
    color: theme.colors.secondary,
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.primary,
    lineHeight: 24,
  },
  inputContainer: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    ...theme.shadows.light,
  },
  input: {
    fontSize: 16,
    color: theme.colors.secondary,
    maxHeight: 70,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing.sm,
  },
});
