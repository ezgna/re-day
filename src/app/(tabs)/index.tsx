import PastEntry from "@/src/components/PastEntry";
import { fetchEntries, initDB, insertEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const initAndFetch = async () => {
      await initDB();
      const data = await fetchEntries();
      setEntries(data);
    };
    initAndFetch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write diary entry..."
          value={content}
          onChangeText={setContent}
        />
      </View>
      <Text style={styles.title}>Past Entries</Text>
      <View style={styles.pastEntries}>
        <PastEntry entries={entries} />
      </View>
      <Button title="insert entry" onPress={() => insertEntry(content)} />
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
  title: {
    marginTop: 30,
    fontSize: 26,
  },
  pastEntries: {
    marginTop: 12,
  },
});
