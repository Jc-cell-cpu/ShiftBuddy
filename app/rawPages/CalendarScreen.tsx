import NOB from "@/assets/Nobookings.svg";
import CalendarComponent from "@/components/CalendarComponent";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const bookings: any[] = [
  {
    id: "1",
    date: "2025-07-04",
    details: {
      name: "Emily Harrington",
      gender: "Female",
      age: 28,
      time: "8:30 AM - 9:30 AM",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: "2",
    date: "2025-07-04",
    details: {
      name: "Michael Chen",
      gender: "Male",
      age: 35,
      time: "10:00 AM - 11:00 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  },
  {
    id: "3",
    date: "2025-07-30",
    details: {
      name: "Sarah Johnson",
      gender: "Female",
      age: 42,
      time: "2:00 PM - 3:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/72.jpg",
    },
  },
  {
    id: "4",
    date: "2025-07-04",
    details: {
      name: "James Lee",
      gender: "Male",
      age: 31,
      time: "9:00 AM - 10:00 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    },
  },
  {
    id: "5",
    date: "2025-08-01",
    details: {
      name: "Olivia Brown",
      gender: "Female",
      age: 25,
      time: "11:30 AM - 12:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/19.jpg",
    },
  },
  {
    id: "6",
    date: "2025-08-02",
    details: {
      name: "William Davis",
      gender: "Male",
      age: 38,
      time: "1:00 PM - 2:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/men/24.jpg",
    },
  },
  {
    id: "7",
    date: "2025-08-03",
    details: {
      name: "Sophia Wilson",
      gender: "Female",
      age: 33,
      time: "3:30 PM - 4:30 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg",
    },
  },
  {
    id: "8",
    date: "2025-08-04",
    details: {
      name: "Daniel Martinez",
      gender: "Male",
      age: 45,
      time: "9:30 AM - 10:30 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  },
  {
    id: "9",
    date: "2025-08-05",
    details: {
      name: "Ava Robinson",
      gender: "Female",
      age: 29,
      time: "12:00 PM - 1:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    },
  },
  {
    id: "10",
    date: "2025-08-06",
    details: {
      name: "Ethan Clark",
      gender: "Male",
      age: 40,
      time: "4:00 PM - 5:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/men/81.jpg",
    },
  },
];

const bookingCardStyles = [
  {
    backgroundColor: "rgba(255, 243, 239, 1)",
    borderColor: "#F2C7AC",
  },
  {
    backgroundColor: "#E9F0FF",
    borderColor: "#A9C5F2",
  },
  {
    backgroundColor: "#F9F0FF",
    borderColor: "#D5C4F7",
  },
];

const generateTimeSlots = () => {
  const slots = [];
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  for (let i = 0; i < 48; i++) {
    let timeLabel = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Replace non-breaking space (U+202F) with normal space
    timeLabel = timeLabel.replace(/\u202F/g, " ").toUpperCase();
    slots.push(timeLabel);

    date.setMinutes(date.getMinutes() + 30);
  }
  return slots;
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDayLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
  });

  const selectedDateString = selectedDate.toISOString().split("T")[0];

  const filteredBookings = bookings.filter(
    (b) => b.date === selectedDateString
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/home/homePage")}
        >
          <Ionicons name="arrow-back" size={s(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calender</Text>
      </View>

      <View style={styles.calendarWithBooking}>
        <LinearGradient
          colors={["#F6E8FF", "#FAF5FF"]}
          style={styles.calendarGradientWrapper}
        >
          <CalendarComponent
            isExpanded={false}
            bookings={bookings}
            showMonthYear={true}
            onDateChange={(date: Date) => setSelectedDate(date)}
            selectedDate={selectedDate}
          />
        </LinearGradient>

        <View style={styles.calendarSeam} />

        <View style={styles.bookingContainer}>
          <View style={styles.dateTitleContainer}>
            <Text style={styles.dayLabel}>{formattedDayLabel}</Text>
            <Text style={styles.bookingCount}>
              {filteredBookings.length} Booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: vs(100) }}
            showsVerticalScrollIndicator={false}
          >
            {generateTimeSlots().map((slot, index) => {
              const [time, meridiem] = slot.split(" ");
              const [slotHour, slotMinute] = time.split(":").map(Number);
              const slotDate = new Date();
              slotDate.setHours(
                meridiem === "PM" && slotHour !== 12
                  ? slotHour + 12
                  : meridiem === "AM" && slotHour === 12
                  ? 0
                  : slotHour,
                slotMinute,
                0,
                0
              );

              const matchedBookings = filteredBookings.filter((b) => {
                const bookingStart = b.details.time.split("-")[0].trim(); // e.g. "8:30 AM"
                const [bookingTime, bookingMeridiem] = bookingStart.split(" ");
                const [bookingHour, bookingMinute] = bookingTime
                  .split(":")
                  .map(Number);
                const bookingDate = new Date();
                bookingDate.setHours(
                  bookingMeridiem === "PM" && bookingHour !== 12
                    ? bookingHour + 12
                    : bookingMeridiem === "AM" && bookingHour === 12
                    ? 0
                    : bookingHour,
                  bookingMinute,
                  0,
                  0
                );

                return (
                  slotDate.getHours() === bookingDate.getHours() &&
                  slotDate.getMinutes() === bookingDate.getMinutes()
                );
              });

              return (
                <View key={index} style={styles.timeline}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeHour}>{time}</Text>
                    <Text style={styles.timePeriod}>{meridiem}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.horizontalLine} />
                    {matchedBookings.length > 0 ? (
                      matchedBookings.map((booking, i) => (
                        <View
                          key={booking.id}
                          style={[styles.bookingCard, bookingCardStyles[i % 3]]}
                        >
                          <Image
                            source={{ uri: booking.details.avatarUrl }}
                            style={{
                              width: s(43),
                              height: s(43),
                              borderRadius: s(28),
                              borderWidth: 1,
                              borderColor: "#E5E7EB",
                              marginRight: s(8),
                            }}
                          />
                          <View>
                            <Text style={styles.bookingName}>
                              {booking.details.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: vs(2),
                              }}
                            >
                              <Ionicons
                                name="time-outline"
                                size={12}
                                color="#6B7280"
                                style={{ marginLeft: s(8) }}
                              />
                              <Text style={styles.timeText}>
                                {" "}
                                {booking.details.time}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={styles.noBookingSlot}>
                        <NOB width={300} height={300} />
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    gap: s(87),
    marginTop: vs(25),
    marginBottom: vs(1),
  },
  headerTitle: {
    fontFamily: "InterSemiBold",
    fontSize: ms(18),
    fontWeight: "600",
  },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(22),
    backgroundColor: "#fafcff",
    borderColor: "#ccc",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarWithBooking: {
    position: "relative",
  },
  calendarGradientWrapper: {
    borderBottomLeftRadius: ms(20),
    borderBottomRightRadius: ms(20),
    overflow: "hidden",
    paddingBottom: vs(15),
  },
  calendarSeam: {
    height: vs(15),
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "center",
    position: "absolute",
    borderTopLeftRadius: ms(90),
    borderTopRightRadius: ms(90),
    marginTop: vs(95),
    zIndex: 3,
  },
  bookingContainer: {
    marginTop: -vs(25),
    backgroundColor: "#FFF",
    borderTopLeftRadius: ms(45),
    borderTopRightRadius: ms(45),
    paddingTop: vs(20),
  },
  dateTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: s(16),
    marginBottom: vs(10),
  },
  dayLabel: {
    fontSize: ms(14),
    fontWeight: "600",
  },
  bookingCount: {
    fontSize: ms(13),
    color: "#69417E",
    fontWeight: "500",
  },
  timeline: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: vs(16),
    paddingHorizontal: s(16),
    minHeight: vs(65),
  },
  timeColumn: {
    width: s(60),
    alignItems: "center",
    marginTop: vs(4),
    position: "relative",
  },
  timeHour: {
    fontSize: ms(13),
    fontWeight: "600",
    color: "#000",
  },
  timePeriod: {
    fontSize: ms(10),
    color: "#6B7280",
  },
  verticalLine: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
    position: "absolute",
    top: vs(24),
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
    borderWidth: 0.3,
    borderColor: "#D1D5DB",
    marginLeft: s(10),
    marginTop: vs(8),
    marginBottom: vs(50),
  },

  bookingCard: {
    flexDirection: "row",
    padding: s(12),
    borderRadius: ms(40),
    // borderWidth: 1,
    marginBottom: vs(10),
    alignItems: "center",
  },
  bookingName: {
    marginLeft: s(8),
    fontSize: ms(16),
    fontFamily: "InterMedium",
    color: "#000",
  },
  timeText: {
    // marginLeft: s(8),
    fontSize: ms(14),
    color: "#6B7280",
  },
  noBookingSlot: {
    height: vs(50),
    justifyContent: "center",
    alignItems: "center",
    // borderStyle: "dashed",
    // borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: ms(12),
    marginBottom: vs(35),
    marginRight: s(16),
  },
});
