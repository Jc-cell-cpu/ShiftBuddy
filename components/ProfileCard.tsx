import { ms, s, vs } from "@/utils/scale";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface BookingDetailsCardProps {
  name: string;
  gender: string;
  age: string;
  date: string; // Format: "YYYY-MM-DD"
  time: string;
  avatarUrl: string;
  onOpenPress?: () => void;
  showOpenSection?: boolean;
}

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({
  name,
  gender,
  age,
  date,
  time,
  avatarUrl,
  onOpenPress,
  showOpenSection,
}) => {
  return (
    <View style={styles.bookingCard}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          {gender} | {age} Years
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.metaWithIcon}>
            {date.split("-").reverse().join("/")}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.metaWithIcon}>{time}</Text>
        </View>
        <TouchableOpacity style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#69417E" />
          <Text style={styles.locationLink}>See Location</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={18} color="#69417E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={18} color="#69417E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              showOpenSection && { backgroundColor: "#F2C7AC" }, // ✅ conditional style
            ]}
            onPress={onOpenPress}
          >
            <Ionicons name="open-outline" size={18} color="#69417E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "rgba(241, 230, 255, 0.2)",
    borderRadius: ms(16),
    padding: ms(12),
    marginBottom: vs(16),
    marginTop: vs(5),
    marginHorizontal: s(15),
    alignItems: "center",
    gap: ms(12),
    elevation: 0,
    shadowColor: "transparent",
    borderWidth: 0,
    borderColor: "rgba(209, 208, 207, 0.9)",
  },
  avatarContainer: {
    width: s(132),
    height: vs(151),
    borderRadius: ms(10),
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  bookingDetails: {
    flex: 1,
    paddingTop: vs(2),
  },
  name: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#111827",
  },
  meta: {
    fontFamily: "InterRegular",
    fontSize: ms(13),
    color: "#6B7280",
    marginBottom: vs(8),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(6),
    gap: ms(6),
  },
  metaWithIcon: {
    fontFamily: "InterRegular",
    fontSize: ms(13),
    color: "#6B7280",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(12),
    gap: ms(6),
  },
  locationLink: {
    fontFamily: "InterMedium",
    fontSize: ms(13),
    color: "#69417E",
  },
  actions: {
    flexDirection: "row",
    gap: ms(16),
    marginTop: vs(4),
  },
  actionButton: {
    padding: ms(8),
    borderRadius: ms(20),
    backgroundColor: "rgba(105, 65, 126, 0.1)",
  },
});

export default BookingDetailsCard;
