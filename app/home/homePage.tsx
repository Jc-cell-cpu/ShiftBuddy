import AComplete from "@/assets/AComplete.svg";
import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Star.svg";
import CalendarComponent from "@/components/CalendarComponent";
import { ms, s, vs } from "@/utils/scale";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const navigation = useNavigation();
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const hasCameraPermission = permission?.granted;
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  // Toggle bottom nav visibility based on camera state
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isCameraOpen ? { display: "none" } : { display: "flex" },
    });
  }, [isCameraOpen, navigation]);

  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  // Request camera permission
  // Open camera and handle photo capture
  const handleUploadSelfie = async () => {
    if (!hasCameraPermission) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        alert("Camera permission is required to take a selfie.");
        return;
      }
    }
    setIsCameraOpen(true);
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        setIsCameraOpen(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        alert("Failed to capture selfie. Please try again.");
      }
    }
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
        avatarUrl: "https://example.com/michael.jpg",
      },
    },
    {
      date: "2025-07-30",
      details: {
        name: "Sarah Johnson",
        gender: "Female",
        age: 42,
        time: "2:00 PM - 3:00 PM",
        avatarUrl: "https://example.com/sarah.jpg",
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {isCameraOpen && hasCameraPermission ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} facing="front">
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Text style={styles.captureButtonText}>Take Selfie</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsCameraOpen(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
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
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileCircle}>
                  <Ionicons name="person-outline" size={20} color="#69417E" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.attendanceCard}>
            <View style={styles.attendanceText}>
              <Text
                style={styles.attendanceTitle}
                numberOfLines={1}
                // ellipsizeMode="tail"
              >
                {capturedImage
                  ? "Completed, Daily Attendance!"
                  : "Daily Attendance"}
              </Text>
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
                  width={125.7}
                  height={115}
                  style={styles.foregroundSvg}
                />
              ) : (
                // <Image
                //   source={{ uri: capturedImage }}
                //   style={styles.capturedImage}
                // />
                <Selfi
                  width={92.03}
                  height={102}
                  style={styles.foregroundSvg}
                />
              )}
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
                <View key={index} style={styles.bookingCard}>
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
                        <Ionicons
                          name="call-outline"
                          size={18}
                          color="#69417E"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                          name="mail-outline"
                          size={18}
                          color="#69417E"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                          name="open-outline"
                          size={18}
                          color="#69417E"
                        />
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
      )}
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
    left: 0,
  },
  foregroundSvg: {
    zIndex: 1,
  },
  capturedImage: {
    width: 92.3,
    height: 102,
    zIndex: 1,
    borderRadius: ms(10),
  },
  profileCircle: {
    backgroundColor: "#F1E6FF",
    padding: ms(8),
    borderRadius: ms(20),
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
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: ms(30),
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
    padding: ms(16),
    marginTop: vs(9),
    marginHorizontal: s(2),
    alignItems: "center",
  },
  attendanceText: {
    flex: 1,
    paddingRight: s(10),
  },
  attendanceTitle: {
    fontFamily: "InterVariable",
    fontSize: ms(16),
    fontWeight: "500",
    lineHeight: ms(19),
    marginBottom: vs(6),
  },
  attendanceDescription: {
    fontFamily: "Inter24Regular",
    fontSize: ms(12),
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cameraButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: ms(20),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  captureButton: {
    backgroundColor: "#F5D2BD",
    borderRadius: ms(8),
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
  },
  captureButtonText: {
    fontFamily: "InterMedium",
    fontSize: ms(14),
    color: "#000",
  },
  cancelButton: {
    backgroundColor: "#FFF",
    borderRadius: ms(8),
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
  },
  cancelButtonText: {
    fontFamily: "InterMedium",
    fontSize: ms(14),
    color: "#000",
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
