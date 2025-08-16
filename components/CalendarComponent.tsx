/* eslint-disable react-hooks/exhaustive-deps */
import { ms, s, vs } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Booking {
  date: string;
  details: {
    name: string;
    gender: string;
    age: number | string;
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
  disablePastNavigation?: boolean; // only for home screen
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  isExpanded,
  bookings = [],
  showMonthYear = false,
  withBackgroundColor = false,
  onDateChange,
  selectedDate,
  selectedRange,
  disablePastNavigation = false,
}) => {
  // Today
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);
  const todayStr = today.toISOString().split("T")[0];

  const [visibleDate, setVisibleDate] = useState<Date>(selectedDate || today);
  const [weekOffset, setWeekOffset] = useState(0);

  // Reset only when expand/collapse changes
  useEffect(() => {
    if (!isExpanded) {
      setVisibleDate(selectedDate || today);
      setWeekOffset(0);
    }
  }, [isExpanded]);

  // Marked bookings
  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};
    bookings.forEach((b) => {
      marks[b.date] = { marked: true, dotColor: "#F5D2BD" };
    });

    if (selectedRange?.startDate) {
      const start = new Date(
        selectedRange.startDate.getFullYear(),
        selectedRange.startDate.getMonth(),
        selectedRange.startDate.getDate()
      );
      const end = selectedRange.endDate
        ? new Date(
            selectedRange.endDate.getFullYear(),
            selectedRange.endDate.getMonth(),
            selectedRange.endDate.getDate()
          )
        : start;

      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      const cur = new Date(start);
      while (cur <= end) {
        const ds = cur.toISOString().split("T")[0];
        marks[ds] = {
          selected: true,
          selectedColor: "#69417E",
          selectedTextColor: "#FFF",
          ...(ds === startStr && { startingDay: true }),
          ...(ds === endStr && { endingDay: true }),
        };
        cur.setDate(cur.getDate() + 1);
      }
    }

    return marks;
  }, [bookings, selectedRange]);

  // Week calculation
  const getWeekDates = (baseDate: Date, offset = 0) => {
    const startOfWeek = new Date(baseDate);
    const dow = startOfWeek.getDay(); // Sun=0, Mon=1...
    const deltaToMonday = dow === 0 ? -6 : 1 - dow;
    startOfWeek.setDate(startOfWeek.getDate() + deltaToMonday + offset * 7);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() + i
      );
      week.push(d);
    }
    return week;
  };

  const currentWeekDates = getWeekDates(today, weekOffset);
  const formattedMonthYear = currentWeekDates[0].toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const renderCalendarContent = () => (
    <>
      {isExpanded ? (
        <Calendar
          minDate={disablePastNavigation ? todayStr : undefined}
          onDayPress={(day) => {
            const d = new Date(day.dateString);
            const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            if (disablePastNavigation && dStart < today) return;
            setVisibleDate(d);
            onDateChange?.(d);
          }}
          current={(selectedDate || today).toISOString().split("T")[0]}
          firstDay={1}
          markedDates={markedDates}
          renderArrow={(direction) => (
            <Ionicons
              name={direction === "left" ? "chevron-back" : "chevron-forward"}
              size={ms(20)}
              color="#69417E"
            />
          )}
          disableArrowLeft={false}
          onPressArrowLeft={(subtractMonth) => {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            if (
              visibleDate.getFullYear() > currentYear ||
              (visibleDate.getFullYear() === currentYear &&
                visibleDate.getMonth() > currentMonth)
            ) {
              subtractMonth();
              setVisibleDate(
                new Date(
                  visibleDate.getFullYear(),
                  visibleDate.getMonth() - 1,
                  1
                )
              );
            }
          }}
          onPressArrowRight={(addMonth) => {
            addMonth();
            setVisibleDate(
              new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1)
            );
          }}
          onMonthChange={(m) => {
            setVisibleDate(new Date(m.year, m.month - 1, 1));
          }}
        />
      ) : (
        <View>
          {/* Week header with arrows */}
          <View style={styles.weekHeader}>
            <TouchableOpacity
              disabled={weekOffset === 0}
              onPress={() => {
                if (weekOffset > 0) setWeekOffset((prev) => prev - 1);
              }}
              style={[
                styles.arrowButton,
                weekOffset === 0 && styles.arrowDisabled,
              ]}
            >
              <Ionicons name="chevron-back" size={20} color="#69417E" />
            </TouchableOpacity>

            <Text style={styles.monthText}>{formattedMonthYear}</Text>

            <TouchableOpacity
              onPress={() => setWeekOffset((prev) => prev + 1)}
              style={styles.arrowButton}
            >
              <Ionicons name="chevron-forward" size={20} color="#69417E" />
            </TouchableOpacity>
          </View>

          {/* Week days */}
          <View style={styles.weekContainer}>
            {currentWeekDates.map((date, index) => {
              const dateStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              );

              const isSelected =
                (selectedDate
                  ? new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate()
                    )
                  : today
                ).getTime() === dateStart.getTime();

              const hasBooking = bookings.some(
                (b) => b.date === date.toISOString().split("T")[0]
              );

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setVisibleDate(date);
                    onDateChange?.(new Date(date));
                  }}
                  style={styles.weekDateContainer}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.dateDayWrapper,
                      isSelected && styles.currentDateDayWrapper,
                    ]}
                  >
                    <Text
                      style={[
                        styles.weekDayText,
                        isSelected && styles.currentWeekText,
                      ]}
                    >
                      {daysOfWeek[index].slice(0, 1)}
                    </Text>
                    <Text
                      style={[
                        styles.weekDateText,
                        isSelected && styles.currentWeekText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                    {hasBooking && <View style={styles.bookingDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    width: "100%",
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
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(8),
  },
  arrowButton: {
    padding: s(6),
  },
  arrowDisabled: {
    opacity: 0.3,
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
  },
  monthText: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#111827",
  },
});
