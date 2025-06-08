import BackgroundSVGWhite from "@/components/BackgroundSVGWhite";
import { ms, s, vs } from "@/utils/scale";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState(27);
  const [canResend, setCanResend] = useState(false);
  const [focused, setFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
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
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar
        backgroundColor=""
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />
      {/* Background SVG behind all content */}
      <View style={StyleSheet.absoluteFill}>
        <BackgroundSVGWhite />
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? vs(80) : vs(20)}
      >
        <View style={styles.innerContainer}>
          {/* Background SVG behind all content */}
          <View style={StyleSheet.absoluteFill}>
            <BackgroundSVGWhite />
          </View>
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
                style={[
                  styles.resendText,
                  canResend && styles.resendTextActive,
                ]}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.timerText,
                canResend && styles.timerTextInactive, // add this line
              ]}
            >
              {`00:${timer.toString().padStart(2, "0")} secs`}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                otp.join("").length !== 4 && styles.continueButtonDisabled,
                keyboardVisible && styles.continueButtonWithKeyboard,
              ]}
              onPress={handleContinue}
              disabled={otp.join("").length !== 4}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(40),
    backgroundColor: "#fff",
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
    backgroundColor: "#fafcff",
    borderColor: "#ccc",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },
  title: {
    fontFamily: "InterVariable",
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
    // color: "#999",
    color: "#69417E",
  },
  timerTextInactive: {
    color: "#999",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: vs(20),
  },
  continueButton: {
    backgroundColor: "#6F3F89",
    borderRadius: s(25),
    paddingVertical: vs(15),
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonWithKeyboard: {
    marginTop: vs(20),
    marginBottom: vs(10),
  },
  continueButtonText: {
    fontFamily: "InterVariable",
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "700",
  },
});
