// app/home.tsx
import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Star.svg";
import CalendarComponent from "@/components/CalendarComponent";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const Home = () => {
  const router = useRouter();
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  // Dummy booking data (simulating data from backend)
  const bookings: any[] | undefined = [
    {
      date: "2025-07-28",
      details: {
        name: "Emily Harrington",
        gender: "Female",
        age: 28,
        time: "8:30 AM - 9:30 AM",
        avatarUrl:
          "https://media.istockphoto.com/id/1468678624/photo/nurse-hospital-employee-and-portrait-of-black-man-in-a-healthcare-wellness-and-clinic-feeling.jpg?s=2048x2048&w=is&k=20&c=Ha1Z7BjLTrp-wrn131BNHW8T-WMqViY3NrRuXyZtEfk=", // Placeholder URL
      },
    },
    {
      date: "2025-07-29",
      details: {
        name: "Michael Chen",
        gender: "Male",
        age: 35,
        time: "10:00 AM - 11:00 AM",
        avatarUrl: "https://example.com/michael.jpg", // Placeholder URL
      },
    },
    {
      date: "2025-07-30",
      details: {
        name: "Sarah Johnson",
        gender: "Female",
        age: 42,
        time: "2:00 PM - 3:00 PM",
        avatarUrl: "https://example.com/sarah.jpg", // Placeholder URL
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#F6E8FF", "#FAF5FF"]}
          style={styles.headerBackground}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, Kriti!</Text>
              <Text style={styles.welcome}>Welcome to ShiftBuddy! 👋</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileCircle}>
                <Ionicons name="person-outline" size={20} color="#69417E" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.attendanceCard}>
          <View style={styles.attendanceText}>
            <Text style={styles.attendanceTitle}>Daily Attendance</Text>
            <Text style={styles.attendanceDescription}>
              Track your workday with ease! Mark your attendance to stay
              organised and ensure accurate records of your shifts.
            </Text>
            <TouchableOpacity style={styles.selfieButton}>
              <Text style={styles.selfieButtonText}>Upload Selfie</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selfieWrapper}>
            <Star style={styles.backgroundSvg} width={140} height={130} />
            <Selfi width={125.7} height={115} style={styles.foregroundSvg} />
          </View>
        </View>

        <View style={styles.whiteBackgroundContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bookings</Text>
            <TouchableOpacity onPress={toggleCalendar}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color="#050000"
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
          </View>

          <CalendarComponent
            isExpanded={isCalendarExpanded}
            onToggle={toggleCalendar}
            bookings={bookings} // Pass bookings as a prop
          />

          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <View key={index} style={styles.bookingCard}>
                {/* Profile Photo */}
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: booking.details.avatarUrl }}
                    style={styles.avatarImage}
                  />
                </View>

                <View style={styles.bookingDetails}>
                  <Text style={styles.name}>{booking.details.name}</Text>
                  <Text style={styles.meta}>
                    {booking.details.gender} | {booking.details.age} Years
                  </Text>

                  {/* Date with calendar icon */}
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.metaWithIcon}>
                      {booking.date.split("-").reverse().join("/")}
                    </Text>
                  </View>

                  {/* Time with clock icon */}
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaWithIcon}>
                      {booking.details.time}
                    </Text>
                  </View>

                  {/* Location link with pin icon */}
                  <TouchableOpacity style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#69417E"
                    />
                    <Text style={styles.locationLink}>See Location</Text>
                  </TouchableOpacity>

                  {/* Action buttons */}
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="call-outline" size={18} color="#69417E" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="mail-outline" size={18} color="#69417E" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="open-outline" size={18} color="#69417E" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noBookingsContainer}>
              <Ionicons name="calendar-outline" size={50} color="#6B7280" />
              <Text style={styles.noBookingsText}>Nothing to see here</Text>
              <Text style={styles.noBookingsSubText}>
                You have no bookings at the moment.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  headerBackground: {
    paddingHorizontal: 15,
    paddingTop: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selfieWrapper: {
    position: "relative",
    width: 140,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  foregroundSvg: {
    zIndex: 1,
  },
  profileCircle: {
    backgroundColor: "#F1E6FF",
    padding: 8,
    borderRadius: 20,
  },
  greeting: {
    fontFamily: "InterBold",
    fontSize: 20,
    color: "#000",
  },
  welcome: {
    fontFamily: "InterRegular",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  attendanceCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 16,
    marginTop: 9,
    marginHorizontal: 2,
    alignItems: "center",
  },
  attendanceText: {
    flex: 1,
    paddingRight: 10,
  },
  attendanceTitle: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: "#000",
    marginBottom: 6,
  },
  attendanceDescription: {
    fontFamily: "Inter24Regular",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 10,
  },
  selfieButton: {
    backgroundColor: "#F5D2BD",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  selfieButtonText: {
    fontFamily: "InterMedium",
    fontSize: 13,
    color: "#000",
  },
  whiteBackgroundContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 20,
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: "#000",
  },
  calendarIcon: {
    padding: 5,
  },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "rgba(241, 230, 255, 0.3)", // light purple with transparency
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    marginTop: 10,
    marginHorizontal: 15,
    alignItems: "center", // Center align items vertically
    gap: 12,
    elevation: 0,
    shadowColor: "transparent",
    borderWidth: 0,
    borderColor: "rgba(209, 208, 207, 0.9)",
  },
  avatarContainer: {
    width: 132, // Keep square shape
    height: 151,
    borderRadius: 10, // Slightly rounded corners (not a circle)
    overflow: "hidden",
    backgroundColor: "#FFF", // White background behind the image
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    lineHeight: 60, // Adjusted to match the new height
  },
  bookingDetails: {
    flex: 1,
    paddingTop: 2,
  },
  name: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: "#111827",
  },
  meta: {
    fontFamily: "InterRegular",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  metaWithIcon: {
    fontFamily: "InterRegular",
    fontSize: 13,
    color: "#6B7280",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  locationLink: {
    fontFamily: "InterMedium",
    fontSize: 13,
    color: "#69417E",
  },
  link: {
    fontFamily: "InterMedium",
    fontSize: 13,
    color: "#69417E",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  actionButton: {
    padding: 8, // Added padding for better touch area
    borderRadius: 20,
    backgroundColor: "rgba(105, 65, 126, 0.1)", // Light purple background
  },
  noBookingsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noBookingsText: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  noBookingsSubText: {
    fontFamily: "InterRegular",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
