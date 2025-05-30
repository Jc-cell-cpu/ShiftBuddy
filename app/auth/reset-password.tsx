// app/auth/reset-password.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Handle Save
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
      // In a real app, you'd make an API call to update the password here
      router.push("/auth/login"); // Navigate back to login screen after success
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
        <Text style={styles.title}>Reset Password</Text>
      </View>

      {/* <Text style={styles.subtitle}>Create a new password</Text> */}

      {/* New Password Input */}
      <Text style={styles.label}>New Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.newPassword && styles.inputError]}
          value={newPassword}
          placeholder="••••••"
          onChangeText={(text) => {
            setNewPassword(text);
            setErrors((prev) => ({ ...prev, newPassword: "" }));
          }}
          secureTextEntry={!showNewPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Ionicons
            name={showNewPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#BFBFBF"
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword ? (
        <Text style={styles.errorText}>{errors.newPassword}</Text>
      ) : null}

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          value={confirmPassword}
          placeholder="••••••"
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#BFBFBF"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      ) : null}

      {/* Save Button */}
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
    </View>
  );
};

export default ResetPassword;

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
  label: {
    fontFamily: "InterVariable",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 18,
    fontSize: 14,
    paddingRight: 38,
  },
  inputError: {
    borderColor: "#ff4d4d",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  saveButton: {
    backgroundColor: "#6F3F89",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 100,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    fontFamily: "InterVariable",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
