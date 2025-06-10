import DiaryReflectionButton from "@/src/components/DiaryReflectionButton";
import SaveButton from "@/src/components/SaveButton";
import { fetchEntries, getRandomDateContents, initDB, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { summarizeContent } from "@/utils/api";
import { formatDashedDateToSlashed } from "@/utils/date";
import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [responseData, setResponseData] = useState(null);
  const [randomDateContents, setRandomDateContents] = useState<{ randomDate: string; contents: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

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
    const result = getRandomDateContents(entries);
    setRandomDateContents(result);
  }, [entries]);

  // const filteredEntries = randomDateContents?.randomDate ? entries.filter((entry) => formatToLocalDateString(entry.created_at) === randomDateContents.randomDate) : [];

  const handleSummarize = async () => {
    setLoading(true);
    try {
      if (randomDateContents) {
        const slashedRandomDate = formatDashedDateToSlashed(randomDateContents.randomDate);
        const summary = await summarizeContent(slashedRandomDate, randomDateContents.contents, "Japanese");
        setResponseData(summary);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 3 }}>
        {responseData && (
          <View style={styles.card}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.cardText}>{responseData}</Text>
            </ScrollView>
          </View>
        )}
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Write diary entry..." value={content} onChangeText={setContent} multiline />
          <View style={styles.buttonContainer}>
            <SaveButton onPress={() => handleInsert(content)} />
          </View>
        </View>
        {/* <ScrollView style={styles.pastEntries} showsVerticalScrollIndicator={false}>
        <PastEntry entries={filteredEntries} />
        </ScrollView> */}
        <DiaryReflectionButton onPress={() => handleSummarize()} loading={loading} />
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
    paddingVertical: theme.spacing.md,
  },
  card: {
    // padding: 10,
    // marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  pastEntries: {
    marginTop: 12,
  },
});
