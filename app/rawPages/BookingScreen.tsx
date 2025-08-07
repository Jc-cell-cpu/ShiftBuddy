import CalendarComponent from "@/components/CalendarComponent";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BookingItem {
  id: string;
  date: string;
  details: {
    name: string;
    gender: string;
    age: number;
    time: string;
    avatarUrl: string;
    location: {
      address: string;
      coordinates: string;
      placeId: string;
    };
    phone: string;
    email: string;
  };
}

const bookingData: BookingItem[] = [
  {
    id: "1",
    date: "2025-07-28",
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
      email: "emily.harrington@email.com",
    },
  },
  {
    id: "2",
    date: "2025-07-28",
    details: {
      name: "Leo Carter",
      gender: "Male",
      age: 37,
      time: "8:30 AM - 9:30 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
      location: {
        address: "456 Park Avenue, Boston, MA 02108",
        coordinates: "42.3601,-71.0589",
        placeId: "ChIJGzE9DS1l44kRoOhiASS_fHg",
      },
      phone: "+1 (555) 234-5678",
      email: "leo.carter@email.com",
    },
  },
  {
    id: "3",
    date: "2025-08-05", // future
    details: {
      name: "Nina Patel",
      gender: "Female",
      age: 32,
      time: "2:00 PM - 3:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      location: {
        address: "789 Broadway, Los Angeles, CA 90015",
        coordinates: "34.0522,-118.2437",
        placeId: "ChIJ7aVxnOTHwoARxKIntFtakKo",
      },
      phone: "+1 (555) 345-6789",
      email: "nina.patel@email.com",
    },
  },
  {
    id: "4",
    date: "2025-08-10", // future
    details: {
      name: "Carlos Gomez",
      gender: "Male",
      age: 45,
      time: "10:00 AM - 11:00 AM",
      avatarUrl: "https://randomuser.me/api/portraits/men/33.jpg",
      location: {
        address: "300 Market St, San Francisco, CA 94103",
        coordinates: "37.7749,-122.4194",
        placeId: "ChIJIQBpAG2ahYAR_6128GcTUEo",
      },
      phone: "+1 (555) 456-7890",
      email: "carlos.gomez@email.com",
    },
  },
  {
    id: "5",
    date: "2025-07-20", // past
    details: {
      name: "Hannah Smith",
      gender: "Female",
      age: 29,
      time: "3:30 PM - 4:30 PM",
      avatarUrl: "https://randomuser.me/api/portraits/women/72.jpg",
      location: {
        address: "400 Queen St, Toronto, ON M5V 2B6",
        coordinates: "43.6532,-79.3832",
        placeId: "ChIJpTvG15DL1IkRd8S0KlBVNTI",
      },
      phone: "+1 (555) 567-8901",
      email: "hannah.smith@email.com",
    },
  },
  {
    id: "6",
    date: "2025-07-10", // past
    details: {
      name: "Ryan Mitchell",
      gender: "Male",
      age: 41,
      time: "11:00 AM - 12:00 PM",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      location: {
        address: "600 King St, Seattle, WA 98104",
        coordinates: "47.6062,-122.3321",
        placeId: "ChIJVTPokywQkFQRmtVEaUZlJRA",
      },
      phone: "+1 (555) 678-9012",
      email: "ryan.mitchell@email.com",
    },
  },
  {
    id: "7",
    date: "2025-08-15", // future
    details: {
      name: "Olivia White",
      gender: "Female",
      age: 34,
      time: "9:00 AM - 10:00 AM",
      avatarUrl: "https://randomuser.me/api/portraits/women/59.jpg",
      location: {
        address: "123 Ocean Drive, Miami Beach, FL",
        coordinates: "25.7617,-80.1918",
        placeId: "ChIJD9lXVCbM2YgRkHytCaHMuXI",
      },
      phone: "+1 (555) 789-0123",
      email: "olivia.white@email.com",
    },
  },
];

