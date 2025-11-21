import DiaryReflectionButton from "@/src/components/DiaryReflectionButton";
import FeatureCarousel from "@/src/components/FeatureCarousel";
import FlipCard from "@/src/components/FlipCardReanimated";
import FlipPressable from "@/src/components/FlipPressable";
import OpenCalendarButton from "@/src/components/OpenCalendarButton";
import SaveButton from "@/src/components/SaveButton";
import { fetchEntries, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { useDraftStore } from "@/src/stores/useDraftStore";
import ReminderService from "@/src/services/ReminderService";
import { summarizeContent } from "@/utils/api";
import { formatDashedDateToSlashed, getRandomDateContents } from "@/utils/date";
import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, LayoutChangeEvent, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const STORAGE_KEY = "summary_cache";
const DEADLINE_KEY = "reflectionCooldownDeadline";
const COOLDOWN_SEC = 60 * 5;

const Index = () => {
  const insets = useSafeAreaInsets();

  const content = useDraftStore((s) => s.content);
  const setContent = useDraftStore((s) => s.setContent);
  const clearDraft = useDraftStore((s) => s.clear);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [responseData, setResponseData] = useState<{ title: string; summary: string } | null>(null);
  const [randomDateContents, setRandomDateContents] = useState<{ randomDate: string; contents: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [pickedDate, setPickedDate] = useState("");
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(COOLDOWN_SEC);
  const [flipped, setFlipped] = useState(false);

  // placeholder はマウント時＋言語変化時のみ決定
  useEffect(() => {
    const arr = i18n.t("placeholders", { returnObjects: true }) as string[];
    if (Array.isArray(arr) && arr.length > 0) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      setPlaceholder(arr[randomIndex]);
    }
  }, []);

  useEffect(() => {
    setFlipped(!!responseData);
  }, [responseData]);

  const loadEntries = async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadEntries();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const loadCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { date, title, summary } = JSON.parse(raw);
        setResponseData({ title, summary });
        setPickedDate(date);
      }
    } catch (error) {
      console.error("Failed to load cached summary:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await loadCache();
    })();
  }, []);

  useEffect(() => {
    const result = getRandomDateContents(entries);
    setRandomDateContents(result);
  }, [entries]);

  const handleInsert = async (txt: string) => {
    if (!txt.trim()) {
      Toast.show(i18n.t("content_cannot_be_empty"), { position: Toast.positions.CENTER });
      // ★ 書きかけは空文字にしておく（Zustand にも保存される）
      setContent("");
      return;
    }
    try {
      await insertEntry(txt);
      // ★ 保存成功後に draft クリア（永続化された草稿も空に）
      clearDraft();
      await loadEntries();
      Toast.show(i18n.t("save_success"), { position: Toast.positions.CENTER });
      try {
        await ReminderService.handleEntrySaved();
      } catch (reminderError) {
        console.error("ReminderService.handleEntrySaved failed", reminderError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openCalendar = () => {
    // 毎回ユニークな t を付与して受け側で再マウントを強制
    router.push({ pathname: "/calendarview", params: { pickedDate, t: String(Date.now()) } });
  };

  const handleGenerateReflection = async () => {
    setLoading(true);
    try {
      if (randomDateContents) {
        const slashedRandomDate = formatDashedDateToSlashed(randomDateContents.randomDate);
        const language = i18n.locale === "ja" ? "Japanese" : "English";
        const result = await summarizeContent(slashedRandomDate, randomDateContents.contents, language);
        setResponseData(result);
        const cache = { date: randomDateContents.randomDate, title: result.title, summary: result.summary };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
        await loadCache();
        const deadline = Date.now() + COOLDOWN_SEC * 1000;
        await AsyncStorage.setItem(DEADLINE_KEY, String(deadline));
        setIsCountingDown(true);
      } else {
        Toast.show(i18n.t("noRecords"), { position: Toast.positions.CENTER });
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

  // const handleCountDownFinish = () => setIsCountingDown(false);

  const handleCountDownFinish = React.useCallback(() => {
    // 同フレームでのアンマウントを避ける
    requestAnimationFrame(() => setIsCountingDown(false));
    // or: setTimeout(() => setIsCountingDown(false), 0);
  }, []);

  const MIN_BACK_HEIGHT = 400;
  const [backMinHeight, setBackMinHeight] = useState(MIN_BACK_HEIGHT);
  const backHeightFrame = React.useRef<number | null>(null);
  const lastMeasuredBackHeight = React.useRef(MIN_BACK_HEIGHT);

  useEffect(() => {
    if (!responseData) {
      lastMeasuredBackHeight.current = MIN_BACK_HEIGHT;
      setBackMinHeight(MIN_BACK_HEIGHT);
    }
  }, [responseData]);

  const handleBackLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      if (!responseData) {
        if (lastMeasuredBackHeight.current !== MIN_BACK_HEIGHT) {
          lastMeasuredBackHeight.current = MIN_BACK_HEIGHT;
          setBackMinHeight(MIN_BACK_HEIGHT);
        }
        return;
      }

      if (backHeightFrame.current) {
        cancelAnimationFrame(backHeightFrame.current);
      }

      const { height } = event.nativeEvent.layout;
      backHeightFrame.current = requestAnimationFrame(() => {
        backHeightFrame.current = null;
        const rounded = Math.max(MIN_BACK_HEIGHT, Math.ceil(height));
        if (Math.abs(rounded - lastMeasuredBackHeight.current) >= 2) {
          lastMeasuredBackHeight.current = rounded;
          setBackMinHeight(rounded);
        }
      });
    },
    [responseData]
  );

  useEffect(() => {
    return () => {
      if (backHeightFrame.current) {
        cancelAnimationFrame(backHeightFrame.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 64 }}>
        {/* リフレクションボタン */}
        <View style={styles.reflectButtonContainer}>
          <DiaryReflectionButton
            onPress={handleGenerateReflection}
            loading={loading}
            cooldownTime={cooldownTime}
            isCountingDown={isCountingDown}
            onFinish={handleCountDownFinish}
          />
        </View>
        {/* 入力 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.placeholder}
            value={content}
            onChangeText={setContent} // ★ Zustand に書き込むだけ
            multiline
            onBlur={() => Keyboard.dismiss()}
          />
          <View style={styles.buttonContainer}>
            <SaveButton onPress={() => handleInsert(content)} />
          </View>
        </View>

        {/* カード（下段） */}
        <View style={{ flex: 1 }}>
          <FlipCard flip={flipped} perspective={1000} flipHorizontal flipVertical={false} style={styles.flipContainer}>
            {/* FRONT 面：影つきの箱ごと */}
            <View style={[styles.cardShadow, { height: 400 }]}>
              <View style={styles.face}>
                <FlipPressable onPress={() => setFlipped(!flipped)} style={{ alignSelf: "flex-end", paddingRight: theme.spacing.md, paddingTop: theme.spacing.md }} />
                <FeatureCarousel />
              </View>
            </View>

            {/* BACK 面：影つきの箱ごと */}
            <View style={[styles.cardShadow, { minHeight: backMinHeight }]} onLayout={handleBackLayout}>
              <View style={styles.back}>
                {responseData ? (
                  <View style={styles.cardInner}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} selectable>
                        {responseData.title}
                      </Text>
                      <FlipPressable onPress={() => setFlipped(!flipped)} />
                    </View>
                    <View>
                      <TextInput value={responseData.summary} editable={false} multiline style={styles.cardText} selectionColor={theme.colors.selection} />
                      <View style={styles.buttonContainer}>
                        <OpenCalendarButton onPress={openCalendar} />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.cardInner}>
                    <View style={styles.cardHeader}>
                      <Text style={{ fontSize: 20, fontWeight: 600 }}>{i18n.t("sample_response")}</Text>
                      <FlipPressable onPress={() => setFlipped(!flipped)} />
                    </View>
                    <View>
                      <Text style={[styles.cardTitle, { marginBottom: theme.spacing.md }]}>{i18n.t("reflection.title")}</Text>
                      {(i18n.t("reflection.overview", { returnObjects: true }) as string[]).map((line, index) => (
                        <Text key={index} style={styles.cardText}>
                          {line === "" ? " " : line}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </FlipCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  face: { flex: 1 },
  back: {},
  flipContainer: {
    flex: 1,
    marginTop: theme.spacing.md,
  },
  cardShadow: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    flexShrink: 0,
    ...theme.shadows.iosOnlyLight,
  },

  cardInner: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.primary,
    lineHeight: 24,
    padding: 0,
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
    maxHeight: 120,
    minHeight: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  reflectButtonContainer: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
});
