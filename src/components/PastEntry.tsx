import { formatToLocalDateTimeString } from "@/utils/date";
import React, { FC } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Entry } from "../database/types";
import { EditActionSheet } from "./EditActionSheet";
import { theme } from "@/utils/theme";

interface PastEntryProps {
  entries: Entry[];
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
}

const PastEntry: FC<PastEntryProps> = ({ entries, onDelete, onEdit }) => {
  return (
    <>
      {entries.map((entry) => {
        const displayDate = formatToLocalDateTimeString(entry.created_at);

        return (
          <View style={styles.container} key={entry.id}>
            <View style={styles.entryWrapper}>
              <View style={styles.entryHeader}>
                <Text style={styles.timestamp}>{displayDate}</Text>
                <EditActionSheet deleteEntry={() => onDelete(entry.id)} editEntry={() => onEdit(entry.id, entry.content)} />
              </View>
              <TextInput value={entry.content} editable={false} multiline style={styles.entryContent} selectionColor={theme.colors.selection} />
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
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.light,
  },
  entryWrapper: {
    margin: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  entryContent: {
    fontSize: 16,
    marginTop: theme.spacing.xs,
    color: theme.colors.primary,
    padding: 0,
  },
});
