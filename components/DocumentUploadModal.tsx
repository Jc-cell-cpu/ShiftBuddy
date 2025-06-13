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

type UploadStatus = "uploading" | "success" | "failed";

interface UploadItem {
  name: string;
  size: string;
  progress: number;
  status: UploadStatus;
  uri: string;
}

const MAX_FILE_SIZE_MB = 25;

const sanitizeFileName = (name: string) => name.replace(/[^\w.\-]/g, "_");

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onClose,
  onUpload,
  title = "Upload Document",
  allowedTypes = ["image/*"],
  buttonLabel = "Select Document",
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const deleteUpload = (name: string) => {
    setUploads((prev) => prev.filter((u) => u.name !== name));
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (file.size && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          Alert.alert("File too large", "Maximum allowed size is 25 MB.");
          return;
        }

        const cleanName = sanitizeFileName(file.name);
        const uploadItem: UploadItem = {
          name: cleanName,
          size: file.size
            ? `${(file.size / 1024).toFixed(0)} KB`
            : "Unknown size",
          progress: 0,
          status: "uploading",
          uri: file.uri,
        };
        setUploads((prev) => [...prev, uploadItem]);
        setUploading(true);

        try {
          for (let p = 10; p <= 100; p += 10) {
            await new Promise((r) => setTimeout(r, 150));
            setUploads((prev) =>
              prev.map((u) =>
                u.name === cleanName ? { ...u, progress: p } : u
              )
            );
          }

          await onUpload(result);
          setUploads((prev) =>
            prev.map((u) =>
              u.name === cleanName ? { ...u, status: "success" } : u
            )
          );
        } catch (err) {
          setUploads((prev) =>
            prev.map((u) =>
              u.name === cleanName ? { ...u, status: "failed" } : u
            )
          );
        } finally {
          setUploading(false);
        }
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="close" size={s(15)} color="#080808" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Upload odometer photo (vehicle)</Text>

          <View style={styles.introWrapper}>
            <View style={styles.textWrapper}>
              <Text style={styles.modalSubtitle}>
                To begin tracking your trip,{"\n"}please upload a clear photo of{" "}
                {"\n"}your vehicle's odometer.{"\n"}
                Take a clear photo of your {"\n"}odometer showing the current
                {"\n"}mileage.
              </Text>
            </View>
            <View style={styles.selfieWrapper}>
              <Star style={styles.backgroundSvg} width={128} height={128} />
              <Selfi width={92.06} height={102} style={styles.foregroundSvg} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleDocumentPick}
            disabled={uploading}
            activeOpacity={0.8}
          >
            <Upload width={44} height={44} />
            <Text style={styles.uploadBoxText}>{buttonLabel}</Text>
            <Text style={styles.fileNote}>(Max. File size: 25 MB)</Text>
          </TouchableOpacity>

          {/* Upload Status List */}
          {uploads.map((item, index) => (
            <View
              key={index}
              style={{
                marginBottom: vs(12),
                width: "100%",
                backgroundColor: "#F9F9F9",
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: s(8),
                padding: s(10),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#666"
                  style={{ marginRight: s(8), marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: ms(14),
                        fontWeight: "500",
                        color: item.status === "failed" ? "#F44336" : "#333",
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {item.status === "failed"
                        ? "Upload failed, please try again"
                        : item.name}
                    </Text>

                    {(item.status === "success" ||
                      item.status === "failed") && (
                      <TouchableOpacity onPress={() => deleteUpload(item.name)}>
                        <Ionicons name="trash" size={18} color="#888" />
                      </TouchableOpacity>
                    )}

                    {item.status === "uploading" && (
                      <Text style={{ fontSize: ms(12), color: "#888" }}>
                        {item.progress}%
                      </Text>
                    )}
                  </View>

                  {item.status === "failed" && (
                    <Text
                      style={{
                        fontSize: ms(12),
                        color: "#999",
                        marginTop: vs(2),
                      }}
                    >
                      {item.name}
                    </Text>
                  )}

                  {item.status === "uploading" || item.status === "failed" ? (
                    <View
                      style={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#eee",
                        marginTop: vs(6),
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: 6,
                          width: `${item.progress}%`,
                          backgroundColor:
                            item.status === "failed" ? "#F44336" : "#6A1B9A",
                        }}
                      />
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: ms(12),
                        color: "#888",
                        marginTop: vs(6),
                      }}
                    >
                      {item.size}
                    </Text>
                  )}

                  {item.status === "failed" && (
                    <TouchableOpacity onPress={handleDocumentPick}>
                      <Text
                        style={{
                          color: "#F44336",
                          marginTop: vs(4),
                        }}
                      >
                        Try again
                      </Text>
                    </TouchableOpacity>
                  )}

                  {item.status === "success" && (
                    <TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: "InterMedium",
                          color: "#69417E",
                          marginTop: vs(4),
                        }}
                      >
                        Click to view
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}

          <Text style={styles.label}>Started Kilometer</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>10km</Text>
          </View>

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
  },
  foregroundSvg: {
    position: "absolute",
    top: 10,
    left: 10,
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
  },
  uploadButtonText: {
    fontFamily: "InterMedium",
    fontSize: ms(13),
    color: "#000000",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
});

export default DocumentUploadModal;
