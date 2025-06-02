import PastEntry from "@/src/components/PastEntry";
import { deleteEntry, fetchEntries, initDB, updateEntry } from "@/src/database/db";
import { Entry } from "@/src/database/types";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const CalendarView = () => {
  const [selected, setSelected] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const initAndFetch = async () => {
      try {
        await initDB();
        const data = await fetchEntries();
        setEntries(data);
      } catch (error) {
        console.error(error);
      }
    };
    initAndFetch();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSelected(today);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: number, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const handleUpdate = async () => {
    if (!editingId) {
      console.log("you tried to handle update without editingId ");
      return;
    }
    const trimmedContent = editingContent.trim();
    if (!trimmedContent) {
      console.log("content_cannot_be_empty");
      return;
    }
    try {
      await updateEntry(editingId, trimmedContent);
      setEditingId(null);
      setEditingContent("");
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async () => {
    setEditingId(null);
    setEditingContent("");
  };

  const filteredEntries = selected ? entries.filter((entry) => entry.created_at.slice(0, 10) === selected) : [];

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: { selected: true, selectedColor: "orange" },
        }}
      />
      <View style={styles.entryContainer}>
        {editingId ? (
          <View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={editingContent} onChangeText={setEditingContent} />
            </View>
            <Button title="cancel" onPress={() => handleCancel()} />
            <Button title="save" onPress={() => handleUpdate()} />
          </View>
        ) : null}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <PastEntry entries={filteredEntries} onDelete={handleDelete} onEdit={handleEdit} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 16,
    flex: 1, // for scrollView
  },
  calendar: {
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  entryContainer: {
    flex: 1, // for scrollView
    paddingTop: 16,
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
});
