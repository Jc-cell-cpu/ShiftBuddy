import Arrowii from "@/assets/arrowii.svg";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BUTTON_WIDTH = SCREEN_WIDTH - 40;
const SLIDER_SIZE = 50;
const THRESHOLD = BUTTON_WIDTH - SLIDER_SIZE - 2;

interface Props {
  onComplete: () => void;
  label: string;
}

export default function SlideToConfirmButton({ onComplete, label }: Props) {
  const translateX = useSharedValue(0);
  const labelOpacity = useSharedValue(1);
  const labelScale = useSharedValue(1);
  const sliderRotate = useSharedValue(0);
  const backgroundColorValue = useSharedValue(0);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const startColor = hexToRgb("#6F3F89");
  const endColor = hexToRgb("#4A2A66");

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newTranslateX = Math.max(
        0,
        Math.min(ctx.startX + event.translationX, BUTTON_WIDTH - SLIDER_SIZE)
      );
      translateX.value = newTranslateX;

      labelOpacity.value = withTiming(1 - newTranslateX / THRESHOLD, {
        duration: 200,
        easing: Easing.linear,
      });
      labelScale.value = withTiming(1 - 0.3 * (newTranslateX / THRESHOLD), {
        duration: 200,
        easing: Easing.linear,
      });

      sliderRotate.value = withTiming((newTranslateX / THRESHOLD) * 360, {
        duration: 200,
        easing: Easing.linear,
      });

      backgroundColorValue.value = newTranslateX / THRESHOLD;
    },
    onEnd: () => {
      if (translateX.value >= THRESHOLD) {
        runOnJS(onComplete)();
        translateX.value = withSpring(0, { stiffness: 100, damping: 10 });
        labelOpacity.value = withTiming(1, { duration: 300 });
        labelScale.value = withTiming(1, { duration: 300 });
        sliderRotate.value = withTiming(0, { duration: 300 });
        backgroundColorValue.value = withTiming(0, { duration: 300 });
      } else {
        translateX.value = withSpring(0, { stiffness: 100, damping: 10 });
        labelOpacity.value = withTiming(1, { duration: 300 });
        labelScale.value = withTiming(1, { duration: 300 });
        sliderRotate.value = withTiming(0, { duration: 300 });
        backgroundColorValue.value = withTiming(0, { duration: 300 });
      }
    },
  });

  const animatedSliderStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${sliderRotate.value}deg` },
    ],
  }));

  const animatedLabelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ scale: labelScale.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    const fraction = backgroundColorValue.value;
    const r = Math.round(startColor.r + fraction * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + fraction * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + fraction * (endColor.b - startColor.b));
    return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.Text style={[styles.label, animatedLabelStyle]}>
        {label}
      </Animated.Text>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.slider, animatedSliderStyle]}>
          <Arrowii width={24} height={24} />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SLIDER_SIZE + 12,
    width: BUTTON_WIDTH,
    borderRadius: SLIDER_SIZE,
    justifyContent: "center",
    paddingHorizontal: 6,
    overflow: "hidden",
    marginTop: 20,
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  slider: {
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
    borderRadius: SLIDER_SIZE / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
