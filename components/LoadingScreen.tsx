// components/LoadingScreen.tsx

import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

const { width } = Dimensions.get("window");

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface LoadingScreenProps {
  size?: Size;
  style?: ViewStyle;
}

const sizeMap: Record<Size, number> = {
  xs: 0.2,
  sm: 0.3,
  md: 0.5,
  lg: 0.7,
  xl: 0.9,
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = "md",
  style,
}) => {
  const scale = sizeMap[size];
  const animationSize = width * scale;

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={require("@/assets/LoadingT.json")} // Adjust path
        autoPlay
        loop
        style={{ width: animationSize, height: animationSize }}
      />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
