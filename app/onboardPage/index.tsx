import Arrowii from "@/assets/arrowii.svg";
import Femaled from "@/assets/femaled.svg";
import LOGOW from "@/assets/LOGOW.svg";
import BackgroundSVG from "@/components/BackgroundSVG";
import { useRouter } from "expo-router";

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Get screen dimensions
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const router = useRouter();

// Reference design dimensions
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

const widthScale = deviceWidth / DESIGN_WIDTH;
const heightScale = deviceHeight / DESIGN_HEIGHT;
const scaleWidth = (size: number) => size * widthScale;
const scaleHeight = (size: number) => size * heightScale;
const scaleFont = (size: number) => size * Math.min(widthScale, heightScale);

export default function OnboardPage() {
  return (
    <View style={styles.container}>
      {/* Background */}
      <BackgroundSVG width={deviceWidth} height={900} />

      {/* Logo top-left */}
      <View style={styles.logoContainer}>
        <LOGOW width={scaleWidth(104)} height={scaleHeight(82)} />
      </View>

      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.headingBold}>PLAN,</Text>
        <Text style={styles.headingBold}>Manage &</Text>
        <Text style={styles.headingBold}>TRACK TASK</Text>
      </View>

      {/* Line above description */}
      <View style={styles.lineAbove} />

      {/* Description */}
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eiusmod
        tempor incididunt ut labore et dolore.
      </Text>

      {/* Line below description */}
      <View style={styles.lineBelow} />

      {/* Dot Indicator */}
      <View style={styles.dots}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Doctor image */}
      <View style={styles.imageContainer}>
        <Femaled width={scaleWidth(360)} height={scaleHeight(580)} />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => router.push("/auth/login")}
      >
        <Arrowii width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    top: scaleHeight(60),
    left: (deviceWidth - scaleWidth(94)) / 2, // centers logo horizontally
  },
  headingContainer: {
    position: "absolute",
    top: scaleHeight(160),
    left: scaleWidth(20),
  },
  headingBold: {
    fontFamily: "InterVariable",
    fontSize: scaleFont(29),
    fontWeight: "700",
    color: "#ffffff",
  },
  headingNormal: {
    fontSize: scaleFont(28),
    fontWeight: "400",
    color: "#ffffff",
  },
  description: {
    fontFamily: "InterVariable",
    position: "absolute",
    top: scaleHeight(300),
    left: scaleWidth(20),
    width: scaleWidth(330),
    fontSize: scaleFont(16),
    fontWeight: "400",
    color: "#BFBFBF",
    lineHeight: scaleFont(22),
  },
  lineAbove: {
    position: "absolute",
    top: scaleHeight(290), // Adjust this value to position the line above the description
    left: scaleWidth(20),
    width: scaleWidth(230), // to increase the line
    height: 0.7, // Thin line
    borderTopWidth: 0.7,
    borderColor: "#A8DCAB", // Match the description color or adjust as needed
  },
  lineBelow: {
    position: "absolute",
    top: scaleHeight(377), // Adjust this value to position the line below the description
    left: scaleWidth(20),
    width: scaleWidth(230), // Match the width of the description
    height: 0.7, // Thin line
    borderTopWidth: 0.7,
    borderColor: "#A8DCAB", // Match the description color or adjust as needed
  },
  dots: {
    flexDirection: "row",
    position: "absolute",
    top: scaleHeight(399),
    left: scaleWidth(20),
    gap: scaleWidth(6),
  },
  dot: {
    width: scaleWidth(20),
    height: scaleWidth(5),
    borderRadius: 2,
    backgroundColor: "#ffffff30",
  },
  activeDot: {
    backgroundColor: "#F5F5DC",
  },
  imageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  roundButton: {
    position: "absolute",
    bottom: scaleHeight(40),
    right: scaleWidth(20),
    width: scaleWidth(55),
    height: scaleWidth(55),
    borderRadius: scaleWidth(52.5),
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    // Additions
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
});
