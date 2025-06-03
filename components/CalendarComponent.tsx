// components/CalendarComponent.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Booking {
  date: string; // Format: "YYYY-MM-DD"
  details: {
    name: string;
    gender: string;
    age: number;
    time: string;
  };
}

interface CalendarComponentProps {
  isExpanded: boolean;
  onToggle: () => void;
  bookings?: Booking[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  isExpanded,
  onToggle,
  bookings = [],
}) => {
  const currentDate = new Date(); // June 3, 2025, Tuesday
  const currentDateString = currentDate.toISOString().split("T")[0]; // "2025-06-03"

  const markedDates = bookings.reduce((acc, booking) => {
    acc[booking.date] = {
      marked: true,
      dotColor: "#F5D2BD",
    };
    return acc;
  }, {} as { [key: string]: { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string; selectedTextColor?: string } });

  markedDates[currentDateString] = {
    ...markedDates[currentDateString],
    selected: true,
    selectedColor: "#69417E",
    selectedTextColor: "#FFF",
  };

  const getWeekDates = (date: Date) => {
    const dates = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.9}
      style={styles.calendarContainer}
    >
      {isExpanded ? (
        <Calendar
          current={currentDateString}
          firstDay={1} // Start week on Monday
          markedDates={markedDates}
          theme={{
            backgroundColor: "#FFF",
            calendarBackground: "#FFF",
            textSectionTitleColor: "#6B7280",
            dayTextColor: "#000",
            todayTextColor: "#69417E",
            selectedDayBackgroundColor: "#F1E6FF",
            selectedDayTextColor: "#69417E",
            monthTextColor: "#000",
            textDayFontFamily: "InterMedium",
            textMonthFontFamily: "InterSemiBold",
            textDayHeaderFontFamily: "InterRegular",
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          style={styles.fullCalendar}
          renderArrow={(direction) => (
            <Ionicons
              name={direction === "left" ? "chevron-back" : "chevron-forward"}
              size={20}
              color="#69417E"
            />
          )}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
        />
      ) : (
        <View style={styles.weekContainer}>
          {weekDates.map((date, index) => {
            const dateString = date.toISOString().split("T")[0];
            const isCurrentDate =
              date.getDate() === currentDate.getDate() &&
              date.getMonth() === currentDate.getMonth() &&
              date.getFullYear() === currentDate.getFullYear();
            const hasBooking = bookings.some(
              (booking) => booking.date === dateString
            );
            return (
              <View key={index} style={styles.weekDateContainer}>
                <View
                  style={[
                    styles.dateDayWrapper,
                    isCurrentDate && styles.currentDateDayWrapper,
                  ]}
                >
                  <Text
                    style={[
                      styles.weekDayText,
                      isCurrentDate && styles.currentWeekText,
                    ]}
                  >
                    {daysOfWeek[index].slice(0, 1)}
                  </Text>
                  <Text
                    style={[
                      styles.weekDateText,
                      isCurrentDate && styles.currentWeekText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
                {hasBooking && <View style={styles.bookingDot} />}
              </View>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: -9,
    marginBottom: 16,
    marginHorizontal: 15,
  },
  fullCalendar: {
    borderRadius: 8,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDateContainer: {
    alignItems: "center",
  },
  dateDayWrapper: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  currentDateDayWrapper: {
    backgroundColor: "#F1E6FF",
    borderRadius: 20, // Circular shape (adjusted based on content size)
  },
  weekDayText: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: "#6B7280",
  },
  weekDateText: {
    fontFamily: "InterMedium",
    fontSize: 16,
    color: "#000",
    marginTop: 2, // Reduced margin to bring day and date closer
  },
  currentWeekText: {
    color: "#69417E",
  },
  bookingDot: {
    width: 6,
    height: 6,
    backgroundColor: "#F5D2BD",
    borderRadius: 3,
    marginTop: 4, // Adjusted to position below the circle
  },
});
