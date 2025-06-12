import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Starr.svg";
import Upload from "@/assets/UploadIcon.svg";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (file: DocumentPicker.DocumentPickerResult) => Promise<void>;
  title?: string;
  allowedTypes?: string[];
  buttonLabel?: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onClose,
  onUpload,
  title = "Upload Document",
  allowedTypes = ["application/pdf"],
  buttonLabel = "Select Document",
}) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploading(true);
        try {
          await onUpload(result);
          Alert.alert("Success", "Document uploaded successfully.");
          onClose();
        } catch (error) {
          console.error("Upload error:", error);
          Alert.alert("Error", "Failed to upload document. Please try again.");
        } finally {
          setUploading(false);
        }
      } else {
        console.log("Document selection canceled");
      }
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        style={styles.modalContainer}
        blurType="light"
        blurAmount={4}
        reducedTransparencyFallbackColor="black"
      >
        <View style={styles.modalContent}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="close" size={s(15)} color="#080808" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.modalTitle}>Upload odometer photo (vehicle)</Text>

          {/* Text + SVG side-by-side */}
          <View style={styles.introWrapper}>
            {/* Left: Text */}
            <View style={styles.textWrapper}>
              <Text style={styles.modalSubtitle}>
                To begin tracking your trip,{"\n"}please upload a clear photo of{" "}
                {"\n"}your vehicle's odometer.{"\n"}
                Take a clear photo of your {"\n"}odometer showing the current
                {"\n"}mileage.
              </Text>
            </View>

            {/* Right: SVG */}
            <View style={styles.selfieWrapper}>
              <Star
                style={styles.backgroundSvg}
                width={128}
                height={128}
                // fill={"#F9EEFE"}
              />
              <Selfi width={92.06} height={102} style={styles.foregroundSvg} />
            </View>
          </View>

          {/* Upload Box */}
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleDocumentPick}
            disabled={uploading}
            activeOpacity={0.8}
          >
            <Upload width={44} height={44} />
            <Text style={styles.uploadBoxText}>Click to Upload</Text>
            <Text style={styles.fileNote}>(Max. File size: 25 MB)</Text>
          </TouchableOpacity>

          {/* Started Kilometer */}
          <Text style={styles.label}>Started Kilometer</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>10km</Text>
          </View>

          {/* Upload Button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.disabledButton]}
              onPress={handleDocumentPick}
              disabled={uploading}
              activeOpacity={0.7}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.23)",
  },
  modalContent: {
    width: s(320),
    backgroundColor: "#FFF",
    // backgroundColor: "#F8F7FF",
    borderRadius: s(16),
    padding: s(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: vs(10),
    right: s(10),
    backgroundColor: "#fafcff",
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalTitle: {
    fontFamily: "InterMedium",
    color: "#1A1A1A",
    fontSize: ms(16),
    // fontWeight: "700",
    lineHeight: ms(19),
    marginBottom: vs(8),
    width: "100%",
    flexShrink: 1,
    textAlign: "left",
  },
  introWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(12),
    width: "100%",
  },
  textWrapper: {
    flex: 1,
    paddingRight: s(10),
  },
  modalSubtitle: {
    fontFamily: "InterVariable",
    fontSize: ms(12),
    color: "#5E5E5E",
    lineHeight: vs(18),
  },
  selfieWrapper: {
    position: "relative",
    width: s(105),
    height: vs(105),
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
    color: "#F9EEFE",
    borderColor: "#F9EEFE",
    borderWidth: 1,
  },
  foregroundSvg: {
    position: "absolute",
    top: 10, // Adjust as needed
    left: 10, // Adjust as needed
    zIndex: 1,
  },
  uploadBox: {
    width: "100%",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#69417E",
    borderRadius: s(12),
    paddingVertical: vs(20),
    alignItems: "center",
    marginBottom: vs(16),
  },
  uploadBoxText: {
    fontSize: ms(14),
    color: "#69417E",
    fontWeight: "600",
    marginTop: vs(8),
  },
  fileNote: {
    fontSize: ms(12),
    color: "#888",
    marginTop: vs(4),
  },
  label: {
    alignSelf: "flex-start",
    fontFamily: "InterVariable",
    fontSize: ms(14),
    fontWeight: "600",
    color: "#666",
    marginBottom: vs(6),
  },
  inputBox: {
    width: "100%",
    padding: s(12),
    borderWidth: 0.4,
    borderRadius: s(8),
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    marginBottom: vs(16),
  },
  inputText: {
    fontSize: ms(14),
    color: "#666",
  },
  buttonWrapper: {
    width: vs(99),
    marginTop: vs(8),
    alignSelf: "flex-start",
  },
  uploadButton: {
    backgroundColor: "#F2C7AC",
    height: vs(44),
    borderRadius: s(5),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  uploadButtonText: {
    fontFamily: "InterMedium",
    fontSize: ms(13),
    color: "#000000",
    // fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
});

export default DocumentUploadModal;
