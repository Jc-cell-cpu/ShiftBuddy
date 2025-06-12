import LOGOW from "@/assets/LOGOW.svg";
import BackgroundSVG from "@/components/BackgroundSVG"; // Import the reusable component
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");
// console.log("height :", height);
const heightC = 1000;
const widthC = 1000;

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // console.log("Starting splash screen initialization");
    const init = async () => {
      try {
        // console.log("Hiding native splash screen");
        await SplashScreen.hideAsync();

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start();

        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Navigating to /home");
        router.replace("/onboardPage" as any);
      } catch (e) {
        console.warn("Error during initialization:", e);
      }
    };
    init();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      {/* Reusable SVG Background */}
      <BackgroundSVG width={widthC} height={heightC} />

      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LOGOW width={155.7} height={69} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute", // Ensure logo stays centered on top of SVG
  },
  debugText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 10,
  },
});
