/* eslint-disable @typescript-eslint/no-unused-vars */
import AComplete from "@/assets/AComplete.svg";
import SOS from "@/assets/SOS.svg";
import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Star.svg";
import CalendarComponent from "@/components/CalendarComponent";
import JourneyStepper from "@/components/JourneyStepper";
import { useJourneyStore } from "@/store/useJourneyStore";
import { ms, s, vs } from "@/utils/scale";
import { handleScrollDirection } from "@/utils/tabBarVisibility";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Clipboard,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

// Dummy booking data (unchanged)
const bookings: any[] = [
  {
    id: "1",
    date: "2025-07-07",
    details: {
      name: "Emily Harrington",
      gender: "Female",
      age: 28,
      time: "8:30 AM - 9:30 AM",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      location: {
        address: "123 Main Street, New York, NY 10001",
        coordinates: "40.7128,-74.0060",
        placeId: "ChIJOwg_06VPwokRYv534QaPC8g",
      },
      phone: "+1 (555) 123-4567",
      email: "emily.harrington@gmail.com",
    },
  },
  {
    id: "2",
    date: "2025-07-07",
    details: {
      name: "Michael Chen",
      gender: "Male",
      age: 35,
      time: "10:00 AM - 11:00 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      location: {
        address: "456 Park Avenue, Boston, MA 02108",
        coordinates: "42.3601,-71.0589",
        placeId: "ChIJGzE9DS1l44kRoOhiASS_fHg",
      },
      phone: "+1 (555) 234-5678",
      email: "michael.chen@gmail.com",
    },
  },
  {
    id: "3",
    date: "2025-07-08",
    details: {
      name: "Sarah Johnson",
      gender: "Female",
      age: 42,
      time: "2:00 PM - 3:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/72.jpg",
      location: {
        address: "789 Oak Road, Chicago, IL 60601",
        coordinates: "41.8781,-87.6298",
        placeId: "ChIJ7cv00DwsDogRAMDACa2m4K8",
      },
      phone: "+1 (555) 345-6789",
      email: "sarah.johnson@gmail.com",
    },
  },
  {
    id: "4",
    date: "2025-07-07",
    details: {
      name: "James Lee",
      gender: "Male",
      age: 31,
      time: "9:00 AM - 10:00 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
      location: {
        address: "321 Pine Street, San Francisco, CA 94101",
        coordinates: "37.7749,-122.4194",
        placeId: "ChIJIQBpAG2ahYAR_6128GcTUEo",
      },
      phone: "+1 (555) 456-7890",
      email: "james.lee@gmail.com",
    },
  },
  {
    id: "5",
    date: "2025-07-08",
    details: {
      name: "Olivia Brown",
      gender: "Female",
      age: 25,
      time: "11:30 AM - 12:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/19.jpg",
      location: {
        address: "567 Maple Avenue, Seattle, WA 98101",
        coordinates: "47.6062,-122.3321",
        placeId: "ChIJ7ZhdRkBqkFQRK_yKcp8wfp0",
      },
      phone: "+1 (555) 567-8901",
      email: "olivia.brown@gmail.com",
    },
  },
  {
    id: "6",
    date: "2025-08-17",
    details: {
      name: "William Davis",
      gender: "Male",
      age: 38,
      time: "1:00 PM - 2:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/men/24.jpg",
      location: {
        address: "890 Cedar Lane, Austin, TX 78701",
        coordinates: "30.2672,-97.7431",
        placeId: "ChIJLwPMoJm1RIYRetVp1EtGm_o",
      },
      phone: "+1 (555) 678-9012",
      email: "william.davis@gmail.com",
    },
  },
  {
    id: "7",
    date: "2025-08-10",
    details: {
      name: "Sophia Wilson",
      gender: "Female",
      age: 33,
      time: "3:30 PM - 4:30 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg",
      location: {
        address: "432 Birch Street, Miami, FL 33101",
        coordinates: "25.7617,-80.1918",
        placeId: "ChIJEcHIDqKw2YgRZU-t3XHylv8",
      },
      phone: "+1 (555) 789-0123",
      email: "sophia.wilson@gmail.com",
    },
  },
  {
    id: "8",
    date: "2025-08-10",
    details: {
      name: "Daniel Martinez",
      gender: "Male",
      age: 45,
      time: "9:30 AM - 10:30 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      location: {
        address: "765 Elm Court, Denver, CO 80201",
        coordinates: "39.7392,-104.9903",
        placeId: "ChIJzxcfI6qAa4cR1jaKJ_j0jhE",
      },
      phone: "+1 (555) 890-1234",
      email: "daniel.martinez@gmail.com",
    },
  },
  {
    id: "9",
    date: "2025-08-10",
    details: {
      name: "Ava Robinson",
      gender: "Female",
      age: 29,
      time: "12:00 PM - 1:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      location: {
        address: "234 Willow Way, Portland, OR 97201",
        coordinates: "45.5155,-122.6789",
        placeId: "ChIJN3XR5h4KlVQRp5q32gl_Qj4",
      },
      phone: "+1 (555) 901-2345",
      email: "ava.robinson@gmail.com",
    },
  },
  {
    id: "10",
    date: "2025-08-10",
    details: {
      name: "Ethan Clark",
      gender: "Male",
      age: 40,
      time: "4:00 PM - 5:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/men/81.jpg",
      location: {
        address: "543 Spruce Drive, Las Vegas, NV 89101",
        coordinates: "36.1699,-115.1398",
        placeId: "ChIJ69QoNDjZyIARTIMmDF0Z4kM",
      },
      phone: "+1 (555) 012-3456",
      email: "ethan.clark@gmail.com",
    },
  },
];

