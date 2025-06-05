// app/auth/otp-verification.tsx
import { ms, s, vs } from "@/utils/scale"; // or your defined path
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  PixelRatio,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState(27);
  const [canResend, setCanResend] = useState(false);
  const [focused, setFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

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

  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  const handleOtpChange = (text: string) => {
    const newOtp = text.split("").slice(0, 4);
    const paddedOtp = [...newOtp, ...Array(4 - newOtp.length).fill("")];
    setOtp(paddedOtp);
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(27);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      textInputRef.current?.focus();
    }
  };

  const handleContinue = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      router.push("/auth/reset-password");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={scale(20)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Verify</Text>
      </View>

      <Text style={styles.subtitle}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              digit && styles.otpBoxFilled,
              focused && index === 0 && styles.otpBoxFocused,
            ]}
          >
            <Text style={styles.otpText}>{digit}</Text>
          </View>
        ))}
        <TextInput
          ref={textInputRef}
          style={styles.overlayInput}
          value={otp.join("")}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus={true}
          caretHidden={true}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            textInputRef.current?.focus();
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
    paddingHorizontal: s(24),
    paddingTop: vs(40),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(55),
    marginTop: vs(-10),
  },
  backButton: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },
  title: {
    fontFamily: "InterExtraBold",
    fontSize: ms(22),
    fontWeight: "700",
    color: "#69417E",
    flex: 1,
    textAlign: "center",
    marginRight: s(50),
  },
  subtitle: {
    fontSize: ms(18),
    color: "#555",
    textAlign: "center",
    marginBottom: vs(30),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: vs(20),
    position: "relative",
  },
  otpBox: {
    width: s(60),
    height: s(60),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: s(8),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: s(5),
  },
  otpBoxFilled: {
    borderColor: "#6F3F89",
    borderWidth: 2,
  },
  otpBoxFocused: {
    borderColor: "#6F3F89",
    borderWidth: 2,
  },
  otpText: {
    fontSize: ms(20),
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
    fontSize: ms(20),
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(40),
  },
  resendText: {
    fontSize: ms(14),
    color: "#999",
  },
  resendTextActive: {
    fontFamily: "InterMedium",
    color: "#69417E",
  },
  timerText: {
    fontFamily: "InterMedium",
    fontWeight: "500",
    fontSize: ms(14),
    color: "#999",
  },
  continueButton: {
    backgroundColor: "#6F3F89",
    borderRadius: s(25),
    paddingVertical: vs(15),
    alignItems: "center",
    marginTop: vs(100),
    marginBottom: vs(20),
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    fontFamily: "InterVariable",
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "700",
  },
});
