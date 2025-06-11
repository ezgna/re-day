import DiaryReflectionButton from "@/src/components/DiaryReflectionButton";
import OpenCalendarButton from "@/src/components/OpenCalendarButton";
import SaveButton from "@/src/components/SaveButton";
import { fetchEntries, initDB, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { summarizeContent } from "@/utils/api";
import { formatDashedDateToSlashed, getRandomDateContents } from "@/utils/date";
import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const placeholders = ["placeholder1", "placeholder2", "placeholder3", "placeholder4", "placeholder5"];
const STORAGE_KEY = "summary_cache";

const Index = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [randomDateContents, setRandomDateContents] = useState<{ randomDate: string; contents: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholderKey, setPlaceholderKey] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    setPlaceholderKey(placeholders[randomIndex]);
  }, []);

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        await initDB();
        const data = await fetchEntries();
        setEntries(data);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    initAndFetch();
  }, []);

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cachedSummary = await AsyncStorage.getItem(STORAGE_KEY);
        if (cachedSummary) {
          setResponseData(cachedSummary);
        }
      } catch (error) {
        console.error("Failed to load cached summary:", error);
      }
    };
    loadCache();
  }, []);

  useEffect(() => {
    const result = getRandomDateContents(entries);
    setRandomDateContents(result);
  }, [entries]);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      if (randomDateContents) {
        const slashedRandomDate = formatDashedDateToSlashed(randomDateContents.randomDate);

        const summary = await summarizeContent(slashedRandomDate, randomDateContents.contents, "Japanese");
        setResponseData(summary);
        await AsyncStorage.setItem(STORAGE_KEY, summary);
      } else {
        console.log("No randomDateContents");
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
    } finally {
      setLoading(false);
    }
  };

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
      params: { pickedDate: randomDateContents?.randomDate },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 2 }}>
        {responseData && (
          <View style={styles.card}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.cardText}>{responseData}</Text>
              <View style={styles.buttonContainer}>
                <OpenCalendarButton onPress={openCalendar} />
              </View>
            </ScrollView>
          </View>
        )}
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
        <DiaryReflectionButton onPress={handleSummarize} loading={loading} />
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
    paddingBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.primary,
    lineHeight: 24,
    // marginBottom: theme.spacing.sm,
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
    marginTop: theme.spacing.xs,
  },
});
