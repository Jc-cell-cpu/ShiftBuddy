import ProfileCard from "@/components/ProfileCard";
import SlideToConfirmButton from "@/components/SliderButton";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  PanResponderGestureState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";

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
  const [showButton, setShowButton] = useState(true);
  const lastScrollY = useRef(0);
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const [pdfViewerVisible, setPdfViewerVisible] = useState(false); // PDF viewer visibility
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0); // Current document index
  const documents = [
    {
      name: "Prescription.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      date: "2025-06-08",
    },
    {
      name: "LabReport.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      date: "2025-06-06",
    },
  ]; // Document list for navigation

  const avatar = Array.isArray(params.avatarUrl)
    ? params.avatarUrl[0]
    : params.avatarUrl;

  function handleLogin() {
    // Handle login logic here
  }

  // Handle scroll to show/hide button
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: any } };
  }) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > lastScrollY.current && currentScrollY > 4) {
      if (showButton) {
        setShowButton(false);
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else if (currentScrollY < lastScrollY.current) {
      if (!showButton) {
        setShowButton(true);
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
    lastScrollY.current = currentScrollY;
  };

  // Open PDF viewer
  const openPdfViewer = (index: React.SetStateAction<number>) => {
    setSelectedDocumentIndex(index);
    setPdfViewerVisible(true);
  };

  // Close PDF viewer
  const closePdfViewer = () => {
    setPdfViewerVisible(false);
  };

  // Navigate to previous document
  const goToPreviousDocument = () => {
    if (selectedDocumentIndex > 0) {
      setSelectedDocumentIndex(selectedDocumentIndex - 1);
    }
  };

  // Navigate to next document
  const goToNextDocument = () => {
    if (selectedDocumentIndex < documents.length - 1) {
      setSelectedDocumentIndex(selectedDocumentIndex + 1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        const currentIndex = tabs.indexOf(activeTab);
        if (gestureState.dx < -20 && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        } else if (gestureState.dx > 20 && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
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
                paddingBottom: vs(100),
              }}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
                paddingBottom: vs(100),
              }}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
                paddingBottom: vs(100),
              }}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {documents.map((doc, index) => (
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
                    <TouchableOpacity onPress={() => openPdfViewer(index)}>
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
                paddingBottom: vs(100),
              }}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
                paddingBottom: vs(100),
              }}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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

      {/* PDF Viewer Modal */}
      <Modal
        visible={pdfViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePdfViewer}
      >
        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        >
          <View style={styles.pdfContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePdfViewer}
            >
              <Ionicons name="close" size={s(24)} color="#fff" />
            </TouchableOpacity>

            {/* Document Name */}
            <Text style={styles.pdfTitle}>
              {documents[selectedDocumentIndex]?.name}
            </Text>

            {/* PDF Viewer */}
            <Pdf
              source={{
                uri: documents[selectedDocumentIndex]?.url,
                cache: true,
              }}
              style={styles.pdf}
              onError={(error: any) => console.log("PDF Error:", error)}
              trustAllCerts={false}
            />

            {/* Navigation Arrows */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  selectedDocumentIndex === 0 && styles.disabledButton,
                ]}
                onPress={goToPreviousDocument}
                disabled={selectedDocumentIndex === 0}
              >
                <Ionicons
                  name="arrow-back"
                  size={s(24)}
                  color={selectedDocumentIndex === 0 ? "#ccc" : "#fff"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  selectedDocumentIndex === documents.length - 1 &&
                    styles.disabledButton,
                ]}
                onPress={goToNextDocument}
                disabled={selectedDocumentIndex === documents.length - 1}
              >
                <Ionicons
                  name="arrow-forward"
                  size={s(24)}
                  color={
                    selectedDocumentIndex === documents.length - 1
                      ? "#ccc"
                      : "#fff"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Bottom Button */}
      <Animated.View style={[styles.loginButton, { opacity: buttonOpacity }]}>
        <SlideToConfirmButton label="Start Journey" onComplete={handleLogin} />
      </Animated.View>
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
    paddingHorizontal: s(3),
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
    position: "absolute",
    bottom: vs(35),
    left: s(18),
    right: s(18),
    zIndex: 10,
    paddingVertical: vs(8),
    borderRadius: s(12),
  },
  cardContent: {
    flex: 1,
    backgroundColor: "rgba(241, 230, 255, 0.2)",
    borderRadius: s(16),
    padding: s(1),
  },
  // PDF Viewer Styles
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  pdfContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: s(16),
    padding: s(16),
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: s(10),
    right: s(10),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  pdfTitle: {
    fontFamily: "InterVariable",
    fontSize: ms(16),
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: vs(10),
  },
  pdf: {
    flex: 1,
    width: "100%",
    borderRadius: s(8),
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(10),
  },
  navButton: {
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
