/* eslint-disable react-hooks/exhaustive-deps */
import { ms, s, vs } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Booking {
  date: string;
  details: {
    name: string;
    gender: string;
    age: number;
    time: string;
  };
}

interface CalendarComponentProps {
  isExpanded: boolean;
  bookings?: Booking[];
  showMonthYear?: boolean;
  withBackgroundColor?: boolean;
  onDateChange?: (date: Date) => void;
  selectedDate?: Date;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  isExpanded,
  bookings = [],
  showMonthYear = false,
  withBackgroundColor = false,
  onDateChange,
  selectedDate,
}) => {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];

  const [visibleDate, setVisibleDate] = useState(currentDate);

  const formattedMonthYear = visibleDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!isExpanded) {
      setVisibleDate(currentDate);
    }
  }, [isExpanded]);

  const markedDates = bookings.reduce((acc, booking) => {
    acc[booking.date] = {
      marked: true,
      dotColor: "#F5D2BD",
    };
    return acc;
  }, {} as { [key: string]: any });

  if (selectedDate) {
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    markedDates[selectedDateString] = {
      ...markedDates[selectedDateString],
      selected: true,
      selectedColor: "#69417E",
      selectedTextColor: "#FFF",
    };
  }

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

  const renderCalendarContent = () => (
    <>
      {showMonthYear && !isExpanded && (
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>{formattedMonthYear}</Text>
        </View>
      )}

      {isExpanded ? (
        <Calendar
          onDayPress={(day) => {
            const selected = new Date(day.dateString);
            onDateChange?.(selected);
          }}
          current={currentDateString}
          firstDay={1}
          markedDates={markedDates}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#6B7280",
            dayTextColor: "#000",
            todayTextColor: "#69417E",
            selectedDayBackgroundColor: "#F1E6FF",
            selectedDayTextColor: "#69417E",
            monthTextColor: "#000",
            textDayFontFamily: "InterMedium",
            textMonthFontFamily: "InterSemiBold",
            textDayHeaderFontFamily: "InterRegular",
            textDayFontSize: ms(14),
            textMonthFontSize: ms(16),
            textDayHeaderFontSize: ms(12),
          }}
          style={styles.fullCalendar}
          renderArrow={(direction) => (
            <Ionicons
              name={direction === "left" ? "chevron-back" : "chevron-forward"}
              size={ms(20)}
              color="#69417E"
            />
          )}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          onMonthChange={(date) => {
            setVisibleDate(new Date(date.year, date.month - 1));
          }}
        />
      ) : (
        <View style={styles.weekContainer}>
          {weekDates.map((date, index) => {
            const dateString = date.toISOString().split("T")[0];
            const isSelectedDate =
              date.toDateString() === visibleDate.toDateString();
            const hasBooking = bookings.some(
              (booking) => booking.date === dateString
            );

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setVisibleDate(date);
                  onDateChange?.(date);
                }}
                style={styles.weekDateContainer}
              >
                <View
                  style={[
                    styles.dateDayWrapper,
                    isSelectedDate && styles.currentDateDayWrapper,
                  ]}
                >
                  <Text
                    style={[
                      styles.weekDayText,
                      isSelectedDate && styles.currentWeekText,
                    ]}
                  >
                    {daysOfWeek[index].slice(0, 1)}
                  </Text>
                  <Text
                    style={[
                      styles.weekDateText,
                      isSelectedDate && styles.currentWeekText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  {/* 👇 Dot goes here */}
                  {hasBooking && <View style={styles.bookingDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );

  return (
    <View style={styles.calendarWrapper}>
      {withBackgroundColor ? (
        <LinearGradient
          colors={["#F6E8FF", "#FAF5FF"]}
          style={styles.gradientBackground}
        >
          {renderCalendarContent()}
        </LinearGradient>
      ) : (
        <View style={styles.calendarContainer}>{renderCalendarContent()}</View>
      )}
    </View>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  calendarWrapper: {
    marginHorizontal: s(1),
    marginBottom: vs(16),
    borderRadius: ms(16),
    overflow: "hidden",
  },
  calendarContainer: {
    // backgroundColor: "#FFF",
    borderRadius: ms(16),
    padding: s(12),
  },
  gradientBackground: {
    padding: s(12),
    borderRadius: ms(16),
  },
  fullCalendar: {
    borderRadius: ms(8),
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
    paddingVertical: vs(6),
    paddingHorizontal: s(8),
  },
  currentDateDayWrapper: {
    backgroundColor: "#F1E6FF",
    borderRadius: ms(20),
  },
  weekDayText: {
    fontFamily: "InterRegular",
    fontSize: ms(12),
    color: "#6B7280",
  },
  weekDateText: {
    fontFamily: "InterMedium",
    fontSize: ms(16),
    color: "#000",
    marginTop: vs(2),
  },
  currentWeekText: {
    color: "#69417E",
  },
  bookingDot: {
    width: ms(6),
    height: ms(6),
    backgroundColor: "rgba(105, 65, 126, 1)",
    borderRadius: ms(3),
    marginTop: vs(4),
    shadowColor: "rgba(105, 65, 126, 1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  monthHeader: {
    alignItems: "center",
    paddingBottom: vs(6),
  },
  monthText: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#111827",
  },
});
