/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { uploadDocument } from "@/api/client";
import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Starr.svg";
import Upload from "@/assets/UploadIcon.svg";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  allowedTypes?: string[];
  buttonLabel?: string;
  modalType?:
    | "odometer"
    | "destination"
    | "consent"
    | "progress_note"
    | "other";
  subtitle?: string;
  showKilometerField?: boolean;
  kilometerValue?: string;
  showProgressNoteField?: boolean;
  progressNoteValue?: string;
  onProgressNoteChange?: (text: string) => void;
  onUpload?: (fileUrl: string) => void;
  slotId?: string;
  trackId?: string;
  onSubmit?: () => Promise<void>;
  onSubmissionComplete?: () => void;
}

type UploadStatus = "uploading" | "success" | "failed" | "verified";

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
  modalType = "other",
  subtitle,
  showKilometerField = true,
  kilometerValue = "10km",
  showProgressNoteField = false,
  progressNoteValue = "",
  onProgressNoteChange,
  slotId,
  trackId,
  onSubmit,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [selectedUpload, setSelectedUpload] = useState<UploadItem | null>(null);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "failed"
  >("idle");
  const [uploadedDocUrl, setUploadedDocUrl] = useState<string | null>(null);
  const [uploadStartModalType, setUploadStartModalType] = useState<
    string | null
  >(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setUploads([]);
      setPreviewUri(null);
      setSelectedUpload(null);
      setShowSuccess(false);
    }
  }, [visible]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(async () => {
          setShowSuccess(false);
          onClose();
          if (uploadedDocUrl && onSubmit) {
            await onSubmit();
          }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, uploadedDocUrl, onSubmit, onClose]);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length) {
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

        setUploads([uploadItem]); // Always replace existing uploads
        setUploading(true);

        // Store the selected file for later upload and mark as ready
        setSelectedFile(result);
        setUploads((prev) =>
          prev.map((u) =>
            u.name === cleanName ? { ...u, status: "success" } : u
          )
        );
        setUploading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  // const verifiedUpload = uploads.find((u) => u.status === "verified");

  const handleFinalUpload = async () => {
    if (!selectedFile?.assets?.[0]) {
      Alert.alert(
        "No File Selected",
        "Please select a file first before uploading."
      );
      return;
    }

    try {
      setUploadStatus("uploading");

      const file = selectedFile.assets[0];
      const result = await uploadDocument(
        file.uri,
        file.name,
        file.mimeType || "application/octet-stream"
      );

      if (result?.documentId?.length) {
        setUploadStatus("success");
        setUploadedDocUrl(result.documentId[0]); // save S3 URL
      } else {
        setUploadStatus("failed");
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploadStatus("failed");
    }
  };

  const deleteUpload = (name: string) => {
    setUploads((prev) => prev.filter((u) => u.name !== name));
  };

  // Function to get success message based on a specific modal type
  const getSuccessMessage = (modalType: string) => {
    switch (modalType) {
      case "odometer":
        return "Your odometer photo has been\nreceived and started the\nJourney.";
      case "destination":
        return "Your destination photo has been\nreceived and confirmed your\narrival.";
      case "consent":
        return "Your consent form has been\nreceived and treatment can\nbegin.";
      case "progress_note":
        return "Your progress note has been\nsubmitted successfully.";
      default:
        return "Your document has been\nuploaded successfully.";
    }
  };

  // Get dynamic content based on modalType - memoized to recalculate when modalType changes
  const modalContent = useMemo(() => {
    console.log("📋 DocumentUploadModal - modalType:", modalType);
    switch (modalType) {
      case "odometer":
        return {
          title: "Upload odometer photo (vehicle)",
          subtitle:
            "To begin tracking your trip,\nplease upload a clear photo of \nyour vehicle's odometer.\nTake a clear photo of your \nodometer showing the current\nmileage.",
          buttonText: "Upload Photo",
          successMessage:
            "Your odometer photo has been\nreceived and started the\nJourney.",
        };
      case "destination":
        return {
          title: "Upload destination photo",
          subtitle:
            "Please upload a clear photo \nto confirm you have reached \nthe destination.\nThis will help us track your \njourney progress.",
          buttonText: "Upload Photo",
          successMessage:
            "Your destination photo has been\nreceived and confirmed your\narrival.",
        };
      case "consent":
        return {
          title: "Upload consent form",
          subtitle:
            "Please upload the signed \nconsent form to start the \ntreatment process.\nEnsure all required fields \nare completed.",
          buttonText: "Upload Form",
          successMessage:
            "Your consent form has been\nreceived and treatment can\nbegin.",
        };
      case "progress_note":
        return {
          title: "Write Progress Note",
          subtitle:
            "Please write a detailed \nprogress note about the \ncurrent treatment status.\nOptionally attach any \nsupporting documents.",
          buttonText: "Submit Progress Note",
          successMessage:
            "Your progress note has been\nsubmitted successfully.",
        };
      default:
        return {
          title: title || "Upload Document",
          subtitle: subtitle || "Please upload the required document.",
          buttonText: "Upload Document",
          successMessage: "Your document has been\nuploaded successfully.",
        };
    }
  }, [modalType, title, subtitle]);

  return (
    <>
      {/* Main Upload Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <BlurView style={styles.modalContainer} blurType="light" blurAmount={4}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={s(15)} color="#080808" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{modalContent.title}</Text>

            <View style={styles.introWrapper}>
              <View style={styles.textWrapper}>
                <Text style={styles.modalSubtitle}>
                  {modalContent.subtitle}
                </Text>
              </View>
              <View style={styles.selfieWrapper}>
                <Star style={styles.backgroundSvg} width={128} height={128} />
                <Selfi
                  width={92.06}
                  height={102}
                  style={styles.foregroundSvg}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleDocumentPick}
              disabled={uploading}
            >
              <Upload width={44} height={44} />
              <Text style={styles.uploadBoxText}>{buttonLabel}</Text>
              <Text style={styles.fileNote}>(Max. File size: 25 MB)</Text>
            </TouchableOpacity>

            {/* Upload Status Cards */}
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
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#666"
                    style={{ marginRight: s(8), marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    {/* Filename + Action Row */}
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

                      {item.status === "uploading" && (
                        <Text style={{ fontSize: ms(12), color: "#888" }}>
                          {item.progress}%
                        </Text>
                      )}

                      {item.status === "success" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#4CAF50"
                        />
                      )}

                      {item.status === "failed" && (
                        <TouchableOpacity
                          onPress={() => deleteUpload(item.name)}
                        >
                          <Ionicons name="trash" size={18} color="#888" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* File size or retry */}
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

                    {/* Progress bar (uploading or success) */}
                    {["uploading", "success", "failed"].includes(
                      item.status
                    ) && (
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
                            width: `${
                              item.status === "success" ? 100 : item.progress
                            }%`,
                            backgroundColor:
                              item.status === "failed"
                                ? "#F44336"
                                : item.status === "success"
                                ? "#4CAF50"
                                : "#6A1B9A",
                          }}
                        />
                      </View>
                    )}

                    {/* Retry / Click to view */}
                    {item.status === "failed" && (
                      <TouchableOpacity onPress={handleDocumentPick}>
                        <Text style={{ color: "#F44336", marginTop: vs(4) }}>
                          Try again
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.status === "success" && (
                      <TouchableOpacity
                        onPress={() => {
                          setPreviewUri(item.uri);
                          setSelectedUpload(item);
                        }}
                      >
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

            {showKilometerField && (
              <>
                <Text style={styles.label}>Started Kilometer</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.inputText}>{kilometerValue}</Text>
                </View>
              </>
            )}

            {showProgressNoteField && (
              <>
                <Text style={styles.label}>Write a Progress Note</Text>
                <TextInput
                  style={styles.progressNoteInput}
                  placeholder="Enter detailed progress note about the current treatment status..."
                  placeholderTextColor="#999"
                  value={progressNoteValue}
                  onChangeText={onProgressNoteChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </>
            )}

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  (uploadStatus === "failed" ||
                    uploadStatus === "uploading") && { opacity: 0.5 },
                ]}
                onPress={
                  uploadStatus === "success"
                    ? () => {
                        // Final submit after upload success
                        if (uploadedDocUrl) {
                          onUpload?.(uploadedDocUrl);
                          setShowSuccess(true);
                        }
                      }
                    : handleFinalUpload
                }
                disabled={
                  uploadStatus === "uploading" || uploadStatus === "failed"
                }
              >
                <Text style={styles.uploadButtonText}>
                  {uploadStatus === "idle" || uploadStatus === "uploading"
                    ? "Upload Photo"
                    : "Submit"}
                </Text>
              </TouchableOpacity>{" "}
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Preview Modal */}
      <Modal visible={!!previewUri} transparent animationType="fade">
        <BlurView style={styles.modalContainer} blurType="light" blurAmount={4}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPreviewUri(null)}
            >
              <Ionicons name="close" size={s(15)} color="#080808" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Preview Uploaded Image</Text>
            <View
              style={{
                width: "100%",
                height: s(250),
                marginVertical: vs(12),
                borderRadius: s(8),
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: previewUri! }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>

            {/* <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                if (selectedUpload) {
                  setUploads((prev) =>
                    prev.map((u) =>
                      u.name === selectedUpload.name
                        ? { ...u, status: "verified" }
                        : u
                    )
                  );
                }
                setPreviewUri(null);
              }}
            >
              <Text style={styles.uploadButtonText}>Confirm</Text>
            </TouchableOpacity> */}
          </View>
        </BlurView>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} animationType="fade">
        <BlurView style={styles.modalContainer} blurType="light" blurAmount={4}>
          <Animated.View
            style={[
              styles.modalContent,
              { alignItems: "center", opacity: fadeAnim },
            ]}
          >
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowSuccess(false);
                onClose();
                if (onSubmissionComplete) {
                  onSubmissionComplete();
                }
              }}
            >
              <Ionicons name="close" size={s(15)} color="#080808" />
            </TouchableOpacity>

            <Ionicons
              name="checkmark"
              size={34}
              color="#7F4E2D"
              style={{
                backgroundColor: "#FBE1D1",
                padding: 14,
                borderRadius: 99,
                marginBottom: vs(12),
              }}
            />
            <Text
              style={{
                fontSize: ms(16),
                fontWeight: "600",
                marginBottom: vs(8),
              }}
            >
              Upload Successfully!
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: ms(13),
                color: "#444",
                marginBottom: vs(16),
              }}
            >
              {getSuccessMessage(uploadStartModalType || modalType)}
            </Text>
            {/* <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.uploadButtonText}>OK</Text>
            </TouchableOpacity> */}
          </Animated.View>
        </BlurView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.23)",
  },
  modalContent: {
    width: s(320),
    backgroundColor: "#FFF",
    borderRadius: s(16),
    padding: s(20),
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
    fontSize: ms(16),
    color: "#1A1A1A",
    fontWeight: "600",
    marginBottom: vs(6),
  },
  introWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(12),
    width: "100%",
  },
  textWrapper: { flex: 1, paddingRight: s(10) },
  modalSubtitle: {
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
    width: vs(130),
    marginTop: vs(8),
    alignSelf: "flex-start",
  },
  uploadButton: {
    backgroundColor: "#F2C7AC",
    height: vs(44),
    borderRadius: s(5),
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: ms(13),
    color: "#000000",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  progressNoteInput: {
    width: "100%",
    minHeight: vs(100),
    padding: s(12),
    borderWidth: 0.4,
    borderRadius: s(8),
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    fontSize: ms(14),
    color: "#333",
    marginBottom: vs(16),
    textAlignVertical: "top",
  },
});

export default DocumentUploadModal;
