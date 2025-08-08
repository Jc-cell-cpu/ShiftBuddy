/* eslint-disable react-hooks/exhaustive-deps */
import Selfi from "@/assets/Selfi.svg";
import Star from "@/assets/Starr.svg";
import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setRating(0);
      setReview("");
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
        }).start(() => {
          setShowSuccess(false);
          onClose();
          router.replace({
            pathname: "/home/homePage",
            params: { feedbackSubmitted: "true" },
          });
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async () => {
    if (rating === 0) {
      return; // Don't submit without rating
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, review);
      console.log("⭐ Feedback submitted:", { rating, review });
      
      // Show success modal after a brief delay
      setTimeout(() => {
        setShowSuccess(true);
      }, 300);
    } catch (error) {
      console.error("❌ Feedback submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={styles.starButton}
      >
        <Ionicons
          name={index < rating ? "star" : "star-outline"}
          size={ms(32)}
          color={index < rating ? "#FFD700" : "#DDD"}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <>
      {/* Main Feedback Modal */}
      <Modal
        visible={visible && !showSuccess}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <BlurView style={styles.modalContainer} blurType="light" blurAmount={4}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={s(15)} color="#080808" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Share Your Feedback</Text>

            <View style={styles.introWrapper}>
              <View style={styles.textWrapper}>
                <Text style={styles.modalSubtitle}>
                  How was your experience?{"\n"}Please rate the service and{"\n"}share your thoughts to help us{"\n"}improve our care quality.
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

            {/* Star Rating */}
            <Text style={styles.label}>Rate Your Experience</Text>
            <View style={styles.starContainer}>
              {renderStars()}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0 && "Please select a rating"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </Text>

            {/* Review Input */}
            <Text style={styles.label}>Write a Review (Optional)</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience with us..."
              placeholderTextColor="#999"
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === 0 && styles.disabledButton,
                ]}
                disabled={rating === 0 || submitting}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowSuccess(false);
                router.push("/home/homePage");
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
              Feedback Submitted!
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: ms(13),
                color: "#444",
                marginBottom: vs(16),
              }}
            >
              Thank you for your feedback!{"\n"}Your review helps us improve{"\n"}our service quality.
            </Text>
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
    marginBottom: vs(20),
    width: "100%",
  },
  textWrapper: { 
    flex: 1, 
    paddingRight: s(10) 
  },
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
  label: {
    alignSelf: "flex-start",
    fontSize: ms(14),
    fontWeight: "600",
    color: "#666",
    marginBottom: vs(8),
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: vs(8),
  },
  starButton: {
    padding: s(4),
  },
  ratingText: {
    textAlign: "center",
    fontSize: ms(14),
    color: "#69417E",
    fontWeight: "500",
    marginBottom: vs(20),
    minHeight: vs(20),
  },
  reviewInput: {
    width: "100%",
    minHeight: vs(100),
    padding: s(12),
    borderWidth: 0.4,
    borderRadius: s(8),
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    fontSize: ms(14),
    color: "#333",
    marginBottom: vs(20),
    textAlignVertical: "top",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#F2C7AC",
    width: "100%",
    height: vs(44),
    borderRadius: s(8),
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: ms(14),
    color: "#000000",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
});

export default FeedbackModal;
