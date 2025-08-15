/* eslint-disable react-hooks/exhaustive-deps */
import { ms, s, vs } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  I18nManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { PanGestureHandler, State } from "react-native-gesture-handler";
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
  selectedRange?: { startDate: Date | null; endDate: Date | null };
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  isExpanded,
  bookings = [],
  showMonthYear = false,
  withBackgroundColor = false,
  onDateChange,
  selectedDate,
  selectedRange,
}) => {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];

  const [visibleDate, setVisibleDate] = useState(currentDate);
  const [weekOffset, setWeekOffset] = useState(0);
  const translateX = new Animated.Value(0);

  useEffect(() => {
    if (!isExpanded) {
      setVisibleDate(currentDate);
      setWeekOffset(0);
    }
  }, [isExpanded]);

  const markedDates = bookings.reduce((acc, booking) => {
    acc[booking.date] = {
      marked: true,
      dotColor: "#F5D2BD",
    };
    return acc;
  }, {} as { [key: string]: any });

  if (selectedRange?.startDate) {
    const startStr = selectedRange.startDate.toISOString().split("T")[0];

    if (!selectedRange.endDate) {
      markedDates[startStr] = {
        selected: true,
        selectedColor: "#69417E",
        selectedTextColor: "#FFF",
        startingDay: true,
        endingDay: true,
      };
    } else {
      const endStr = selectedRange.endDate.toISOString().split("T")[0];
      let current = new Date(selectedRange.startDate);
      while (current <= selectedRange.endDate) {
        const dateStr = current.toISOString().split("T")[0];
        markedDates[dateStr] = {
          selected: true,
          selectedColor: "#69417E",
          selectedTextColor: "#FFF",
          ...(dateStr === startStr && { startingDay: true }),
          ...(dateStr === endStr && { endingDay: true }),
        };
        current.setDate(current.getDate() + 1);
      }
    }
  }

  // ✅ Fixed week calculation so Sunday doesn't jump to next Monday
  const getWeekDates = (baseDate: Date, offset = 0) => {
    const startOfWeek = new Date(baseDate);
    const dayOfWeek = startOfWeek.getDay(); // Sun=0, Mon=1, ...
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday → back to previous Monday
    startOfWeek.setDate(startOfWeek.getDate() + daysToMonday + offset * 7);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const currentWeekDates = getWeekDates(currentDate, weekOffset);
  const formattedMonthYear = currentWeekDates[0].toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const weekDates = currentWeekDates;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const onSwipe = (direction: "left" | "right") => {
    const change = direction === "left" ? 1 : -1;
    Animated.timing(translateX, {
      toValue: direction === "left" ? -300 : 300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setWeekOffset((prev) => prev + change);
      translateX.setValue(0);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const threshold = 60;
      if (nativeEvent.translationX < -threshold) {
        onSwipe(I18nManager.isRTL ? "right" : "left");
      } else if (nativeEvent.translationX > threshold) {
        onSwipe(I18nManager.isRTL ? "left" : "right");
      }
    }
  };

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
            if (onDateChange) {
              onDateChange(selected);
            }
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
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[styles.weekContainer, { transform: [{ translateX }] }]}
          >
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
                    onDateChange?.(new Date(date)); // ✅ Send exact clicked date
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
                    {hasBooking && <View style={styles.bookingDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </PanGestureHandler>
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
    width: "100%",
    marginHorizontal: s(1),
    marginBottom: vs(16),
    borderRadius: ms(16),
    overflow: "hidden",
  },
  calendarContainer: {
    width: "100%",
    borderRadius: ms(16),
    padding: s(12),
  },
  gradientBackground: {
    padding: s(12),
    borderRadius: ms(16),
    width: "100%",
  },
  fullCalendar: {
    borderRadius: ms(8),
    width: "100%",
    alignSelf: "center",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDateContainer: {
    alignItems: "center",
    flex: 1,
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
    width: ms(4),
    height: ms(4),
    backgroundColor: "rgba(105, 65, 126, 1)",
    borderRadius: ms(3),
    marginTop: vs(1),
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
