import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface CalendarProps {
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  markedDates?: Record<string, any>;
}

export function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  markedDates = {},
}: CalendarProps) {
  return (
    <View style={styles.container}>
      <RNCalendar
        minDate={minDate}
        maxDate={maxDate}
        onDayPress={(day) => onSelectDate?.(day.dateString)}
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              selected: true,
              selectedColor: "#16a34a",
              selectedTextColor: "#ffffff",
            },
          }),
        }}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#64748b",
          selectedDayBackgroundColor: "#16a34a",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#16a34a",
          dayTextColor: "#0f172a",
          textDisabledColor: "#cbd5e1",
          monthTextColor: "#0f172a",
          arrowColor: "#0f172a",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        renderArrow={(direction) =>
          direction === "left" ? (
            <ChevronLeft size={18} color="#0f172a" />
          ) : (
            <ChevronRight size={18} color="#0f172a" />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
});
