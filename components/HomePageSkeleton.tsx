/* eslint-disable @typescript-eslint/no-unused-vars */
import { ms, s, vs } from "@/utils/scale";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

interface ICustomViewStyle {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  padding?: number;
  flex?: number;
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  children?: ICustomViewStyle[];
}

const HomePageSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Skeleton
        containerStyle={{ flex: 1 }}
        isLoading={true}
        boneColor="#E1D9E8"
        highlightColor="#F3EDF7"
        animationType="shiver" // Use 'shiver' for a gradient animation
        animationDirection="horizontalLeft"
        layout={[
          // Header
          { width: 180, height: 24, marginBottom: vs(8) },
          { width: 220, height: 16, marginBottom: vs(24) },

          // Header Icons
          {
            flexDirection: "row" as const,
            justifyContent: "flex-end",
            marginBottom: vs(24),
            children: [
              { width: 40, height: 40, borderRadius: 20 },
              { width: 40, height: 40, borderRadius: 20, marginLeft: 16 },
            ],
          },

          // Odometer Card
          {
            width: "100%",
            padding: s(16),
            borderRadius: ms(20),
            marginBottom: vs(24),
            children: [
              { width: 160, height: 20 },
              { width: 260, height: 14, marginTop: 10 },
              { width: 220, height: 14, marginTop: 6 },
              { width: "100%", height: 50, marginTop: 12 },
            ],
          },

          // Attendance Card
          {
            width: "100%",
            padding: s(16),
            borderRadius: ms(20),
            marginBottom: vs(24),
            children: [
              { width: 200, height: 20 },
              { width: 280, height: 14, marginTop: 10 },
              { width: 120, height: 36, marginTop: 16 },
            ],
          },

          // Booking Header
          {
            flexDirection: "row" as const,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: vs(16),
            children: [
              { width: 120, height: 20 },
              { width: 40, height: 40, borderRadius: 20 },
            ],
          },

          // Booking Cards
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F5FC",
    padding: s(16),
    paddingTop: vs(32),
  },
});

export default HomePageSkeleton;
