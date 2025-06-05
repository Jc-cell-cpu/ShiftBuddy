import LogoC from "@/assets/LogoC.svg";
import SlideToConfirmButton from "@/components/SliderButton";
import { ms, s, vs } from "@/utils/scale";
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
      router.push("/home/homePage");
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
            size={ms(20)}
            color="#BFBFBF"
          />
        </TouchableOpacity>
      </View>
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.forgotWrapper}
        onPress={() => router.push("/auth/otpverification")}
      >
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
    paddingHorizontal: s(24),
    paddingTop: vs(80),
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: vs(-50),
    marginBottom: vs(100),
  },
  title: {
    fontFamily: "InterVariable",
    fontSize: ms(20),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: vs(6),
  },
  subtitle: {
    fontFamily: "InterVariable",
    fontSize: ms(14),
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
    marginBottom: vs(24),
  },
  label: {
    fontFamily: "InterVariable",
    fontSize: ms(14),
    fontWeight: "700",
    marginTop: vs(12),
    marginBottom: vs(6),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(18),
    fontSize: ms(14),
    paddingRight: s(38),
    color: "#000",
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
    fontSize: ms(12),
    marginTop: vs(4),
    marginBottom: vs(4),
  },
  forgotWrapper: {
    alignSelf: "flex-start", // aligns to the right side
  },
  forgotText: {
    color: "#007aff",
    textAlign: "left",
    marginTop: vs(20),
    marginBottom: vs(24),
    fontSize: ms(13),
    paddingVertical: vs(4),
  },
  loginButton: {
    marginTop: vs(80),
  },
  icon: {
    position: "absolute",
    right: s(12),
    top: "50%",
    transform: [{ translateY: -ms(10) }],
  },
});
