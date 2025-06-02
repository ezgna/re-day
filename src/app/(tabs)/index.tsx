import PastEntry from "@/src/components/PastEntry";
import { fetchEntries, getRandomDateContents, initDB, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import { summarizeContent } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [responseData, setResponseData] = useState("summary");
  const [randomDateContents, setRandomDateContents] = useState<{ randomDate: string; contents: string[] } | null>(
    null
  );

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

  const handleSummarize = async () => {
    try {
      if (randomDateContents) {
        const summary = await summarizeContent(randomDateContents.contents);
        setResponseData(summary);
      } else {
        console.log("No randomDateContents");
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="insert entry" onPress={() => insertEntry(content)} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write diary entry..."
          value={content}
          onChangeText={setContent}
        />
      </View>

      <View style={styles.card}>
        <Text>date</Text>
        <Text>{responseData}</Text>
      </View>

      <Text style={styles.title}>あの頃の私は・・・</Text>
      <Button title="button" onPress={() => handleSummarize()} />
      {/* <View style={styles.pastEntries}>
        <PastEntry entries={entries} />
        <Text>aaaa</Text>
      </View> */}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  inputContainer: {
    marginTop: 30,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
  },
  input: {
    marginVertical: 16,
    marginHorizontal: 10,
    fontSize: 20,
  },
  card: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8,
  },
  title: {
    marginTop: 30,
    fontSize: 26,
  },
  pastEntries: {
    marginTop: 12,
  },
});