// Sanitize phone number to remove non-digit characters except '+'
const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[^+\d]/g, "");
};

const openInMaps = (location: { coordinates: string; address: string }) => {
  const [latitude, longitude] = location.coordinates.split(",");
  const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
  const latLng = `${latitude},${longitude}`;
  const label = location.address;
  const url = Platform.select({
    ios: `${scheme}${encodeURIComponent(label)}@${latLng}`,
    android: `${scheme}${latLng}(${encodeURIComponent(label)})`,
  });

  if (url) {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open maps:", err);
      Alert.alert("Error", "Could not open maps");
    });
  }
};

const openPhoneDialer = async (phoneNumber: string) => {
  try {
    // Sanitize phone number
    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
    const phoneUrl = `tel:${sanitizedPhoneNumber}`;
    console.log(`Attempting to open phone dialer with URL: ${phoneUrl}`);
    console.log(
      `Platform: ${Platform.OS}, Phone Number: ${sanitizedPhoneNumber}`
    );

    const supported = await Linking.canOpenURL(phoneUrl);
    console.log(`Can open phone URL: ${supported}`);

    if (supported) {
      await Linking.openURL(phoneUrl);
    } else {
      // Fallback: Copy phone number to clipboard
      Clipboard.setString(sanitizedPhoneNumber);
      Alert.alert(
        "Phone Dialer Unavailable",
        `The phone dialer is not available on this device. The phone number ${sanitizedPhoneNumber} has been copied to your clipboard. Paste it into your phone app to make the call.`,
        [
          { text: "OK", style: "default" },
          {
            text: "Try Alternative",
            onPress: async () => {
              // Try without country code as a fallback
              const altPhoneNumber = sanitizedPhoneNumber.replace(/^\+/, "");
              const altPhoneUrl = `tel:${altPhoneNumber}`;
              console.log(`Trying alternative phone URL: ${altPhoneUrl}`);
              const altSupported = await Linking.canOpenURL(altPhoneUrl);
              if (altSupported) {
                await Linking.openURL(altPhoneUrl);
              } else {
                Alert.alert(
                  "Error",
                  "Alternative phone dialer attempt also failed. Please use the copied number."
                );
              }
            },
          },
        ]
      );
    }
  } catch (err) {
    console.error("Failed to open phone dialer:", err);
    // Fallback: Copy phone number to clipboard
    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
    Clipboard.setString(sanitizedPhoneNumber);
    Alert.alert(
      "Error",
      `Could not open phone dialer. The phone number ${sanitizedPhoneNumber} has been copied to your clipboard.`
    );
  }
};

const openEmail = async (email: string) => {
  const mailtoUrl = `mailto:${email}`;
  const gmailWebUrl = `https://mail.google.com/mail`;

  try {
    const supported = await Linking.canOpenURL(mailtoUrl);
    if (supported) {
      await Linking.openURL(mailtoUrl);
    } else {
      const webSupported = await Linking.canOpenURL(gmailWebUrl);
      if (webSupported) {
        await Linking.openURL(gmailWebUrl);
      } else {
        Clipboard.setString(email);
        Alert.alert(
          "No Email App",
          `Couldn't open email app or Gmail. Email ${email} copied to clipboard.`
        );
      }
    }
  } catch (error) {
    Clipboard.setString(email);
    Alert.alert(
      "Error",
      `Something went wrong. Email ${email} copied to clipboard.`
    );
  }
};

