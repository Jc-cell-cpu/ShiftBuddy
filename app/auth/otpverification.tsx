// app/auth/otp-verification.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState(27); // Start timer at 27 seconds
  const [canResend, setCanResend] = useState(false);
  const [focused, setFocused] = useState(false); // New state to track focus
  const textInputRef = useRef<TextInput>(null);

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Focus the TextInput when the component mounts
  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (text: string) => {
    const newOtp = text.split("").slice(0, 4); // Limit to 4 digits
    const paddedOtp = [...newOtp, ...Array(4 - newOtp.length).fill("")]; // Pad with empty strings
    setOtp(paddedOtp);
  };

  // Handle Resend OTP
  const handleResend = () => {
    if (canResend) {
      setTimer(27);
      setCanResend(false);
      setOtp(["", "", "", ""]); // Reset OTP input
      textInputRef.current?.focus(); // Refocus the TextInput after resend
      // In a real app, you'd trigger an API call to resend the OTP here
    }
  };

  // Handle Continue
  const handleContinue = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      // In a real app, you'd verify the OTP with an API call here
      router.push("/auth/reset-password"); // Navigate to the reset password page
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />

      {/* Header Row with Back Button and Title */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Verify</Text>
      </View>

      <Text style={styles.subtitle}>Enter OTP</Text>

      {/* OTP Input Boxes with Overlay TextInput */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              digit && styles.otpBoxFilled,
              focused && index === 0 && styles.otpBoxFocused, // Highlight the first box when focused
            ]}
          >
            <Text style={styles.otpText}>{digit}</Text>
          </View>
        ))}
        {/* Overlay TextInput to capture input */}
        <TextInput
          ref={textInputRef}
          style={styles.overlayInput}
          value={otp.join("")}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus={true}
          caretHidden={true}
          onFocus={() => setFocused(true)} // Set focused state to true
          onBlur={() => {
            setFocused(false); // Set focused state to false
            textInputRef.current?.focus(); // Refocus if the keyboard is dismissed
          }}
        />
      </View>

      <View style={styles.resendContainer}>
        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
          <Text
            style={[styles.resendText, canResend && styles.resendTextActive]}
          >
            Resend OTP
          </Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>
          {`00:${timer.toString().padStart(2, "0")} secs`}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          otp.join("").length !== 4 && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={otp.join("").length !== 4}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 55,
    marginTop: -20,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  title: {
    fontFamily: "InterExtraBold",
    fontSize: 22,
    fontWeight: "700",
    color: "#69417E",
    flex: 1,
    textAlign: "center",
    marginRight: 50,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  otpBox: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  otpBoxFilled: {
    borderColor: "#6F3F89",
    borderWidth: 2,
  },
  otpBoxFocused: {
    borderColor: "#6F3F89", // Highlight color for the first box when focused
    borderWidth: 2,
  },
  otpText: {
    fontSize: 20,
    fontWeight: "600",
  },
  overlayInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    textAlign: "center",
    fontSize: 20,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: "#999",
  },
  resendTextActive: {
    fontFamily: "InterMedium",
    color: "#69417E",
  },
  timerText: {
    fontFamily: "InterMedium",
    fontWeight: "500",
    fontSize: 14,
    color: "#999",
  },
  continueButton: {
    backgroundColor: "#6F3F89",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 100,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    fontFamily: "InterVariable",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
