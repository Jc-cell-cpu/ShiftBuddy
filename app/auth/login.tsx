import LogoC from "@/assets/LogoC.svg";
import SlideToConfirmButton from "@/components/SliderButton";
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  function handleLogin() {
    const newErrors = { email: "", password: "" };

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (!hasError) {
      router.push("/home");
    }
  }

  return (
    <View style={styles.container}>
      {/* Set the StatusBar properties */}
      <StatusBar
        backgroundColor="#fff" // Match the background color of the screen
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"} // Dark icons for better visibility
      />
      <View style={styles.logoContainer}>
        <LogoC width={100} height={50} />
      </View>

      <Text style={styles.title}>Welcome to ShiftBuddy!</Text>
      <Text style={styles.subtitle}>
        Secure login with username and password
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        value={email}
        placeholder="melpeters@gmail.com"
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={password}
          placeholder="••••••"
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#BFBFBF"
          />
        </TouchableOpacity>
      </View>
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <TouchableOpacity onPress={() => router.push("/auth/otpverification")}>
        <Text style={styles.forgotText}>Forget password?</Text>
      </TouchableOpacity>

      <View style={styles.loginButton}>
        <SlideToConfirmButton label="Login" onComplete={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: 100,
  },
  title: {
    fontFamily: "InterVariable",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "InterVariable",
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontFamily: "InterVariable",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
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
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
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
  forgotText: {
    color: "#007aff",
    textAlign: "left",
    marginTop: 20,
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 90,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});
