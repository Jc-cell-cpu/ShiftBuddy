import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterVariable: require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    InterSemiBold: require("@/assets/fonts/Inter_18pt-SemiBold.ttf"),
    InterMedium: require("@/assets/fonts/Inter_18pt-Medium.ttf"),
    InterExtraBold: require("@/assets/fonts/Inter_18pt-ExtraBold.ttf"),
    InterBold: require("@/assets/fonts/Inter_18pt-Bold.ttf"),
    Inter18Regular: require("@/assets/fonts/Inter_18pt-Regular.ttf"),
    Inter24Regular: require("@/assets/fonts/Inter_24pt-Regular.ttf"),
    Inter18SemiBold: require("@/assets/fonts/Inter_18pt-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <Stack
          initialRouteName="index"
          screenOptions={{ headerShown: false }}
        />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
