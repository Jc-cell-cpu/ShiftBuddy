import LogoC from "@/assets/LogoC.svg";
import BackgroundSVGWhite from "@/components/BackgroundSVGWhite";
import SlideToConfirmButton from "@/components/SliderButton";
import { ms, s, vs } from "@/utils/scale";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
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
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null
  );

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
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <BackgroundSVGWhite />
      </View>

      {/* Foreground content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LogoC width={100} height={50} />
        </View>

        <Text style={styles.title}>Welcome to ShiftBuddy!</Text>
        <Text style={styles.subtitle}>
          Secure login with username and password
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            errors.email && styles.inputError,
            focusedField === "email" && styles.inputFocused,
          ]}
          value={email}
          placeholder="melpeters@gmail.com"
          placeholderTextColor="#BFBFBF" // Set placeholder color
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              errors.password && styles.inputError,
              focusedField === "password" && styles.inputFocused,
            ]}
            value={password}
            placeholder="••••••"
            placeholderTextColor="#BFBFBF" // Set placeholder color
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            secureTextEntry={!showPassword}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: vs(40),
  },
  logoContainer: {
    alignItems: "center",
    marginTop: vs(-10),
    marginBottom: vs(80),
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
    backgroundColor: "#fff",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
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
    marginBottom: vs(4),
  },
  forgotWrapper: {
    alignSelf: "flex-start",
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
    marginTop: vs(60),
  },
  icon: {
    position: "absolute",
    right: s(12),
    top: "50%",
    transform: [{ translateY: -ms(10) }],
  },
});
