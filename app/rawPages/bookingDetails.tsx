import ProfileCard from "@/components/ProfileCard";
import SlideToConfirmButton from "@/components/SliderButton";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  PanResponder,
  PanResponderGestureState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { default as Pdf, default as PDFViewCtrl } from "react-native-pdf";

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
  asset: any;
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
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Booking");
  const router = useRouter();
  const [showButton, setShowButton] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(1)).current;
  const [documentViewerVisible, setDocumentViewerVisible] =
    useState<boolean>(false);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pdfRef = useRef<PDFViewCtrl>(null);
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

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const updatedDocuments = await Promise.all(
          documents.map(async (doc) => {
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
  }, []);

  const {
    name = "Unknown",
    gender = "N/A",
    age = "N/A",
    date = "N/A",
    time = "N/A",
    avatarUrl = "",
  } = params as BookingParams;

  const avatar = Array.isArray(avatarUrl) ? avatarUrl[0] : avatarUrl;

  const handleLogin = () => {};

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
      "Opening document viewer for index:",
      index,
      "Type:",
      doc.type,
      "URI:",
      doc.uri
    );
    setSelectedDocumentIndex(index);
    setCurrentPage(1);
    setTotalPages(0);
    setDocumentViewerVisible(true);
  };

  const closeDocumentViewer = () => {
    console.log("Closing document viewer");
    setDocumentViewerVisible(false);
    setCurrentPage(1);
    setTotalPages(0);
  };

  const goToNextPage = () => {
    // console.log(
    //   "Next page clicked, currentPage:",
    //   currentPage,
    //   "totalPages:",
    //   totalPages
    // );
    if (pdfRef.current && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      // console.log(
      //   "Calling setPage:",
      //   nextPage,
      //   "pdfRef valid:",
      //   !!pdfRef.current
      // );
      pdfRef.current.setPage(nextPage);
      setCurrentPage(nextPage);
    } else {
      // console.log("Cannot go to next page: at last page or pdfRef invalid");
    }
  };

  const goToPreviousPage = () => {
    // console.log(
    //   "Previous page clicked, currentPage:",
    //   currentPage,
    //   "totalPages:",
    //   totalPages
    // );
    if (pdfRef.current && currentPage > 1) {
      const prevPage = currentPage - 1;
      // console.log(
      //   "Calling setPage:",
      //   prevPage,
      //   "pdfRef valid:",
      //   !!pdfRef.current
      // );
      pdfRef.current.setPage(prevPage);
      setCurrentPage(prevPage);
    } else {
      // console.log(
      //   "Cannot go to previous page: at first page or pdfRef invalid"
      // );
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 50,
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        const currentIndex = tabs.indexOf(activeTab);
        if (gestureState.dx > 50 && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        } else if (gestureState.dx < -50 && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
      },
    })
  ).current;

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
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
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
              <Text style={styles.label}>Medications with Dosage & Timing</Text>
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
                    <TouchableOpacity onPress={() => openDocumentViewer(index)}>
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

      {/* Document Viewer Modal */}
      <Modal
        visible={documentViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDocumentViewer}
      >
        <BlurView style={styles.fullscreenBlur} intensity={40} tint="dark">
          <View style={styles.documentModalWrapper}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButtonTop}
              onPress={closeDocumentViewer}
              activeOpacity={0.7}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="close" size={s(20)} color="#4D61E2" />
            </TouchableOpacity>

            {/* PDF Viewer */}
            <View style={styles.pdfContainer}>
              {documents[selectedDocumentIndex]?.uri ? (
                <Pdf
                  ref={pdfRef}
                  source={{
                    uri: documents[selectedDocumentIndex].uri,
                    cache: false,
                  }}
                  page={currentPage}
                  style={styles.pdfViewer}
                  fitPolicy={2} // Fit both width and height
                  onLoadComplete={(
                    numberOfPages,
                    filePath,
                    { width, height }
                  ) => {
                    // console.log(
                    //   "PDF loaded, total pages:",
                    //   numberOfPages,
                    //   "dimensions:",
                    //   width,
                    //   height
                    // );
                    setTotalPages(numberOfPages > 0 ? numberOfPages : 1);
                    setCurrentPage(1);
                    if (pdfRef.current) {
                      // console.log(
                      //   "Setting initial page to 1 with scroll reset"
                      // );
                      pdfRef.current.setPage(1);
                    }
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    // console.log(
                    //   "Page changed to:",
                    //   page,
                    //   "total pages:",
                    //   numberOfPages
                    // );
                    setCurrentPage(
                      page > 0 && page <= numberOfPages ? page : 1
                    );
                    if (totalPages !== numberOfPages) {
                      setTotalPages(numberOfPages > 0 ? numberOfPages : 1);
                    }
                  }}
                  onError={(error) => {
                    console.error("PDF error:", error);
                    Alert.alert("Error", "Failed to load PDF.");
                  }}
                  enablePaging={true}
                  horizontal={true} // Disabled for consistent alignment
                  trustAllCerts={false}
                  renderActivityIndicator={() => (
                    <ActivityIndicator
                      size="large"
                      color="#4D61E2"
                      style={styles.loadingIndicator}
                    />
                  )}
                />
              ) : (
                <Text style={styles.errorText}>No document selected.</Text>
              )}
            </View>

            {/* Page Indicator */}
            {/* <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                Page {currentPage} of {totalPages}
              </Text>
            </View> */}

            {/* Navigation Buttons */}
            <TouchableOpacity
              style={[
                styles.leftNavButton,
                currentPage <= 1 && styles.disabledButton,
              ]}
              onPress={goToPreviousPage}
              disabled={currentPage <= 1 || totalPages <= 1}
              activeOpacity={0.7}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="chevron-back" size={s(24)} color="#4D61E2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.rightNavButton,
                currentPage >= totalPages && styles.disabledButton,
              ]}
              onPress={goToNextPage}
              disabled={currentPage >= totalPages || totalPages <= 1}
              activeOpacity={0.7}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="chevron-forward" size={s(24)} color="#4D61E2" />
            </TouchableOpacity>
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  fullscreenBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  documentModalWrapper: {
    position: "relative",
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: "#fff",
    borderRadius: s(20),
    paddingTop: vs(16),
    paddingHorizontal: s(12),
    paddingBottom: vs(2),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonTop: {
    position: "absolute",
    top: vs(12),
    right: s(12),
    backgroundColor: "#fff",
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 4,
  },
  pdfContainer: {
    flex: 1,
    width: "100%",
    height: "100%", // Ensure container fills modal
    borderRadius: s(10),
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  leftNavButton: {
    position: "absolute",
    left: -s(15),
    top: "50%",
    transform: [{ translateY: -s(18) }],
    backgroundColor: "#fff",
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 6,
  },
  rightNavButton: {
    position: "absolute",
    right: -s(15),
    top: "50%",
    transform: [{ translateY: -s(18) }],
    backgroundColor: "#fff",
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 6,
  },
  pdfViewer: {
    flex: 1,
    width: SCREEN_WIDTH * 0.85 - s(24), // Match modal width minus padding
    height: SCREEN_HEIGHT * 0.75 - vs(56), // Match modal height minus padding
    backgroundColor: "#fff",
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 2,
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    fontFamily: "InterVariable",
    fontSize: ms(16),
    color: "#ff0000",
    zIndex: 10,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    opacity: 0.5,
  },
  pageIndicator: {
    position: "absolute",
    bottom: vs(16),
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: vs(4),
    paddingHorizontal: s(12),
    borderRadius: s(12),
  },
  pageText: {
    fontFamily: "InterVariable",
    fontSize: ms(12),
    color: "#fff",
  },
});

export default BookingDetails;
