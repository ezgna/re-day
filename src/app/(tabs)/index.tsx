import DiaryReflectionButton from "@/src/components/DiaryReflectionButton";
import FeatureCarousel from "@/src/components/FeatureCarousel";
import FlipPressable from "@/src/components/FlipPressable";
import OpenCalendarButton from "@/src/components/OpenCalendarButton";
import SaveButton from "@/src/components/SaveButton";
import { fetchEntries, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { summarizeContent } from "@/utils/api";
import { formatDashedDateToSlashed, getRandomDateContents } from "@/utils/date";
import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import FlipCard from "react-native-flip-card";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "summary_cache";
const DEADLINE_KEY = "reflectionCooldownDeadline";
const COOLDOWN_SEC = 5 * 60;

const Index = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [responseData, setResponseData] = useState<{ title: string; summary: string } | null>(null);
  const [randomDateContents, setRandomDateContents] = useState<{ randomDate: string; contents: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [pickedDate, setPickedDate] = useState("");
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(COOLDOWN_SEC);
  const [flipped, setFlipped] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const placeholders = i18n.t("placeholders", { returnObjects: true }) as string[];

  const handleKeyboardVisible = (visible: boolean) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKeyboardVisible(visible);
  };

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      handleKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      handleKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    setFlipped(!!responseData);
  }, [responseData]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    setPlaceholder(placeholders[randomIndex]);
  }, [placeholders]);

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
        position: Toast.positions.CENTER,
      });
      setContent("");
      return;
    }
    try {
      await insertEntry(content);
      setContent("");
      await loadEntries();
      Toast.show(i18n.t("save_success"), {
        position: Toast.positions.CENTER,
      });
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
        const language = i18n.locale === "ja" ? "Japanese" : "English";

        const result = await summarizeContent(slashedRandomDate, randomDateContents.contents, language);
        setResponseData(result);

        const cache = {
          date: randomDateContents.randomDate,
          title: result.title,
          summary: result.summary,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
        await loadCache();

        const deadline = Date.now() + COOLDOWN_SEC * 1000;
        await AsyncStorage.setItem(DEADLINE_KEY, String(deadline));
        setIsCountingDown(true);
      } else {
        Toast.show(i18n.t("noRecords"), {
          position: Toast.positions.CENTER,
        });
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1.5 }}>
          <FlipCard flip={flipped} style={styles.card} friction={30} perspective={1000} flipHorizontal={true} flipVertical={false} clickable={false}>
            <View style={styles.face}>
              <FlipPressable
                onPress={() => setFlipped(!flipped)}
                style={{
                  alignSelf: "flex-end",
                  paddingRight: theme.spacing.sm,
                  paddingTop: theme.spacing.md,
                }}
              />
              <FeatureCarousel />
            </View>

            <View style={styles.back}>
              {responseData ? (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} selectable>
                      {responseData.title}
                    </Text>
                    <FlipPressable onPress={() => setFlipped(!flipped)} />
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TextInput value={responseData.summary} editable={false} multiline style={styles.cardText} selectionColor={theme.colors.selection} />
                    <View style={styles.buttonContainer}>
                      <OpenCalendarButton onPress={openCalendar} />
                    </View>
                  </ScrollView>
                </>
              ) : (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={{ fontSize: 20, fontWeight: 600 }}>{i18n.t("sample_response")}</Text>
                    <FlipPressable onPress={() => setFlipped(!flipped)} />
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.cardTitle, { marginBottom: theme.spacing.md }]}>{i18n.t("reflection.title")}</Text>
                    {(i18n.t("reflection.overview", { returnObjects: true }) as string[]).map((line, index) => (
                      <Text key={index} style={styles.cardText}>
                        {line === "" ? " " : line}
                      </Text>
                    ))}
                  </ScrollView>
                </>
              )}
            </View>
          </FlipCard>
        </View>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.placeholder}
              value={content}
              onChangeText={setContent}
              multiline
              onBlur={() => Keyboard.dismiss()}
            />
            <View style={styles.buttonContainer}>
              <SaveButton onPress={() => handleInsert(content)} />
            </View>
          </View>
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss} />
          {!keyboardVisible && (
            <DiaryReflectionButton
              onPress={handleGenerateReflection}
              loading={loading}
              cooldownTime={cooldownTime}
              isCountingDown={isCountingDown}
              onFinish={handleCountDownFinish}
            />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.iosOnlyLight,
  },
  face: {
    flex: 1,
  },
  back: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingRight: theme.spacing.sm,
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
    maxHeight: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing.sm,
  },
});
