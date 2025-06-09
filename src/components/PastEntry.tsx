import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Entry } from "../database/types";
import { EditActionSheet } from "./EditActionSheet";

interface PastEntryProps {
  entries: Entry[];
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
}

const PastEntry: FC<PastEntryProps> = ({ entries, onDelete, onEdit }) => {
  return (
    <>
      {entries.map((entry) => {
        const localDateTime = new Date(entry.created_at).toLocaleString();

        return (
          <View style={styles.container} key={entry.id}>
            <View style={styles.entryWrapper}>
              <View style={styles.entryHeader}>
                <Text style={styles.timestamp}>{localDateTime}</Text>
                <EditActionSheet deleteEntry={() => onDelete(entry.id)} editEntry={() => onEdit(entry.id, entry.content)} />
              </View>
              <Text style={styles.entryContent}>{entry.content}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

export default PastEntry;

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  entryWrapper: {
    margin: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  entryContent: {
    fontSize: 16,
    marginTop: 2,
  },
});
