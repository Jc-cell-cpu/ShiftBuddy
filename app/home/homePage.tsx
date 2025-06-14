import AComplete from "@/assets/AComplete.svg";
import SOS from "@/assets/SOS.svg";
import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Star.svg";
import CalendarComponent from "@/components/CalendarComponent";
import { ms, s, vs } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useCallback, useState } from "react";
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
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true); // Track unread notifications

  // Update capturedImage when params.capturedImage changes
  useFocusEffect(
    useCallback(() => {
      if (params?.capturedImage && typeof params.capturedImage === "string") {
        setCapturedImage(params.capturedImage);
        router.setParams({ capturedImage: undefined });
      }
    }, [params, router])
  );

  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const handleUploadSelfie = () => {
    router.push("/rawPages/camera");
  };

  const handleNotificationPress = () => {
    setHasUnreadNotifications(false); // Hide dot on click
    router.push("/rawPages/notifications"); // Navigate to notification page
  };

  // Dummy booking data
  const bookings: any[] = [
    {
      date: "2025-07-28",
      details: {
        name: "Emily Harrington",
        gender: "Female",
        age: 28,
        time: "8:30 AM - 9:30 AM",
        avatarUrl:
          "https://media.istockphoto.com/id/1468678624/photo/nurse-hospital-employee-and-portrait-of-black-man-in-a-healthcare-wellness-and-clinic-feeling.jpg?s=2048x2048&w=is&k=20&c=Ha1Z7BjLTrp-wrn131BNHW8T-WMqViY3NrRuXyZtEfk=",
      },
    },
    {
      date: "2025-07-29",
      details: {
        name: "Michael Chen",
        gender: "Male",
        age: 35,
        time: "10:00 AM - 11:00 AM",
        avatarUrl:
          "https://media.istockphoto.com/id/1468678624/photo/nurse-hospital-employee-and-portrait-of-black-man-in-a-healthcare-wellness-and-clinic-feeling.jpg?s=2048x2048&w=is&k=20&c=Ha1Z7BjLTrp-wrn131BNHW8T-WMqViY3NrRuXyZtEfk=",
      },
    },
    {
      date: "2025-07-30",
      details: {
        name: "Sarah Johnson",
        gender: "Female",
        age: 42,
        time: "2:00 PM - 3:00 PM",
        avatarUrl:
          "https://media.istockphoto.com/id/1468678624/photo/nurse-hospital-employee-and-portrait-of-black-man-in-a-healthcare-wellness-and-clinic-feeling.jpg?s=2048x2048&w=is&k=20&c=Ha1Z7BjLTrp-wrn131BNHW8T-WMqViY3NrRuXyZtEfk=",
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
              <TouchableOpacity
                style={styles.profileCircle}
                onPress={handleNotificationPress}
              >
                {hasUnreadNotifications && (
                  <View style={styles.notificationDot} />
                )}
                <Ionicons name="notifications-outline" size={30} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileCircle}>
                <SOS width={30} height={30} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.attendanceCard}>
          {!capturedImage && (
            <Text style={styles.attendanceTitle}>Daily Attendance</Text>
          )}
          {capturedImage && (
            <Text style={styles.attendanceCompleteTitle}>
              Completed, Daily Attendance!
            </Text>
          )}
          <View style={styles.contentRow}>
            <View style={styles.attendanceText}>
              <Text style={styles.attendanceDescription}>
                Track your workday with ease! Mark your attendance to stay
                organised and ensure accurate records of your shifts.
              </Text>
              {!capturedImage && (
                <TouchableOpacity
                  style={styles.selfieButton}
                  onPress={handleUploadSelfie}
                >
                  <Text style={styles.selfieButtonText}>Upload Selfie</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.selfieWrapper}>
              <Star style={styles.backgroundSvg} width={128} height={128} />
              {capturedImage ? (
                <AComplete
                  width={103}
                  height={140}
                  style={styles.foregroundSvg}
                />
              ) : (
                <Selfi
                  width={92.03}
                  height={102}
                  style={styles.foregroundSvg}
                />
              )}
            </View>
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
            bookings={bookings}
          />

          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookingCard}
                onPress={() =>
                  router.push({
                    pathname: "/rawPages/bookingdetails",
                    params: {
                      name: booking.details.name,
                      gender: booking.details.gender,
                      age: booking.details.age,
                      time: booking.details.time,
                      date: booking.date,
                      avatarUrl: booking.details.avatarUrl,
                    },
                  })
                }
              >
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
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaWithIcon}>
                      {booking.details.time}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#69417E"
                    />
                    <Text style={styles.locationLink}>See Location</Text>
                  </TouchableOpacity>
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
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  headerBackground: {
    paddingHorizontal: s(15),
    paddingTop: vs(10),
    borderBottomLeftRadius: ms(24),
    borderBottomRightRadius: ms(24),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: vs(25),
    marginBottom: vs(25),
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(12),
  },
  notificationDot: {
    position: "absolute",
    right: 9, // Position on the left side of the icon
    top: "40%",
    width: 9,
    height: 9,
    backgroundColor: "#69417E", // Red dot for visibility
    borderRadius: 4.5, // Make it circular
    zIndex: 1, // Ensure it appears above the icon
    transform: [{ translateY: -5 }], // Center vertically
  },
  profileCircle: {
    backgroundColor: "#fff",
    padding: ms(8),
    borderRadius: ms(20),
    position: "relative", // Allow positioning of the notification dot
  },
  greeting: {
    fontFamily: "InterBold",
    fontSize: ms(20),
    color: "#000",
  },
  welcome: {
    fontFamily: "InterRegular",
    fontSize: ms(14),
    color: "#6B7280",
    marginTop: vs(2),
  },
  attendanceCard: {
    backgroundColor: "#FFF",
    borderRadius: ms(30),
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
    padding: ms(16),
    marginTop: vs(9),
    marginHorizontal: s(2),
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendanceText: {
    flex: 1,
    paddingRight: s(10),
  },
  attendanceTitle: {
    fontFamily: "InterVariable",
    fontSize: ms(16),
    fontWeight: "700",
    lineHeight: ms(19),
    marginBottom: vs(2),
    width: "100%",
    flexShrink: 1,
  },
  attendanceCompleteTitle: {
    fontFamily: "InterVariable",
    fontSize: ms(16),
    fontWeight: "700",
    lineHeight: ms(19),
    marginBottom: vs(-15),
    width: "100%",
    flexShrink: 1,
  },
  attendanceDescription: {
    fontFamily: "InterVariable",
    width: "130%",
    fontSize: ms(14),
    color: "#6B7280",
    marginBottom: vs(10),
  },
  selfieButton: {
    backgroundColor: "#F5D2BD",
    borderRadius: ms(8),
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    alignSelf: "flex-start",
  },
  selfieButtonText: {
    fontFamily: "InterMedium",
    fontSize: ms(13),
    color: "#000",
  },
  selfieWrapper: {
    position: "relative",
    width: s(140),
    height: vs(130),
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 25,
  },
  foregroundSvg: {
    zIndex: 1,
    left: 25,
  },
  whiteBackgroundContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: vs(20),
    marginTop: vs(1),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: s(15),
    marginBottom: vs(10),
  },
  sectionTitle: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#000",
  },
  calendarIcon: {
    padding: ms(5),
  },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "rgba(241, 230, 255, 0.3)",
    borderRadius: ms(16),
    padding: ms(12),
    marginBottom: vs(16),
    marginTop: vs(10),
    marginHorizontal: s(15),
    alignItems: "center",
    gap: ms(12),
    elevation: 0,
    shadowColor: "transparent",
    borderWidth: 0,
    borderColor: "rgba(209, 208, 207, 0.9)",
  },
  avatarContainer: {
    width: s(132),
    height: vs(151),
    borderRadius: ms(10),
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  bookingDetails: {
    flex: 1,
    paddingTop: vs(2),
  },
  name: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#111827",
  },
  meta: {
    fontFamily: "InterRegular",
    fontSize: ms(13),
    color: "#6B7280",
    marginBottom: vs(8),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(6),
    gap: ms(6),
  },
  metaWithIcon: {
    fontFamily: "InterRegular",
    fontSize: ms(13),
    color: "#6B7280",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(12),
    gap: ms(6),
  },
  locationLink: {
    fontFamily: "InterMedium",
    fontSize: ms(13),
    color: "#69417E",
  },
  actions: {
    flexDirection: "row",
    gap: ms(16),
    marginTop: vs(4),
  },
  actionButton: {
    padding: ms(8),
    borderRadius: ms(20),
    backgroundColor: "rgba(105, 65, 126, 0.1)",
  },
  noBookingsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(40),
  },
  noBookingsText: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#6B7280",
    marginTop: vs(12),
  },
  noBookingsSubText: {
    fontFamily: "InterRegular",
    fontSize: ms(14),
    color: "#6B7280",
    marginTop: vs(4),
    textAlign: "center",
    paddingHorizontal: s(20),
  },
});

export default Home;
