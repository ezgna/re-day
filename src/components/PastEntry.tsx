import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Entry } from "../database/types";

interface PastEntryProps {
  entries: Entry[];
}

const PastEntry: FC<PastEntryProps> = ({ entries }) => {
  return (
    <>
      {entries.map((entry) => (
        <View style={styles.pastEntry} key={entry.id}>
          <View style={styles.entryTextContainer}>
            <Text style={styles.timestamp}>{entry.created_at}</Text>
            <Text style={styles.entryText}>{entry.content}</Text>
          </View>
        </View>
      ))}
    </>
  );
};

export default PastEntry;

const styles = StyleSheet.create({
  pastEntry: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  entryTextContainer: {
    marginVertical: 12,
    marginHorizontal: 10,
  },
  timestamp: {
    fontSize: 12,
  },
  entryText: {
    fontSize: 18,
  },
});
