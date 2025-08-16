import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";

interface Props {
  visible: boolean;
  onClose: () => void;
  documentUri: string;
  documentName: string;
}

const PDFViewerModal: React.FC<Props> = ({
  visible,
  onClose,
  documentUri,
  documentName,
}) => {
  const pdfRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Safety fallback: stop loader after 10s even if PDF doesn’t fire complete
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>
              {documentName}
            </Text>
          </View>

          {/* Show loader while loading */}
          {loading && (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#4D61E2" />
              {progress > 0 && (
                <Text style={styles.loaderText}>
                  Loading... {Math.round(progress * 100)}%
                </Text>
              )}
            </View>
          )}

          {/* PDF Viewer */}
          <Pdf
            ref={pdfRef}
            source={{ uri: documentUri, cache: true }}
            style={styles.pdf}
            trustAllCerts={false}
            onLoadProgress={(percent) => {
              setProgress(percent);
              if (percent > 0.95) setLoading(false); // ✅ stop loader if almost loaded
            }}
            onLoadComplete={() => setLoading(false)}
            onError={(error) => {
              console.error("PDF error:", error);
              setLoading(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    flex: 1,
    width: "95%",
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#69417E",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  closeButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flexShrink: 1,
  },
  pdf: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  loaderBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    alignItems: "center",
    zIndex: 10,
  },
  loaderText: {
    marginTop: 8,
    color: "#4D61E2",
    fontWeight: "500",
  },
});

export default PDFViewerModal;
