/* eslint-disable react-hooks/exhaustive-deps */

import LoadingScreen from "@/components/LoadingScreen";
import { ms, s, vs } from "@/utils/scale";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

const { height } = Dimensions.get("window");

const HomePageSkeleton = () => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Skeleton Content */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Skeleton
          containerStyle={{ flex: 1 }}
          isLoading={true}
          boneColor="#E1D9E8"
          highlightColor="#F3EDF7"
          animationType="shiver"
          animationDirection="horizontalLeft"
          layout={[
            {
              flexDirection: "row" as const,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: vs(24),
              children: [
                {
                  children: [
                    { width: 180, height: 24, marginBottom: vs(4) },
                    { width: 220, height: 16 },
                  ],
                },
                {
                  flexDirection: "row" as const,
                  gap: 16,
                  children: [
                    { width: 40, height: 40, borderRadius: 20 },
                    { width: 40, height: 40, borderRadius: 20 },
                  ],
                },
              ],
            },
            {
              width: "100%",
              padding: s(16),
              borderRadius: ms(30),
              marginBottom: vs(24),
              children: [
                { width: 200, height: 20, marginBottom: vs(10) },
                {
                  flexDirection: "row" as const,
                  children: [
                    {
                      flex: 1,
                      children: [
                        { width: "90%", height: 14, marginBottom: vs(8) },
                        { width: 100, height: 36 },
                      ],
                    },
                    {
                      width: 92,
                      height: 102,
                      borderRadius: 16,
                      marginLeft: s(16),
                    },
                  ],
                },
              ],
            },
            {
              flexDirection: "row" as const,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: vs(16),
              children: [
                { width: 120, height: 20 },
                { width: 24, height: 24 },
              ],
            },
            {
              width: "100%",
              height: 100,
              marginBottom: vs(16),
              borderRadius: 10,
            },
            ...[1, 2].map(() => ({
              flexDirection: "row" as const,
              padding: s(12),
              borderRadius: ms(16),
              marginBottom: vs(16),
              children: [
                { width: 132, height: 151, borderRadius: 10 },
                {
                  flex: 1,
                  marginLeft: 12,
                  children: [
                    { width: 140, height: 16 },
                    { width: 120, height: 12, marginTop: 6 },
                    { width: 100, height: 12, marginTop: 10 },
                    { width: 140, height: 12, marginTop: 6 },
                    { width: 80, height: 12, marginTop: 12 },
                    {
                      flexDirection: "row" as const,
                      marginTop: vs(12),
                      children: [
                        { width: 32, height: 32, borderRadius: 16 },
                        {
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          marginLeft: 16,
                        },
                        {
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          marginLeft: 16,
                        },
                      ],
                    },
                  ],
                },
              ],
            })),
          ]}
        />
      </ScrollView>

      {/* Floating Loader and Message */}
      <View style={styles.loaderOverlay}>
        <LoadingScreen size="sm" />
        <Animated.Text style={[styles.messageText, { opacity: opacityAnim }]}>
          Preparing your dashboard...
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9F5FC",
  },
  container: {
    padding: s(16),
    paddingTop: vs(32),
    paddingBottom: vs(100),
  },
  loaderOverlay: {
    position: "absolute",
    top: height / 2.6, // adjust for best vertical centering
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  messageText: {
    fontSize: ms(16),
    color: "#69417E",
    fontWeight: "600",
    marginBottom: vs(12),
  },
});

export default HomePageSkeleton;
