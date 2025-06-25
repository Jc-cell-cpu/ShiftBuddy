import { ms, s, vs } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={s(24)} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Search</Text>
        <View style={{ width: s(24) }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={s(18)}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#6B7280"
          style={styles.searchInput}
        />
      </View>

      {/* Recent Search Label */}
      <View style={styles.rowBetween}>
        <Text style={styles.recentText}>Recent search</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.bookingCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://media.istockphoto.com/id/1468678624/photo/nurse-hospital-employee-and-portrait-of-black-man-in-a-healthcare-wellness-and-clinic-feeling.jpg?s=2048x2048&w=is&k=20&c=Ha1Z7BjLTrp-wrn131BNHW8T-WMqViY3NrRuXyZtEfk=",
            }}
            style={styles.avatarImage}
          />
        </View>

        <View style={styles.bookingDetails}>
          <Text style={styles.name}>Emily Harrington</Text>
          <Text style={styles.meta}>Female | 28 Years</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={s(14)} color="#6B7280" />
            <Text style={styles.metaWithIcon}>28/07/2025</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={s(14)} color="#6B7280" />
            <Text style={styles.metaWithIcon}>8:30 AM - 9:30 AM</Text>
          </View>
          <TouchableOpacity style={styles.locationRow}>
            <Ionicons name="location-outline" size={s(14)} color="#69417E" />
            <Text style={styles.locationLink}>See Location</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call-outline" size={s(18)} color="#69417E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="mail-outline" size={s(18)} color="#69417E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="open-outline" size={s(18)} color="#69417E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    paddingTop: vs(35),
    paddingHorizontal: s(15),
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    gap: s(84),
    marginBottom: vs(15),
  },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(22),
    backgroundColor: "#fafcff",
    borderColor: "#ccc",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },
  headerText: {
    fontSize: ms(20),
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: ms(16),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginBottom: vs(15),
  },
  searchIcon: {
    marginRight: s(10),
  },
  searchInput: {
    flex: 1,
    fontSize: ms(15),
    color: "#111827",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(10),
  },
  recentText: {
    fontSize: ms(16),
    fontWeight: "600",
  },
  clearText: {
    fontSize: ms(14),
    color: "gray",
  },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#FDF6F9",
    borderRadius: ms(16),
    padding: ms(14),
    marginBottom: vs(16),
    marginTop: vs(5),
    alignItems: "center",
    gap: ms(12),
    elevation: 0,
    shadowColor: "transparent",
    alignSelf: "stretch",
  },
  avatarContainer: {
    width: s(130),
    height: vs(125),
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