const BookingScreen = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Filter bookings based on selected tab and date
  const getFilteredBookings = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    let filtered = bookingData;

    switch (selectedTab) {
      case "Upcoming":
        filtered = bookingData.filter((booking) => booking.date >= today);
        break;
      case "Past":
        filtered = bookingData.filter((booking) => booking.date < today);
        break;
      default:
        "All"; //shows all bookings
        break;
    }

    return filtered;
  };

  const handleLocationPress = (coordinates: string, address: string) => {
    const [lat, lng] = coordinates.split(",");
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${address})`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Unable to open maps");
      });
    }
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Error", "Unable to make phone call");
    });
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Error", "Unable to send email");
    });
  };

  // Sanitize phone number to remove non-digit characters except '+'
  const sanitizePhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/[^+\d]/g, "");
  };

  const openInMaps = (location: { coordinates: string; address: string }) => {
    const [latitude, longitude] = location.coordinates.split(",");
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
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
      const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
      const phoneUrl = `tel:${sanitizedPhoneNumber}`;
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Clipboard.setString(sanitizedPhoneNumber);
        Alert.alert(
          "Phone Dialer Unavailable",
          `The phone number ${sanitizedPhoneNumber} has been copied to your clipboard.`
        );
      }
    } catch {
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
    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        Clipboard.setString(email);
        Alert.alert("No Email App", `Email ${email} copied to clipboard.`);
      }
    } catch {
      Clipboard.setString(email);
      Alert.alert("Error", `Email ${email} copied to clipboard.`);
    }
  };

  const toggleCalendar = () => {
    setShowFullCalendar(!showFullCalendar);
  };

  const renderBookingItem = ({ item }: { item: BookingItem }) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const isPast = item.date < today;

    return (
      <TouchableOpacity
        style={[
          styles.bookingCard,
          isPast && styles.disabledCard, // Apply gray style for past bookings
        ]}
        onPress={() => {
          if (!isPast) {
            // Enable interaction only for non-past bookings
            // Add your navigation logic or interaction here
          }
        }}
        disabled={isPast} // Disable touch for past
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.details.avatarUrl }}
            style={[
              styles.avatarImage,
              isPast && { opacity: 0.4 }, // Faded avatar for past
            ]}
          />
        </View>

        <View style={styles.bookingDetails}>
          <Text style={[styles.name, isPast && styles.disabledText]}>
            {item.details.name}
          </Text>
          <Text style={[styles.meta, isPast && styles.disabledText]}>
            {item.details.gender} | {item.details.age} Years
          </Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={isPast ? "#9CA3AF" : "#6B7280"}
            />
            <Text style={[styles.metaWithIcon, isPast && styles.disabledText]}>
              {item.date.split("-").reverse().join("/")}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={isPast ? "#9CA3AF" : "#6B7280"}
            />
            <Text style={[styles.metaWithIcon, isPast && styles.disabledText]}>
              {item.details.time}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => openInMaps(item.details.location)}
            disabled={isPast}
          >
            <Ionicons
              name="location-outline"
              size={14}
              color={isPast ? "#9CA3AF" : "#69417E"}
            />
            <Text style={[styles.locationLink, isPast && styles.disabledText]}>
              See Location
            </Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openPhoneDialer(item.details.phone)}
              disabled={isPast}
            >
              <Ionicons
                name="call-outline"
                size={18}
                color={isPast ? "#B0B0B0" : "#69417E"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openEmail(item.details.email)}
              disabled={isPast}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={isPast ? "#B0B0B0" : "#69417E"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} disabled={isPast}>
              <Ionicons
                name="open-outline"
                size={18}
                color={isPast ? "#B0B0B0" : "#69417E"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={ms(22)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "All" && styles.activeTab]}
          onPress={() => setSelectedTab("All")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "All" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Upcoming" && styles.activeTab]}
          onPress={() => setSelectedTab("Upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Past" && styles.activeTab]}
          onPress={() => setSelectedTab("Past")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Past" && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        <Text style={styles.calendarTitle}>Bookings</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={toggleCalendar}
        >
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <CalendarComponent
        isExpanded={showFullCalendar}
        bookings={bookingData}
        showMonthYear={true}
        selectedDate={selectedDate}
        onDateChange={(date: Date) => setSelectedDate(date)}
      />
      <FlatList
        data={getFilteredBookings()}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        scrollEnabled={true}
        bounces={true}
        overScrollMode="always"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: -vs(3), // Increased bottom padding to container
    marginBottom: vs(2), // Added bottom margin for extra space
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    gap: s(61),
    marginTop: vs(18),
  },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(22),
    backgroundColor: "rgba(243, 243, 243, 1)",
    borderColor: "#ccc",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(40),
    marginLeft: s(1),
  },
  headerTitle: {
    fontFamily: "InterSemiBold",
    fontSize: ms(18),
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6", // light grey background for the whole segmented control
    borderRadius: ms(30),
    padding: s(4),
    marginHorizontal: s(16),
    marginBottom: vs(20),
    alignSelf: "center",
  },
  tab: {
    paddingVertical: vs(8),
    paddingHorizontal: s(24),
    borderRadius: ms(30),
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#69417E", // purple background for selected tab
  },
  tabText: {
    fontSize: ms(14),
    fontFamily: "InterMedium",
    color: "#6B7280", // gray text for unselected
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  calendarSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: s(16),
    marginBottom: vs(12),
  },
  calendarTitle: {
    fontFamily: "InterSemiBold",
    fontSize: ms(18),
    color: "#1F2937",
  },
  calendarButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  calendarGrid: {
    paddingHorizontal: s(16),
    marginBottom: vs(20),
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
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(12),
  },
  weekDay: {
    fontFamily: "InterMedium",
    fontSize: ms(12),
    color: "#6B7280",
    textAlign: "center",
    flex: 1,
  },
  dateGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateItem: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: s(2),
  },
  selectedDate: {
    backgroundColor: "#69417E",
  },
  dateText: {
    fontFamily: "InterMedium",
    fontSize: ms(14),
    color: "#374151",
    textAlign: "center",
  },
  selectedDateText: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: s(16),
    paddingBottom: vs(150), // Further increased bottom padding to prevent cutting off
  },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "rgba(241, 230, 255, 0.3)",
    borderRadius: ms(16),
    padding: ms(12),
    marginBottom: vs(12),
    marginTop: vs(10),
    marginHorizontal: s(10),
    alignItems: "center",
    gap: ms(12),
    elevation: 0,
    shadowColor: "transparent",
    borderWidth: 0,
    borderColor: "rgba(209, 208, 207, 0.9)",
  },
  avatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    marginRight: s(12),
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#1F2937",
  },
  meta: {
    fontFamily: "InterRegular",
    fontSize: ms(13),
    color: "#6B7280",
    marginBottom: vs(8),
  },
  location: {
    fontFamily: "InterMedium",
    fontSize: ms(13),
    color: "#69417E",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(6),
    gap: ms(6),
  },
  metaWithIcon: {
    fontFamily: "InterRegular",
    fontSize: ms(12),
    color: "#6B7280",
    // marginLeft: s(6),
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
    gap: s(16),
    marginTop: vs(4),
  },
  actionButton: {
    padding: ms(8),
    borderRadius: ms(20),
    backgroundColor: "rgba(105, 65, 126, 0.1)",
  },
  disabledCard: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
    opacity: 0.7,
  },

  disabledText: {
    color: "#9CA3AF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: vs(40),
  },
  emptyStateText: {
    fontFamily: "InterMedium",
    fontSize: ms(16),
    color: "#6B7280",
    textAlign: "center",
    marginTop: vs(16),
  },
  emptyStateSubtext: {
    fontFamily: "InterRegular",
    fontSize: ms(14),
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: vs(8),
  },
});

export default BookingScreen;
