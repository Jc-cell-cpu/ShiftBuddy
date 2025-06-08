import { Dimensions, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const heightC = 1000; // Adjusted height for the background

export default function SoftGradientBackground() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content" // or "light-content" based on your gradient
      />
      <Svg width={width} height={heightC}>
        <Defs>
          <RadialGradient
            id="softGradient"
            cx="50%"
            cy="0%"
            rx="100%"
            ry="100%"
            fx="50%"
            fy="0%"
          >
            <Stop offset="0%" stopColor="#EFDBF4" stopOpacity="0.7" />
            <Stop offset="40%" stopColor="#E0E9F7" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="2" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#softGradient)" />
      </Svg>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
