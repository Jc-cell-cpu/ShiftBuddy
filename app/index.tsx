import LOGOW from "@/assets/LOGOW.svg";
import BackgroundSVG from "@/components/BackgroundSVG";
import HomePageSkeleton from "@/components/HomeSkeletonWL";
import { getValidAccessToken, isRefreshing } from "@/utils/token";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const heightC = 1000;
const widthC = 1000;

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [showSplash, setShowSplash] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Animate logo
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

        // Wait for splash animation to finish
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // After the animation, decide the next step
        const token = await getValidAccessToken();
        const refreshing = isRefreshing();

        if (refreshing) {
          await SplashScreen.hideAsync(); // Hide the native splash screen
          setShowSplash(false); // Hide the custom splash animation
          setShowSkeleton(true); // Show the skeleton loading screen
        } else {
          await SplashScreen.hideAsync(); // Hide the native splash screen
          // Directly navigate and hide the custom splash
          if (token) {
            router.replace("/home/homePage");
          } else {
            router.replace("/onboardPage");
          }
          setShowSplash(false); // This will cause a re-render and fall through to the final return
        }
      } catch (e) {
        console.warn("Splash error:", e);
        await SplashScreen.hideAsync(); // Ensure native splash is hidden on error
        router.replace("/onboardPage"); // Navigate to onboard page on error
        setShowSplash(false); // Hide custom splash
      }
    };

    init();
  }, [fadeAnim, scaleAnim]);

  if (showSplash) {
    return (
        <View style={styles.container}>
          <BackgroundSVG width={widthC} height={heightC} />
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

  if (showSkeleton) {
    return <HomePageSkeleton />;
  }

  // If showSplash is false and showSkeleton is false, it means we are in the
  // brief period before navigation completes. Instead of returning null,
  // return a simple View with the container style to prevent a white screen.
  // The background color of styles.container is #F9F5FC.
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5FC", // Ensure this matches your desired background color
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});