import PastEntry from "@/src/components/PastEntry";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const CalendarView = () => {
  const [selected, setSelected] = useState("");

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
        {/* <PastEntry /> */}
      </View>
    </SafeAreaView>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 16,
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
    paddingVertical: 16,
  },
});