const Home = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { odometerUploaded, setOdometerUploaded } = useJourneyStore();
  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const filteredBookings = bookings.filter(
    (b) => b.date === selectedDateString
  );
  const today = new Date().toISOString().split("T")[0];
  const todaysBookings = bookings.filter((booking) => booking.date === today);

  useEffect(() => {
    const loadName = async () => {
      const fullName = await SecureStore.getItemAsync("userName");
      console.log("Full Name from SecureStore:", fullName);
      if (fullName) {
        const first = fullName.split(" ")[0];
        setFirstName(first);
      }
    };

    loadName();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (params?.capturedImage && typeof params.capturedImage === "string") {
        setCapturedImage(params.capturedImage);
        router.setParams({ capturedImage: undefined });
      }
    }, [router, params?.capturedImage])
  );

  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const handleUploadSelfie = () => {
    router.push("/rawPages/camera");
  };

  const handleNotificationPress = () => {
    setHasUnreadNotifications(false);
    router.push("/rawPages/notifications");
  };

  const redirectToBookingDetails = (booking: any) =>
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
    });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          handleScrollDirection(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        <LinearGradient
          colors={["#F6E8FF", "#FAF5FF"]}
          style={styles.headerBackground}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hello, {firstName ?? "there"}!
              </Text>
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

        {odometerUploaded && (
          <View
            style={{
              backgroundColor: "#EDE7FA",
              borderRadius: s(12),
              marginHorizontal: s(1),
              marginTop: vs(10),
              padding: s(16),
              position: "relative",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: s(8),
                right: s(8),
                zIndex: 1,
                borderRadius: 22,
                borderColor: "#504E4E",
                borderWidth: 1,
              }}
              onPress={() => setOdometerUploaded(false)}
            >
              <Ionicons name="close" size={19} color="#504E4E" />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: vs(10),
              }}
            >
              <Image
                source={require("@/assets/taxi.png")}
                style={{ width: 29, height: 29, marginRight: s(10) }}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={{
                    fontFamily: "InterSemiBold",
                    fontSize: ms(15),
                    color: "#000000",
                  }}
                >
                  Journey Started
                </Text>
                <Text
                  style={{
                    fontSize: ms(14),
                    color: "#9F9D9D",
                    marginTop: vs(2),
                  }}
                >
                  Your trip has begun. Drive safe {"\n"}
                  we’re tracking your mileage.
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  marginLeft: "auto",
                  backgroundColor: "#69417E",
                  paddingVertical: vs(6),
                  paddingHorizontal: s(14),
                  borderRadius: s(6),
                  marginTop: vs(5),
                }}
                onPress={() => {
                  if (todaysBookings.length > 0) {
                    const firstBooking = todaysBookings[0];
                    router.push({
                      pathname: "/rawPages/bookingdetails",
                      params: {
                        name: firstBooking.details.name,
                        gender: firstBooking.details.gender,
                        age: firstBooking.details.age.toString(),
                        time: firstBooking.details.time,
                        date: firstBooking.date,
                        avatarUrl: firstBooking.details.avatarUrl,
                      },
                    });
                  }
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: ms(13) }}
                >
                  Start
                </Text>
              </TouchableOpacity>
            </View>

            <JourneyStepper />
          </View>
        )}

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
            showMonthYear={true}
            selectedDate={selectedDate}
            onDateChange={(date: Date) => setSelectedDate(date)}
          />

          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookingCard}
                onPress={() => redirectToBookingDetails(booking)}
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
                  <TouchableOpacity
                    style={styles.locationRow}
                    onPress={() => openInMaps(booking.details.location)}
                  >
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#69417E"
                    />
                    <Text style={styles.locationLink}>See Location</Text>
                  </TouchableOpacity>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openPhoneDialer(booking.details.phone)}
                    >
                      <Ionicons name="call-outline" size={18} color="#69417E" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openEmail(booking.details.email)}
                    >
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
    backgroundColor: "#F9F5FC",
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
    right: 9,
    top: "40%",
    width: 9,
    height: 9,
    backgroundColor: "#69417E",
    borderRadius: 4.5,
    zIndex: 1,
    transform: [{ translateY: -5 }],
  },
  profileCircle: {
    backgroundColor: "#fff",
    padding: ms(8),
    borderRadius: ms(20),
    position: "relative",
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
    marginTop: vs(2),
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
    paddingBottom: vs(10),
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
    fontSize: ms(18),
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
    paddingVertical: vs(50),
    transform: [{ translateY: -vs(30) }], // smooth upward shift
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
