import BackgroundSVGWhite from "@/components/BackgroundSVGWhite";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, mvs, s, vs } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";

const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "newPassword" | "confirmPassword" | null
  >(null);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [buttonOffset] = useState(new Animated.Value(0));
  const animationInProgress = useRef(false); // Prevent multiple animations

  // Keyboard listeners with debouncing
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (_e) => {
      if (animationInProgress.current) return; // Skip if animation is in progress
      animationInProgress.current = true;

      // Move button up by a fixed amount or a fraction of keyboard height
      Animated.timing(buttonOffset, {
        toValue: Platform.OS === "ios" ? -vs(80) : -vs(60), // Adjust based on your layout
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        animationInProgress.current = false; // Reset animation flag
      });
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      if (animationInProgress.current) return; // Skip if animation is in progress
      animationInProgress.current = true;

      // Move button back to original position
      Animated.timing(buttonOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        animationInProgress.current = false; // Reset animation flag
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [buttonOffset]);

  const handleSave = () => {
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (!newPassword.trim()) newErrors.newPassword = "New password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (!hasError) {
      router.push("/auth/login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        backgroundColor="#fff"
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />

      {/* Background behind all content */}
      <View style={StyleSheet.absoluteFill}>
        <BackgroundSVGWhite />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? vs(40) : 0} // Reduced offset
      >
        <View style={styles.innerContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={s(20)} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
          </View>

          {/* New Password */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                errors.newPassword && styles.inputError,
                focusedField === "newPassword" && styles.inputFocused,
              ]}
              value={newPassword}
              placeholder="••••••"
              placeholderTextColor="#BFBFBF"
              onChangeText={(text) => {
                setNewPassword(text);
                setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              secureTextEntry={!showNewPassword}
              onFocus={() => setFocusedField("newPassword")}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={s(20)}
                color="#BFBFBF"
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
                focusedField === "confirmPassword" && styles.inputFocused,
              ]}
              value={confirmPassword}
              placeholder="••••••"
              placeholderTextColor="#BFBFBF"
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={s(20)}
                color="#BFBFBF"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Save Button */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            { transform: [{ translateY: buttonOffset }] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!newPassword || !confirmPassword) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!newPassword || !confirmPassword}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: s(24),
    paddingTop: Platform.OS === "android" ? vs(55) : vs(60),
  },
  buttonWrapper: {
    paddingHorizontal: s(24),
    marginBottom: mvs(55),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(45),
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
    fontFamily: "InterExtraBold",
    fontSize: ms(20),
    fontWeight: "700",
    color: "#69417E",
    flex: 1,
    textAlign: "center",
    marginRight: s(44),
  },
  label: {
    fontFamily: "InterVariable",
    fontSize: ms(14),
    // fontWeight: "700",
    marginTop: vs(8),
    marginBottom: vs(4),
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(14),
    fontSize: ms(14),
    paddingRight: s(38),
  },
  inputError: {
    borderColor: "#ff4d4d",
  },
  inputFocused: {
    borderColor: "#6F3F89",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: ms(12),
    marginTop: vs(4),
    marginBottom: vs(6),
  },
  icon: {
    position: "absolute",
    right: s(12),
    top: "50%",
    transform: [{ translateY: -s(10) }],
  },
  saveButton: {
    backgroundColor: "#6F3F89",
    borderRadius: s(25),
    paddingVertical: vs(14),
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    fontFamily: "InterVariable",
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "700",
  },
});
