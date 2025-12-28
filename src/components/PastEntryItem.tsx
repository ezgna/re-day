import { Entry } from "@/src/database/types";
import { formatToLocalDateTimeString } from "@/utils/date";
import { theme } from "@/utils/theme";
import React, { memo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { EditActionSheet } from "./EditActionSheet";

interface PastEntryItemProps {
  entry: Entry;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
}

const PastEntryItem = memo(({ entry, onDelete, onEdit }: PastEntryItemProps) => {
  const displayDate = formatToLocalDateTimeString(entry.created_at);

  return (
    <View style={styles.container}>
      <View style={styles.entryWrapper}>
        <View style={styles.entryHeader}>
          <Text style={styles.timestamp}>{displayDate}</Text>
          <EditActionSheet deleteEntry={() => onDelete(entry.id)} editEntry={() => onEdit(entry.id, entry.content)} />
        </View>
        <TextInput value={entry.content} editable={false} multiline style={styles.entryContent} selectionColor={theme.colors.selection} scrollEnabled={false} />
      </View>
    </View>
  );
});

PastEntryItem.displayName = "PastEntryItem";

export default PastEntryItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 0.5,
    borderColor: "gainsboro",
  },
  entryWrapper: {
    margin: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: theme.spacing.sm,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  entryContent: {
    fontSize: 17,
    marginTop: theme.spacing.xs,
    color: theme.colors.primary,
    padding: 0,
  },
});
