/* eslint-disable @typescript-eslint/no-unused-vars */
// bookingdetails.tsx (updated merge)
import { getSlotDetails } from "@/api/client";
import BiometricAuth from "@/components/BiometricAuth";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import FeedbackModal from "@/components/FeedbackModal";
import PDFViewerModal from "@/components/PDFViewerModal";
import ProfileCard from "@/components/ProfileCard";
import SlideToConfirmButton from "@/components/SliderButton";
import VerticalJourneyStepper from "@/components/VerticalJourneyStepper";
import { useJourneyStore } from "@/store/useJourneyStore";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Document {
  name: string;
  date: string;
  type: "pdf";
  uri?: string;
}

const tabs = [
  "Booking",
  "Medical info",
  "Documents",
  "Contact",
  "Progress Note",
] as const;

const BookingDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Journey store
  const {
    odometerUploaded,
    destinationReached,
    imageUploaded,
    consentFormUploaded,
    treatmentStarted,
    progressNoteUploaded,
    feedbackSubmitted,
    currentStep,
    setOdometerUploaded,
    setDestinationReached,
    setImageUploaded,
    setConsentFormUploaded,
    setTreatmentStarted,
    setProgressNoteUploaded,
    setFeedbackSubmitted,
    setCurrentStep,
    progressToNextStep,
  } = useJourneyStore();

  // States
  const [loading, setLoading] = useState(true);
  const [slotDetails, setSlotDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Booking");

  const [documentViewerVisible, setDocumentViewerVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [journeyCompleteModalVisible, setJourneyCompleteModalVisible] =
    useState(false);

  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [progressNoteText, setProgressNoteText] = useState("");
  const [showOpenSection, setShowOpenSection] = useState(false);

  const tabScrollViewRef = useRef<ScrollView>(null);
  const lastScrollY = useRef(0);
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const hideSlider = () => {
    Animated.timing(buttonOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const showSlider = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Fetch slot details
  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        setLoading(true);
        const res = await getSlotDetails(id as string);
        setSlotDetails(res.data);

        // map API docs if exist
        if (res.data?.documents) {
          const { medicalDoc = [], complianceDoc = [] } = res.data.documents;
          const apiDocs: Document[] = [
            ...medicalDoc.map((url: string, index: number) => ({
              name: `Medical Document ${index + 1}`,
              uri: url,
              date: new Date().toISOString().split("T")[0],
              type: "pdf" as const,
            })),
            ...complianceDoc.map((url: string, index: number) => ({
              name: `Compliance Document ${index + 1}`,
              uri: url,
              date: new Date().toISOString().split("T")[0],
              type: "pdf" as const,
            })),
          ];
          setDocuments(apiDocs);
        }
      } catch (err) {
        console.error("Failed to fetch slot details:", err);
        Alert.alert("Error", "Unable to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSlotDetails();
  }, [id]);

  // Auto-scroll tabs
  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    if (tabScrollViewRef.current && index >= 0) {
      tabScrollViewRef.current.scrollTo({ x: index * s(90), animated: true });
    }
  }, [activeTab]);

  // Hide/show button on scroll (restore old animated version)
  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY.current && currentY > 4) {
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentY < lastScrollY.current) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = currentY;
  };

  // Swipe between tabs
  const onSwipeGesture = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const dx = event.nativeEvent.translationX;
      const velocity = event.nativeEvent.velocityX;
      const currentIndex = tabs.indexOf(activeTab);

      const isSwipeLeft = dx < -50 || (dx < -20 && velocity < -500);
      const isSwipeRight = dx > 50 || (dx > 20 && velocity > 500);

      if (isSwipeLeft && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
        setShowOpenSection(false);
        showSlider(); // 👈 force show
      } else if (isSwipeRight && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
        setShowOpenSection(false);
        showSlider(); // 👈 force show
      }
    }
  };

  // Document viewer
  const openDocumentViewer = (index: number) => {
    const doc = documents[index];
    if (!doc.uri) {
      Alert.alert("Error", "No file available for this document.");
      return;
    }
    setSelectedDocumentIndex(index);
    setIsAuthenticating(true);
  };
  const handleAuthComplete = (success: boolean) => {
    setIsAuthenticating(false);
    if (success) setDocumentViewerVisible(true);
  };
  const closeDocumentViewer = () => setDocumentViewerVisible(false);

  // Upload flow
  const handleDocumentUpload = async (
    result: DocumentPicker.DocumentPickerResult
  ) => {
    if (!result.canceled && result.assets.length > 0) {
      if (!odometerUploaded) {
        setOdometerUploaded(true);
        setCurrentStep(1);
      } else if (odometerUploaded && !destinationReached) {
        setDestinationReached(true);
        setImageUploaded(true);
        setCurrentStep(2);
      } else if (destinationReached && imageUploaded && currentStep === 2) {
        setConsentFormUploaded(true);
        setTreatmentStarted(true);
        setCurrentStep(3);
      } else if (consentFormUploaded && treatmentStarted && currentStep === 3) {
        setProgressNoteUploaded(true);
        setCurrentStep(4);
      }
    }
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <Text>Loading booking details...</Text>
      </View>
    );
  if (!slotDetails)
    return (
      <View style={styles.centered}>
        <Text>No details found.</Text>
      </View>
    );

  const {
    personalInfo,
    medicalInfo,
    relationInfo,
    address,
    startDate,
    startTime,
    endTime,
    duration,
  } = slotDetails;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

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

      {/* Profile */}
      <ProfileCard
        name={personalInfo?.name}
        gender={personalInfo?.gender}
        age={
          personalInfo?.dob
            ? (
                new Date().getFullYear() -
                new Date(personalInfo.dob).getFullYear()
              ).toString()
            : "N/A"
        }
        date={new Date(startDate).toDateString()}
        time={`${startTime} - ${endTime}`}
        avatarUrl={personalInfo?.profileImage}
        onOpenPress={() => setShowOpenSection((prev) => !prev)}
        showOpenSection={showOpenSection}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          ref={tabScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                setShowOpenSection(false);
                showSlider();
              }}
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

      {showOpenSection ? (
        <ScrollView
          style={styles.scrollViewTrack}
          contentContainerStyle={{ paddingBottom: vs(100) }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View
            style={{
              backgroundColor: "#FFF9FF",
              marginHorizontal: -s(10), // 👈 reduced margin so it shifts more left
              padding: s(14),
              borderRadius: s(10),
              marginTop: vs(8),
            }}
          >
            {/* Header Row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: vs(8),
              }}
            >
              <Text style={{ fontSize: ms(14), fontFamily: "InterMedium" }}>
                Track Treatment -{" "}
              </Text>
              <Text
                style={{
                  fontSize: ms(14),
                  color: "#666",
                  fontFamily: "InterVariable",
                }}
              >
                {slotDetails._id}
              </Text>
            </View>

            {/* Sub text */}
            <Text
              style={{
                fontSize: ms(13),
                color: "#666",
                marginBottom: -vs(8),
                fontFamily: "InterVariable",
              }}
            >
              Treatment status
            </Text>

            {/* Stepper */}
            <VerticalJourneyStepper />
          </View>
        </ScrollView>
      ) : (
        // Tab Content
        <PanGestureHandler
          onHandlerStateChange={onSwipeGesture}
          activeOffsetX={[-30, 30]}
        >
          <View style={styles.contentBox}>
            {activeTab === "Booking" && (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: vs(100) }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <Text style={styles.label}>Scheduled Visit Time</Text>
                <Text style={styles.value}>
                  {new Date(startDate).toDateString()} ({startTime} - {endTime})
                </Text>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>{duration}</Text>
                <Text style={styles.label}>Client Notes</Text>
                <Text style={styles.value}>
                  {personalInfo?.clientNotes || "N/A"}
                </Text>
              </ScrollView>
            )}

            {activeTab === "Medical info" && (
              <ScrollView
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <Text style={styles.label}>Diagnoses</Text>
                <Text style={styles.value}>
                  {medicalInfo?.diagnoses || "N/A"}
                </Text>
                <Text style={styles.label}>Allergies</Text>
                <Text style={styles.value}>
                  {medicalInfo?.allergy?.join(", ") || "N/A"}
                </Text>
              </ScrollView>
            )}

            {activeTab === "Documents" && (
              <ScrollView
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {documents.map((doc, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: vs(24),
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#E0E0E0",
                      paddingBottom: vs(16),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.value}>{doc.name}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          doc.uri
                            ? openDocumentViewer(index)
                            : Alert.alert("Error", `No file for "${doc.name}"`)
                        }
                      >
                        <Ionicons name="eye" size={s(20)} color="#4D61E2" />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        styles.label,
                        { fontSize: ms(14), color: "#666" },
                      ]}
                    >
                      {doc.date}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === "Contact" && (
              <ScrollView
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <Text style={styles.label}>Family Member/Carer Name</Text>
                <Text style={styles.value}>
                  {relationInfo?.relativeName || "N/A"}
                </Text>
                <Text style={styles.label}>Contact Number & Relation</Text>
                <Text style={styles.value}>
                  {relationInfo?.relativeNumber} (
                  {relationInfo?.relativeRelation})
                </Text>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                  {address?.street}, {address?.suburb}, {address?.state} -{" "}
                  {address?.postCode}
                </Text>
              </ScrollView>
            )}

            {activeTab === "Progress Note" && (
              <FlatList
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: vs(100) }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                data={slotDetails?.progressNotes || []}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginBottom: vs(20),
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#E0E0E0",
                      paddingBottom: vs(16),
                    }}
                  >
                    <Text style={styles.value}>{item.date}</Text>
                    <Text style={styles.value}>{item.note}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </PanGestureHandler>
      )}

      {/* PDF Viewer */}
      <PDFViewerModal
        visible={documentViewerVisible}
        onClose={closeDocumentViewer}
        documentUri={documents[selectedDocumentIndex]?.uri ?? ""}
        documentName={documents[selectedDocumentIndex]?.name || "Document"}
      />
      {isAuthenticating && (
        <BiometricAuth onAuthComplete={handleAuthComplete} />
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onUpload={handleDocumentUpload}
        modalType="other"
        showKilometerField={false}
        showProgressNoteField={false}
        progressNoteValue={progressNoteText}
        onProgressNoteChange={setProgressNoteText}
        allowedTypes={["*/*"]}
        buttonLabel="Upload"
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        onSubmit={async () => setFeedbackSubmitted(true)}
      />

      {/* Journey Complete Modal */}
      {journeyCompleteModalVisible && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.journeyCompleteModal}>
              <Ionicons name="checkmark-circle" size={s(64)} color="#4CAF50" />
              <Text style={styles.journeyCompleteTitle}>Journey Complete!</Text>
              <TouchableOpacity
                style={styles.journeyCompleteButton}
                onPress={() => router.replace("/home/homePage")}
              >
                <Text style={styles.journeyCompleteButtonText}>
                  Return Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Slide-to-confirm button */}
      <Animated.View
        style={[
          styles.loginButton,
          { opacity: buttonOpacity, bottom: insets.bottom + vs(16) },
        ]}
      >
        <SlideToConfirmButton
          label={
            !odometerUploaded
              ? "Start Journey"
              : !destinationReached
              ? "Reach Destination"
              : !consentFormUploaded
              ? "Start Treatment"
              : !progressNoteUploaded
              ? "Write Progress Note"
              : !feedbackSubmitted
              ? "Share Feedback"
              : "Journey Complete"
          }
          onComplete={() => setUploadModalVisible(true)}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    marginTop: vs(25),
  },
  headerTitle: { fontFamily: "InterSemiBold", fontSize: ms(18) },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(22),
    backgroundColor: "#fafcff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },
  tabContainer: {
    backgroundColor: "rgba(241, 230, 255, 0.2)",
    borderRadius: s(9),
    marginHorizontal: s(8),
    height: vs(49),
  },
  tabRow: { flexDirection: "row", marginTop: vs(13), paddingHorizontal: s(16) },
  tab: {
    paddingVertical: vs(3),
    paddingHorizontal: s(8),
    marginRight: s(1),
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: { borderColor: "#4D61E2" },
  tabText: { fontSize: ms(14), color: "#888" },
  activeTabText: { color: "#4D61E2", fontWeight: "600" },
  contentBox: { flex: 1, marginTop: vs(4) },
  scrollView: {
    backgroundColor: "#FDF9FF",
    borderRadius: s(16),
    padding: s(20),
  },
  scrollViewTrack: {
    backgroundColor: "#FDF9FF",
    borderRadius: s(16),
    padding: s(20),
  },
  label: {
    fontSize: ms(14),
    fontWeight: "600",
    color: "#888",
    marginTop: vs(10),
  },
  value: { fontSize: ms(14), color: "#333", marginTop: vs(4) },
  loginButton: {
    position: "absolute",
    bottom: vs(42),
    left: s(18),
    right: s(18),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  journeyCompleteModal: {
    backgroundColor: "#FDF9FF",
    borderRadius: s(16),
    padding: s(32),
    margin: s(20),
    alignItems: "center",
  },
  journeyCompleteTitle: {
    fontSize: ms(20),
    marginTop: vs(16),
    marginBottom: vs(12),
  },
  journeyCompleteButton: {
    backgroundColor: "#4D61E2",
    borderRadius: s(8),
    paddingVertical: vs(14),
    paddingHorizontal: s(32),
    marginTop: vs(16),
  },
  journeyCompleteButtonText: { color: "#FFF", fontSize: ms(16) },
});

export default BookingDetails;
