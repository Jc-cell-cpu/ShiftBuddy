import ProfileCard from "@/components/ProfileCard";
import SlideToConfirmButton from "@/components/SliderButton";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  PanResponderGestureState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const tabs = [
  "Booking",
  "Medical info",
  "Documents",
  "Contact",
  "Progress Note",
];

const BookingDetails = () => {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Booking");
  const router = useRouter();

  const avatar = Array.isArray(params.avatarUrl)
    ? params.avatarUrl[0]
    : params.avatarUrl;

  function handleLogin() {
    // Handle login logic here
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20, // only horizontal swipes
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        const currentIndex = tabs.indexOf(activeTab);
        if (gestureState.dx < -20 && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]); // swipe left → next tab
        } else if (gestureState.dx > 20 && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]); // swipe right → previous tab
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={s(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      {/* Profile Card */}
      <ProfileCard
        name={params.name as string}
        gender={params.gender as string}
        age={params.age as string}
        date={params.date as string}
        time={params.time as string}
        avatarUrl={params.avatarUrl as string}
      />

      {/* Tabs */}
      <View
        style={{
          backgroundColor: "rgba(241, 230, 255, 0.2)",
          borderRadius: s(9),
          marginHorizontal: s(8),
          height: vs(49),
          marginTop: vs(4),
          paddingVertical: vs(0),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabRow, { justifyContent: "center" }]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.contentBox} {...panResponder.panHandlers}>
        <View style={styles.cardContent}>
          {activeTab === "Booking" ? (
            <ScrollView
              style={{
                backgroundColor: "#FDF9FF",
                borderRadius: s(16),
                padding: s(20),
                flexGrow: 1,
              }}
              contentContainerStyle={{
                paddingBottom: vs(30),
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Scheduled Visit Time</Text>
              <Text style={styles.value}>{params.date}</Text>

              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{params.time}</Text>

              <Text style={styles.label}>Type of Care</Text>
              <Text style={styles.value}>Medication</Text>

              <Text style={styles.label}>Client Notes</Text>
              <Text style={styles.value}>
                Bring a valid ID and your insurance card.
              </Text>
            </ScrollView>
          ) : activeTab === "Medical info" ? (
            <ScrollView
              style={{
                backgroundColor: "#FDF9FF",
                borderRadius: s(16),
                padding: s(20),
                flexGrow: 1,
              }}
              contentContainerStyle={{
                paddingBottom: vs(30),
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Diagnoses</Text>
              <Text style={styles.value}>Done</Text>

              <Text style={styles.label}>Allergies</Text>
              <Text style={styles.value}>None</Text>

              <Text style={styles.label}>Medications with Dosage & Timing</Text>
              <Text style={styles.value}>IBM 60 - Morning</Text>

              <Text style={styles.label}>Mobility Notes</Text>
              <Text style={styles.value}>None</Text>

              <Text style={styles.label}>Emergency Plan</Text>
              <Text style={styles.value}>Dose 30</Text>
            </ScrollView>
          ) : activeTab === "Documents" ? (
            <ScrollView
              style={{
                backgroundColor: "#FDF9FF",
                borderRadius: s(16),
                padding: s(20),
                flexGrow: 1,
              }}
              contentContainerStyle={{
                paddingBottom: vs(30),
              }}
              showsVerticalScrollIndicator={false}
            >
              {[
                {
                  name: "Prescription.pdf",
                  url: "https://example.com/prescription.pdf",
                  date: "2025-06-08",
                },
                {
                  name: "LabReport.pdf",
                  url: "https://example.com/labreport.pdf",
                  date: "2025-06-06",
                },
              ].map((doc, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: vs(24),
                    paddingBottom: vs(16),
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#E0E0E0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: vs(8),
                    }}
                  >
                    <Text style={styles.value}>{doc.name}</Text>
                    <TouchableOpacity>
                      <Ionicons name="eye" size={s(20)} color="#4D61E2" />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      fontFamily: "InterVariable",
                      fontSize: ms(14),
                      color: "#666",
                      marginTop: vs(2),
                    }}
                  >
                    {doc.date}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : activeTab === "Contact" ? (
            <ScrollView
              style={{
                backgroundColor: "#FDF9FF",
                borderRadius: s(16),
                padding: s(20),
                flexGrow: 1,
              }}
              contentContainerStyle={{
                paddingBottom: vs(30),
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Family Member/Carer Name</Text>
              <Text style={styles.value}>Father</Text>

              <Text style={styles.label}>Contact Number & Relation</Text>
              <Text style={styles.value}>890987910</Text>
            </ScrollView>
          ) : activeTab === "Progress Note" ? (
            <ScrollView
              style={{
                backgroundColor: "#FDF9FF",
                borderRadius: s(16),
                padding: s(20),
                flexGrow: 1,
              }}
              contentContainerStyle={{
                paddingBottom: vs(30),
              }}
              showsVerticalScrollIndicator={false}
            >
              {[
                {
                  time: "01:30pm",
                  date: "25/06/2024",
                  name: "William Garcia",
                  note: "On examination, findings such as vitals, physical exam results, or relevant test outcomes. Based on the current presentation, the working diagnosis is [insert diagnosis]. The plan includes medications, lifestyle advice, and follow-up.",
                },
                {
                  time: "11:00am",
                  date: "24/06/2024",
                  name: "Mia Davis",
                  note: "Vitals stable. Continued observation advised. Discussed treatment adherence and next steps with patient.",
                },
                {
                  time: "11:00am",
                  date: "24/06/2024",
                  name: "Mia Davis",
                  note: "Vitals stable. Continued observation advised. Discussed treatment adherence and next steps with patient.",
                },
                {
                  time: "11:00am",
                  date: "24/06/2024",
                  name: "Mia Davis",
                  note: "Vitals stable. Continued observation advised. Discussed treatment adherence and next steps with patient.",
                },
                // Simulate large dataset by repeating entries (for testing)
                ...Array(10).fill({
                  time: "11:00am",
                  date: "24/06/2024",
                  name: "Mia Davis",
                  note: "Vitals stable. Continued observation advised. Discussed treatment adherence and next steps with patient.",
                }),
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: vs(24),
                    paddingBottom: vs(16),
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#E0E0E0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: vs(8),
                    }}
                  >
                    <Text style={styles.value}>{item.time}</Text>
                    <Text style={styles.value}>{item.date}</Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "InterVariable",
                      fontSize: ms(14),
                      fontWeight: "700",
                      color: "#333",
                      marginBottom: vs(8),
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.value}>{item.note}</Text>
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.loginButton}>
        <SlideToConfirmButton label="Start Journey" onComplete={handleLogin} />
      </View>
    </View>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    gap: s(12),
    marginTop: vs(25),
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
    marginRight: s(12),
  },
  tabRow: {
    flexDirection: "row",
    marginTop: vs(13),
    paddingHorizontal: s(16),
  },
  tab: {
    paddingVertical: -vs(3),
    paddingHorizontal: s(8),
    marginRight: s(1),
    borderBottomWidth: s(2),
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "#4D61E2",
    marginBottom: vs(13),
  },
  tabText: {
    fontFamily: "InterVariable",
    fontSize: ms(14),
    color: "#888",
  },
  activeTabText: {
    color: "#4D61E2",
    fontWeight: "600",
  },
  contentBox: {
    flex: 1,
    paddingHorizontal: s(3), // Reduced padding for wider content
    marginTop: vs(4),
  },
  label: {
    fontFamily: "InterVariable",
    fontSize: ms(14),
    fontWeight: "600",
    color: "#888",
    marginTop: vs(10),
  },
  value: {
    fontFamily: "InterVariable",
    fontSize: ms(14),
    color: "#333",
    marginTop: vs(4),
    lineHeight: ms(22),
  },
  loginButton: {
    position: "absolute", // Fix button at the bottom
    bottom: vs(20), // Space from bottom edge
    left: s(18),
    right: s(18),
    zIndex: 10, // Ensure button is above content
  },
  cardContent: {
    flex: 1,
    backgroundColor: "rgba(241, 230, 255, 0.2)",
    borderRadius: s(16),
    padding: s(1),
  },
});
