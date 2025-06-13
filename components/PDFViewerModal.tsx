import LeftArrow from "@/assets/arrow-circle-left.svg";
import RightArrow from "@/assets/arrow-circle-right.svg";
import { s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";

interface PDFViewerModalProps {
  visible: boolean;
  onClose: () => void;
  documentUri: string | undefined;
  documentName: string;
  onLoadComplete?: (totalPages: number) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  visible,
  onClose,
  documentUri,
  documentName,
  onLoadComplete,
}) => {
  const pdfRef = useRef<Pdf>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const debounceRef = useRef<boolean>(false);

  const goToNextPage = () => {
    if (debounceRef.current || currentPage >= totalPages) return;
    debounceRef.current = true;

    const nextPage = currentPage + 1;
    pdfRef.current?.setPage(nextPage);
    setCurrentPage(nextPage);

    setTimeout(() => {
      debounceRef.current = false;
    }, 300);
  };

  const goToPreviousPage = () => {
    if (debounceRef.current || currentPage <= 1) return;
    debounceRef.current = true;

    const prevPage = currentPage - 1;
    pdfRef.current?.setPage(prevPage);
    setCurrentPage(prevPage);

    setTimeout(() => {
      debounceRef.current = false;
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        style={styles.fullscreenBlur}
        blurType="light"
        blurAmount={4}
        reducedTransparencyFallbackColor="black"
      >
        <View style={styles.documentModalWrapper}>
          <TouchableOpacity
            style={styles.closeButtonTop}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="close" size={s(15)} color="#080808" />
          </TouchableOpacity>

          <View style={styles.pdfContainer}>
            {documentUri ? (
              <Pdf
                ref={pdfRef}
                source={{ uri: documentUri, cache: false }}
                page={currentPage}
                style={styles.pdfViewer}
                fitPolicy={2}
                onLoadComplete={(numberOfPages) => {
                  setTotalPages(numberOfPages > 0 ? numberOfPages : 1);
                  setCurrentPage(1);
                  pdfRef.current?.setPage(1);
                  onLoadComplete?.(numberOfPages);
                }}
                onPageChanged={(page, numberOfPages) => {
                  if (debounceRef.current) return;
                  debounceRef.current = true;
                  if (page >= 1 && page <= numberOfPages) {
                    setCurrentPage(page);
                  }
                  if (totalPages !== numberOfPages) {
                    setTotalPages(numberOfPages > 0 ? numberOfPages : 1);
                  }
                  setTimeout(() => {
                    debounceRef.current = false;
                  }, 300);
                }}
                onError={(error) => {
                  console.error("PDF error:", error);
                  Alert.alert("Error", "Failed to load PDF.");
                }}
                enablePaging={true}
                horizontal={true}
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
            <View style={styles.pdfOverlay} />
          </View>

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
            <LeftArrow width={s(24)} height={s(24)} fill="#4D61E2" />
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
            <RightArrow width={s(24)} height={s(24)} fill="#4D61E2" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullscreenBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.23)",
  },
  documentModalWrapper: {
    position: "relative",
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: s(20),
    paddingTop: vs(16),
    paddingHorizontal: s(12),
    paddingBottom: vs(2),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  closeButtonTop: {
    position: "absolute",
    top: vs(3),
    right: s(3),
    backgroundColor: "#fff",
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 1,
  },
  pdfContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: s(10),
    overflow: "hidden",
    backgroundColor: "transparent",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  pdfViewer: {
    flex: 1,
    width: SCREEN_WIDTH * 0.85 - s(24),
    height: SCREEN_HEIGHT * 0.5 - vs(56),
    backgroundColor: "transparent",
  },
  pdfOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  leftNavButton: {
    position: "absolute",
    left: -s(22),
    top: "50%",
    transform: [{ translateY: -s(20) }],
    backgroundColor: "#fff",
    width: s(23),
    height: s(23),
    borderRadius: s(18),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 6,
  },
  rightNavButton: {
    position: "absolute",
    right: -s(22),
    top: "50%",
    transform: [{ translateY: -s(18) }],
    backgroundColor: "#fff",
    width: s(23),
    height: s(23),
    borderRadius: s(18),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    elevation: 6,
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
    fontSize: s(16),
    color: "#ff0000",
    zIndex: 10,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    opacity: 0.5,
  },
});

export default PDFViewerModal;
