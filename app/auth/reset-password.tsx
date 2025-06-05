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
import { ms, mvs, s, vs } from "react-native-size-matters";
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
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />

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
            size={s(20)}
            color="#BFBFBF"
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword && (
        <Text style={styles.errorText}>{errors.newPassword}</Text>
      )}

      {/* Confirm Password */}
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
            size={s(20)}
            color="#BFBFBF"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

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
    paddingHorizontal: s(24),
    paddingTop: Platform.OS === "android" ? vs(40) : vs(60),
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
    backgroundColor: "#f0f0f0",
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
    fontWeight: "700",
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
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(14),
    fontSize: ms(14),
    paddingRight: s(38),
  },
  inputError: {
    borderColor: "#ff4d4d",
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
    marginTop: mvs(80),
    marginBottom: mvs(20),
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
