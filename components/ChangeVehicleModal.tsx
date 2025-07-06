/* eslint-disable @typescript-eslint/no-unused-vars */
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const ChangeVehicleModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      // Reset upload state when modal is opened
      setFileName(null);
      setUploading(false);
      setUploadError(false);
      setShowSuccess(false);
    }
  }, [visible]);

  if (!visible) return null;

  const handleFileUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/jpeg", "image/png", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setUploading(true);
    setUploadError(false);
    setFileName(file.name);

    try {
      // Simulate upload delay
      await new Promise((res) => setTimeout(res, 2000));
      // Uncomment to simulate failure:
      // throw new Error("Upload failed");
      setUploading(false);
    } catch (e) {
      setUploading(false);
      setUploadError(true);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <BlurView style={styles.absolute} blurType="light" blurAmount={4} />

      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeButton,
            { position: "absolute", top: vs(10), right: s(10) },
          ]}
        >
          <Ionicons name="close" size={s(18)} color="#444" />
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Add Vehicle</Text>
        <Text style={styles.modalText}>Select the reason</Text>

        <View style={styles.reasonRow}>
          {["Problem 1", "Problem 2", "Problem 3"].map((reason, i) => (
            <TouchableOpacity key={i} style={styles.reasonButton}>
              <Text style={styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload UI */}
        {!fileName ? (
          <TouchableOpacity style={styles.uploadBox} onPress={handleFileUpload}>
            <Ionicons name="cloud-upload-outline" size={28} color="#69417E" />
            <Text style={styles.uploadText}>Click to Upload</Text>
            <Text style={styles.uploadNote}>(Max. File size: 25 MB)</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.uploadedCard,
              uploadError && {
                borderColor: "#FF4C4C",
                backgroundColor: "#FFF0F0",
              },
            ]}
          >
            <Text
              style={{
                color: uploadError ? "#FF4C4C" : "#000",
                fontSize: ms(12),
                marginBottom: vs(4),
              }}
            >
              {uploadError
                ? "Upload failed, please try again"
                : "Uploaded Successfully"}
            </Text>
            <Text style={{ fontSize: ms(12), color: "#666" }}>{fileName}</Text>

            {uploading && (
              <View style={styles.progressBar}>
                <View style={styles.progressBarFill} />
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setFileName(null);
                setUploading(false);
                setUploadError(false);
              }}
              style={{ marginTop: vs(6), alignSelf: "flex-end" }}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={uploadError ? "#FF4C4C" : "#555"}
              />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.modalText}>Registration Number</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter number"
            style={styles.inputText}
            placeholderTextColor="#aaa"
          />
        </View>

        <Text style={styles.modalText}>Write description</Text>
        <View
          style={[
            styles.inputBox,
            { height: vs(80), justifyContent: "flex-start" },
          ]}
        >
          <TextInput
            placeholder="Describe here..."
            multiline
            style={styles.inputText}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setShowSuccess(true);
              setTimeout(() => {
                setShowSuccess(false);
                onClose();
              }, 3000); // auto-close after 3 seconds
            }}
          >
            <Text style={styles.primaryText}>Change</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showSuccess && (
        <View style={styles.successOverlay}>
          <BlurView style={styles.absolute} blurType="light" blurAmount={10} />
          <View style={styles.successModal}>
            <TouchableOpacity
              style={styles.successClose}
              onPress={() => {
                setShowSuccess(false);
                onClose();
              }}
            >
              <Ionicons name="close" size={20} color="#444" />
            </TouchableOpacity>

            <Ionicons
              name="checkmark-circle"
              size={48}
              color="#69417E"
              style={{ marginBottom: vs(10) }}
            />
            <Text style={styles.successTitle}>
              Request submitted successfully
            </Text>
            <Text style={styles.successText}>
              Admin will notify you regarding your approval.{" "}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChangeVehicleModal;

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: ms(18),
    padding: s(16),
    paddingTop: vs(30),
  },
  closeButton: {
    zIndex: 10,
  },
  modalTitle: {
    fontSize: ms(16),
    fontWeight: "600",
    color: "#000",
    marginBottom: vs(10),
  },
  modalText: {
    fontSize: ms(13),
    color: "#111",
    marginBottom: vs(6),
    fontWeight: "500",
  },
  reasonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: s(8),
    marginBottom: vs(10),
  },
  reasonButton: {
    backgroundColor: "#FBEFE7",
    paddingVertical: vs(8),
    paddingHorizontal: s(14),
    borderRadius: s(10),
  },
  reasonText: {
    fontSize: ms(12),
    color: "#444",
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: s(12),
    paddingVertical: vs(20),
    alignItems: "center",
    marginBottom: vs(12),
  },
  uploadText: {
    color: "#69417E",
    fontWeight: "600",
    fontSize: ms(13),
    marginTop: vs(6),
  },
  uploadNote: {
    fontSize: ms(11),
    color: "#888",
  },
  uploadedCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: s(10),
    padding: s(10),
    marginBottom: vs(10),
    backgroundColor: "#F9F9F9",
  },
  progressBar: {
    width: "100%",
    height: 5,
    backgroundColor: "#eee",
    borderRadius: 3,
    marginTop: vs(6),
  },
  progressBarFill: {
    width: "75%",
    height: 5,
    backgroundColor: "#69417E",
    borderRadius: 3,
  },
  inputBox: {
    backgroundColor: "#F3F3F3",
    borderRadius: s(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    marginBottom: vs(10),
  },
  inputText: {
    fontSize: ms(13),
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(10),
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#69417E",
    borderRadius: s(10),
    paddingVertical: vs(10),
    alignItems: "center",
    marginRight: s(8),
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: s(10),
    paddingVertical: vs(10),
    alignItems: "center",
  },
  secondaryText: {
    color: "#000",
    fontWeight: "600",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  successModal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: ms(16),
    padding: s(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  successTitle: {
    fontSize: ms(16),
    fontWeight: "600",
    color: "#000",
    marginBottom: vs(4),
  },
  successText: {
    fontSize: ms(13),
    color: "#444",
  },
  successClose: {
    position: "absolute",
    top: vs(8),
    right: s(10),
    zIndex: 10,
  },
});
