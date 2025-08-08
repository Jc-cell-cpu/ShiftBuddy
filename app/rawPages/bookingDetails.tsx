import BiometricAuth from "@/components/BiometricAuth"; // New component
import DocumentUploadModal from "@/components/DocumentUploadModal";
import FeedbackModal from "@/components/FeedbackModal";
import PDFViewerModal from "@/components/PDFViewerModal"; // New component
import ProfileCard from "@/components/ProfileCard";
import SlideToConfirmButton from "@/components/SliderButton";
import VerticalJourneyStepper from "@/components/VerticalJourneyStepper";
import { useJourneyStore } from "@/store/useJourneyStore";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
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

interface BookingParams {
  name?: string;
  gender?: string;
  age?: string;
  date?: string;
  time?: string;
  avatarUrl?: string | string[];
}

interface Document {
  name: string;
  asset?: any;
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
  // "Treatment status",
] as const;

const BookingDetails: React.FC = () => {
  const params = useLocalSearchParams();
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
  const router = useRouter();
  const initialTab = (params?.activeTab as (typeof tabs)[number]) || "Booking";
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(initialTab);
  const [showButton, setShowButton] = useState<boolean>(true);
  const [documentViewerVisible, setDocumentViewerVisible] =
    useState<boolean>(false);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState<boolean>(false);
  const [journeyCompleteModalVisible, setJourneyCompleteModalVisible] = useState<boolean>(false);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(1)).current;
  const [showOpenSection, setShowOpenSection] = useState(false);
  const tabScrollViewRef = useRef<ScrollView>(null);
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: "Prescription sheet",
      asset: require("@/assets/Test.pdf"),
      date: "2025-06-08",
      type: "pdf",
    },
    {
      name: "Lab Report",
      asset: require("@/assets/Test.pdf"),
      date: "2025-06-06",
      type: "pdf",
    },
  ]);
  const [progressNoteText, setProgressNoteText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackReview, setFeedbackReview] = useState("");

  const handleFeedbackSubmit = async (rating: number, review: string) => {
    console.log("⭐ Feedback submitted:", { rating, review });
    setFeedbackSubmitted(true);
    setCurrentStep(5); // Move to step 5 ("Share Feedback") - final step
  };

  const handleJourneyComplete = () => {
    console.log("🎉 Journey completed!");
    setJourneyCompleteModalVisible(true);
  };

  // Effect to scroll tab into view when activeTab changes
  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    if (tabScrollViewRef.current && index >= 0) {
      tabScrollViewRef.current.scrollTo({
        x: index * s(90), // Assuming each tab is approximately 100 scaled units wide
        animated: true,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const updatedDocuments = await Promise.all(
          documents.map(async (doc) => {
            if (!doc.asset) return doc;
            const asset = Asset.fromModule(doc.asset);
            await asset.downloadAsync();
            if (!asset.localUri) {
              throw new Error(`Failed to load asset: ${doc.name}`);
            }
            return {
              ...doc,
              uri: asset.localUri || asset.uri,
            };
          })
        );
        setDocuments(updatedDocuments);
        console.log(
          "Assets loaded:",
          updatedDocuments.map((doc) => ({ name: doc.name, uri: doc.uri }))
        );
      } catch (error) {
        console.error("Failed to load assets:", error);
        Alert.alert("Error", "Failed to load local documents.");
      }
    };
    loadAssets();
  }, [documents]);

  const {
    name = "Unknown",
    gender = "N/A",
    age = "N/A",
    date = "N/A",
    time = "N/A",
    avatarUrl = "",
  } = params as BookingParams;

  const avatar = Array.isArray(avatarUrl) ? avatarUrl[0] : avatarUrl;

  const handleLogin = () => {
    if (!odometerUploaded) {
      // Start Journey - show upload modal for odometer
      setUploadModalVisible(true);
    } else if (odometerUploaded && !destinationReached) {
      // User is sliding "Reach Destination" - show upload modal for image
      setUploadModalVisible(true);
    } else if (destinationReached && imageUploaded && currentStep === 2) {
      // User is sliding "Start Treatment" - show upload modal for consent form
      setUploadModalVisible(true);
    } else if (consentFormUploaded && treatmentStarted && currentStep === 3) {
      // User is sliding "Write Progress Note" - show progress note modal
      setUploadModalVisible(true);
    } else if (progressNoteUploaded && currentStep === 4) {
      // User is sliding "Share Feedback" - show feedback modal
      setFeedbackModalVisible(true);
    } else if (feedbackSubmitted && currentStep >= 5) {
      // User is sliding after feedback submitted - show journey complete popup
      handleJourneyComplete();
    } else {
      // Fallback - show upload modal or progress to next step
      setUploadModalVisible(true);
    }
  };

  const handleDocumentUpload = async (
    result: DocumentPicker.DocumentPickerResult
  ) => {
    // Handle progress note submission (could be with or without file)
    if (modalConfig.modalType === "progress_note") {
      console.log("📝 Progress note submitted!");
      console.log("Progress note text:", progressNoteText);
      if (result && !result.canceled && result.assets.length > 0) {
        console.log("Progress note attachment:", result.assets[0].name);
      }
      setProgressNoteUploaded(true);
      setCurrentStep(4); // Move to step 4 ("Progress Note")
      return;
    }

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      console.log("Document uploaded:", file.name);

      // Update journey state based on current step
      if (!odometerUploaded) {
        // This is the start journey upload (odometer)
        console.log("📸 Odometer uploaded - Journey started!");
        setOdometerUploaded(true);
        setCurrentStep(1); // Move to step 1 ("Reach")
      } else if (odometerUploaded && !destinationReached) {
        // This is the reach destination upload (image)
        console.log("📍 Destination reached - Image uploaded!");
        setDestinationReached(true);
        setImageUploaded(true);
        setCurrentStep(2); // Move to step 2 ("Start Shift")
      } else if (destinationReached && imageUploaded && currentStep === 2) {
        // This is the start treatment upload (consent form)
        console.log("📝 Consent form uploaded - Treatment can begin!");
        setConsentFormUploaded(true);
        setTreatmentStarted(true);
        setCurrentStep(3); // Move to step 3 ("Process")
      }

      // Use this for any additional processing (e.g., send to server)
      console.log("Upload processed for current journey state");
    }
  };

  // Get the modal configuration based on current state
  const getModalConfig = () => {
    if (!odometerUploaded) {
      return {
        modalType: "odometer" as const,
        showKilometerField: true,
        showProgressNoteField: false,
        allowedTypes: ["image/*"],
        buttonLabel: "Click to Upload",
      };
    } else if (odometerUploaded && !destinationReached) {
      return {
        modalType: "destination" as const,
        showKilometerField: true,
        showProgressNoteField: false,
        allowedTypes: ["image/*"],
        buttonLabel: "Click to Upload",
      };
    } else if (destinationReached && imageUploaded && currentStep === 2) {
      return {
        modalType: "consent" as const,
        showKilometerField: false,
        showProgressNoteField: false,
        allowedTypes: ["*/*"], // Allow any file type for consent forms
        buttonLabel: "Click to Upload",
      };
    } else if (consentFormUploaded && treatmentStarted && currentStep === 3) {
      return {
        modalType: "progress_note" as const,
        showKilometerField: false,
        showProgressNoteField: true,
        allowedTypes: ["*/*"], // Allow any file type for attachments
        buttonLabel: "Optional: Attach Document",
      };
    }
    return {
      modalType: "other" as const,
      showKilometerField: false,
      showProgressNoteField: false,
      allowedTypes: ["*/*"],
      buttonLabel: "Click to Upload",
    };
  };

  const modalConfig = getModalConfig();
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: number } };
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

  const openDocumentViewer = (index: number) => {
    const doc = documents[index];
    if (!doc.uri) {
      Alert.alert("Error", "Document not loaded yet.");
      return;
    }
    console.log(
      "Initiating document view for index:",
      index,
      "Type:",
      doc.type,
      "URI:",
      doc.uri
    );
    setSelectedDocumentIndex(index);
    setIsAuthenticating(true);
  };

  const handleAuthComplete = (success: boolean) => {
    setIsAuthenticating(false);
    if (success) {
      setDocumentViewerVisible(true);
    } else {
      Alert.alert(
        "Authentication Failed",
        "You need to authenticate to view this document."
      );
    }
  };

  const closeDocumentViewer = () => {
    console.log("Closing document viewer");
    setDocumentViewerVisible(false);
  };

  const onSwipeGesture = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const dx = event.nativeEvent.translationX;
      const velocity = event.nativeEvent.velocityX;

      console.log(
        "Swipe detected - dx:",
        dx,
        "velocity:",
        velocity,
        "Current tab:",
        activeTab
      );

      const currentIndex = tabs.indexOf(activeTab);

      // Improved swipe detection with velocity consideration
      const isSwipeLeft = dx < -50 || (dx < -20 && velocity < -500);
      const isSwipeRight = dx > 50 || (dx > 20 && velocity > 500);

      if (isSwipeLeft && currentIndex < tabs.length - 1) {
        console.log(
          "Swiping left - Moving to next tab:",
          tabs[currentIndex + 1]
        );
        setActiveTab(tabs[currentIndex + 1]);
      } else if (isSwipeRight && currentIndex > 0) {
        console.log(
          "Swiping right - Moving to previous tab:",
          tabs[currentIndex - 1]
        );
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  };

  const progressNotes = [
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
    ...Array(10).fill({
      time: "11:00am",
      date: "24/06/2024",
      name: "Mia Davis",
      note: "Vitals stable. Continued observation advised. Discussed treatment adherence and next steps with patient.",
    }),
  ];

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

      {/* Profile Card */}
      <ProfileCard
        name={name}
        gender={gender}
        age={age}
        date={date}
        time={time}
        avatarUrl={avatar}
        onOpenPress={() => setShowOpenSection(true)}
        showOpenSection={showOpenSection}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          ref={tabScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabRow, { justifyContent: "center" }]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                setShowOpenSection(false); // ✅ close the open section when a tab is clicked
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
              marginHorizontal: s(16),
              padding: s(14),
              borderRadius: s(10),
              marginTop: vs(8),
            }}
          >
            <Text
              style={{
                fontSize: ms(14),
                marginBottom: vs(8),
                fontFamily: "InterMedium",
              }}
            >
              Track Treatment - ID09876
            </Text>
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
            <VerticalJourneyStepper />
          </View>
        </ScrollView>
      ) : (
        /* Tab Content with Swipe Handler */
        <PanGestureHandler
          onHandlerStateChange={onSwipeGesture}
          activeOffsetX={[-30, 30]}
        >
          <View style={styles.contentBox}>
            <View style={styles.cardContent}>
              {activeTab === "Booking" ? (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{ paddingBottom: vs(100) }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  <Text style={styles.label}>Scheduled Visit Time</Text>
                  <Text style={styles.value}>{date}</Text>
                  <Text style={styles.label}>Duration</Text>
                  <Text style={styles.value}>{time}</Text>
                  <Text style={styles.label}>Type of Care</Text>
                  <Text style={styles.value}>Medication</Text>
                  <Text style={styles.label}>Client Notes</Text>
                  <Text style={styles.value}>
                    Bring a valid ID and your insurance card.
                  </Text>
                </ScrollView>
              ) : activeTab === "Medical info" ? (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{ paddingBottom: vs(100) }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  <Text style={styles.label}>Diagnoses</Text>
                  <Text style={styles.value}>Done</Text>
                  <Text style={styles.label}>Allergies</Text>
                  <Text style={styles.value}>None</Text>
                  <Text style={styles.label}>
                    Medications with Dosage & Timing
                  </Text>
                  <Text style={styles.value}>Medication</Text>
                  <Text style={styles.label}>Mobility Notes</Text>
                  <Text style={styles.value}>None</Text>
                  <Text style={styles.label}>Emergency Plan</Text>
                  <Text style={styles.value}>Dose 30</Text>
                </ScrollView>
              ) : activeTab === "Documents" ? (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{ paddingBottom: vs(100) }}
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
                        }}
                      >
                        <Text style={styles.value}>{doc.name}</Text>
                        <TouchableOpacity
                          onPress={() => openDocumentViewer(index)}
                        >
                          <Ionicons name="eye" size={s(20)} color="#4D61E2" />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          styles.label,
                          { fontSize: ms(14), color: "#666", marginTop: vs(2) },
                        ]}
                      >
                        {doc.date}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : activeTab === "Contact" ? (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{ paddingBottom: vs(100) }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  <Text style={styles.label}>Family Member/Carer Name</Text>
                  <Text style={styles.value}>Father</Text>
                  <Text style={styles.label}>Contact Number & Relation</Text>
                  <Text style={styles.value}>890987654</Text>
                </ScrollView>
              ) : activeTab === "Progress Note" ? (
                <FlatList
                  style={styles.scrollView}
                  contentContainerStyle={{ paddingBottom: vs(100) }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  data={progressNotes}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
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
                  )}
                />
              ) : null}
            </View>
          </View>
        </PanGestureHandler>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        visible={documentViewerVisible}
        onClose={closeDocumentViewer}
        documentUri={documents[selectedDocumentIndex]?.uri}
        documentName={documents[selectedDocumentIndex]?.name || "Document"}
      />

      {/* Biometric Authentication */}
      {isAuthenticating && (
        <BiometricAuth onAuthComplete={handleAuthComplete} />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onUpload={handleDocumentUpload}
        modalType={modalConfig.modalType}
        showKilometerField={modalConfig.showKilometerField}
        showProgressNoteField={modalConfig.showProgressNoteField}
        progressNoteValue={progressNoteText}
        onProgressNoteChange={setProgressNoteText}
        allowedTypes={modalConfig.allowedTypes}
        buttonLabel={modalConfig.buttonLabel}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        onSubmit={handleFeedbackSubmit}
      />

      {/* Journey Complete Modal */}
      {journeyCompleteModalVisible && (
        <Modal visible={journeyCompleteModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.journeyCompleteModal}>
              <Ionicons name="checkmark-circle" size={s(64)} color="#4CAF50" />
              <Text style={styles.journeyCompleteTitle}>Journey Complete!</Text>
              <Text style={styles.journeyCompleteMessage}>
                Congratulations! You have successfully completed all steps of your journey.
                Thank you for your dedication and professionalism.
              </Text>
              <TouchableOpacity
                style={styles.journeyCompleteButton}
                onPress={() => {
                  setJourneyCompleteModalVisible(false);
                  router.replace("/home/homePage");
                }}
              >
                <Text style={styles.journeyCompleteButtonText}>Return to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Animated.View style={[styles.loginButton, { opacity: buttonOpacity }]}>
        <SlideToConfirmButton
          label={
            !odometerUploaded
              ? "Start Journey"
              : !destinationReached
              ? "Reach Destination"
              : destinationReached && imageUploaded && !consentFormUploaded
              ? "Start Treatment"
              : consentFormUploaded && treatmentStarted && currentStep === 3
              ? "Write Progress Note"
              : progressNoteUploaded && currentStep === 4
              ? "Share Feedback"
              : feedbackSubmitted && currentStep >= 5
              ? "Journey Complete"
              : "Continue Journey"
          }
          onComplete={handleLogin}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    padding: s(16),
    gap: s(61),
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
  tabContainer: {
    backgroundColor: "rgba(241, 230, 255, 0.2)",
    borderRadius: s(9),
    marginHorizontal: s(8),
    height: vs(49),
    marginTop: vs(4),
    justifyContent: "center",
    alignItems: "center",
  },
  tabRow: {
    flexDirection: "row",
    marginTop: vs(13),
    paddingHorizontal: s(16),
  },
  tab: {
    paddingVertical: vs(3),
    paddingHorizontal: s(8),
    marginRight: s(1),
    borderBottomWidth: s(2),
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "#4D61E2",
    marginBottom: vs(10),
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
  },
  cardContent: {
    flex: 1,
    backgroundColor: "rgba(241, 230, 255, 0.2)",
    borderRadius: s(16),
    padding: s(1),
  },
  scrollView: {
    backgroundColor: "#FDF9FF",
    borderRadius: s(16),
    padding: s(20),
    flexGrow: 1,
  },
  scrollViewTrack: {
    backgroundColor: "#FDF9FF",
    borderRadius: s(16),
    padding: -s(4),
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  journeyCompleteModal: {
    backgroundColor: "#FDF9FF",
    borderRadius: s(16),
    padding: s(32),
    margin: s(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  journeyCompleteTitle: {
    fontSize: ms(20),
    fontFamily: "InterSemiBold",
    color: "#333",
    marginTop: vs(16),
    marginBottom: vs(12),
  },
  journeyCompleteMessage: {
    fontSize: ms(14),
    fontFamily: "InterVariable",
    color: "#666",
    textAlign: "center",
    lineHeight: ms(20),
    marginBottom: vs(24),
  },
  journeyCompleteButton: {
    backgroundColor: "#4D61E2",
    borderRadius: s(8),
    paddingVertical: vs(14),
    paddingHorizontal: s(32),
    minWidth: s(180),
    alignItems: "center",
  },
  journeyCompleteButtonText: {
    color: "#FFF",
    fontSize: ms(16),
    fontFamily: "InterSemiBold",
  },
});

export default BookingDetails;
