import Car from "@/assets/Car.svg";
import Calendar from "@/assets/CIcons/calendar.svg";
import Checked from "@/assets/CIcons/checked.svg";
import Insurance from "@/assets/CIcons/Insurance.svg";
import Spring from "@/assets/CIcons/Spring.svg";
import Support from "@/assets/CIcons/Support.svg";
import ChangeVehicleModal from "@/components/ChangeVehicleModal";
import { deleteTokens } from "@/utils/authUtils";
import { BlurView } from "@react-native-community/blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, s, vs } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";

const mockProfile = {
  name: "Kriti Saren",
  age: 28,
  gender: "F",
  email: "yessieklein@gmail.com",
  memberId: "1239475605",
  totalShifts: 1054,
  leaves: 7,
  status: "Available",
  empType: "Full Time",
  vehicle: {
    name: "Nexon, SUV",
    model: "BKQLA921000",
    licenseNo: "IKQLA-921000",
    expiry: "23.08.2028",
  },
  documents: {
    taxFile: "0903-9383-0903",
    abn: "IKQLA-921000",
    screeningCheck: true,
    childCheck: true,
    policeCheck: true,
    firstAid: true,
  },
};

const ProfileScreen = () => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [statusOptions] = useState(["Available", "Busy", "Offline"]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [empTypeOptions] = useState([
    "Full Time",
    "Part Time",
    "Sub Contractor",
    "Casual",
  ]);

  const moreOptions = [
    { label: "Bookings", Icon: Calendar, route: "/rawPages/test" },
    { label: "Leaves", Icon: Spring, route: "/rawPages/LeaveScreen" },
    { label: "Help & Support", Icon: Support, route: "/rawPages/homePage" },
    { label: "Privacy Policy", Icon: Insurance, route: "/rawPages/PrivacyPolicy" },
    { label: "FAQ", Icon: Insurance, route: "/rawPages/homePage" },
    {
      label: "Terms & Conditions",
      Icon: Checked,
      route: "/rawPages/TermsAndCondition",
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState(mockProfile.status);
  const [selectedEmpType, setSelectedEmpType] = useState(mockProfile.empType);

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEmpTypeDropdown, setShowEmpTypeDropdown] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/home/homePage")}
          >
            <Ionicons name="arrow-back" size={s(24)} />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          {/* <TouchableOpacity
            onPress={async () => {
              await deleteTokens();
              router.replace("/auth/login"); // or router.push if you want back stack
            }}
          >
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => setLogoutVisible(true)}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: s(12) }}>
            <Text
              style={styles.name}
            >{`${mockProfile.name} | ${mockProfile.gender},${mockProfile.age}`}</Text>
            <Text style={styles.email}>{mockProfile.email}</Text>
            <Text
              style={styles.memberId}
            >{`Member No. ${mockProfile.memberId}`}</Text>
            <TouchableOpacity>
              <Text style={styles.edit}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.cardRow}>
          <View style={styles.overviewContainer}>
            {/* Total Shift */}
            <View style={styles.overviewItem}>
              <Text style={styles.infoLabel}>Total Shift</Text>
              <Text style={styles.infoValue}>{mockProfile.totalShifts}</Text>
            </View>

            {/* Leaves */}
            <View style={styles.overviewItem}>
              <Text style={styles.infoLabel}>Leaves</Text>
              <Text style={styles.infoValue}>{mockProfile.leaves}</Text>
            </View>

            {/* Status with dropdown */}
            <View style={[styles.overviewItem, { position: "relative" }]}>
              <Text style={styles.infoLabel}>Status</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text style={styles.infoValue}>{selectedStatus}</Text>
                <Ionicons
                  name="caret-down-outline"
                  size={ms(11)}
                  color="#555"
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
              {showStatusDropdown && (
                <View style={styles.dropdownBox}>
                  {statusOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        setSelectedStatus(opt);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItem}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Emp. Type with dropdown */}
            <View style={[styles.overviewItem, { position: "relative" }]}>
              <Text style={styles.infoLabel}>Emp. Type</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowEmpTypeDropdown(!showEmpTypeDropdown)}
              >
                <Text style={styles.infoValue}>{selectedEmpType}</Text>
                <Ionicons
                  name="caret-down-outline"
                  size={ms(11)}
                  color="#555"
                  style={styles.dropdownIconII}
                />
              </TouchableOpacity>

              {showEmpTypeDropdown && (
                <View style={styles.dropdownBox}>
                  {empTypeOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        setSelectedEmpType(opt);
                        setShowEmpTypeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItem}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Vehicle Details */}
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.cardRowVehicle}>
          <View style={styles.vehicleRow}>
            <View>
              <Text style={styles.vehicleName}>{mockProfile.vehicle.name}</Text>
              <Text style={styles.vehicleInfo}>
                Model: {mockProfile.vehicle.model}
              </Text>
              <Text style={styles.vehicleInfo}>
                License No: {mockProfile.vehicle.licenseNo}
              </Text>
              <Text style={styles.vehicleInfo}>
                License expiry: {mockProfile.vehicle.expiry}
              </Text>
              <TouchableOpacity onPress={() => setShowVehicleModal(true)}>
                <Text style={styles.link}>Change Vehicle</Text>
              </TouchableOpacity>
            </View>
            {/* <Ionicons name="car-sport-outline" size={ms(64)} color="#FFA500" /> */}
            <Car width={100} height={50} />
          </View>
        </View>

        {/* Document Details */}
        <Text style={styles.sectionTitle}>Document Details</Text>
        <View style={styles.cardRowDocument}>
          <Text style={styles.document}>
            Tax File Number: {mockProfile.documents.taxFile}
          </Text>
          <Text style={styles.document}>
            ABN Number: {mockProfile.documents.abn}
          </Text>
          <Text style={styles.document}>Workers Screening Check: Yes</Text>
          <Text style={styles.document}>Working with Children Check: Yes</Text>
          <Text style={styles.document}>Police Check: Yes</Text>
          <Text style={styles.document}>First Aid: Yes</Text>
        </View>

        {/* More Section */}
        <Text style={[styles.sectionTitle, { marginHorizontal: s(16) }]}>
          More
        </Text>
        <View style={styles.moreGrid}>
          {moreOptions.map(({ label, Icon, route }, i) => (
            <TouchableOpacity
              key={i}
              style={styles.moreItem}
              onPress={() => router.push(route as any)}
            >
              <Icon width={ms(24)} height={ms(24)} />
              <Text style={styles.moreText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {logoutVisible && (
        <View style={styles.modalOverlay}>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={3}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#69417E" }]}
                onPress={async () => {
                  setLogoutVisible(false);
                  await deleteTokens();
                  router.replace("/auth/login");
                }}
              >
                <Text style={{ color: "#fff", fontFamily: "InterMedium" }}>
                  Logout
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: "#fff",
                    borderColor: "#69417E",
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={{ color: "#69417E", fontFamily: "InterMedium" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <ChangeVehicleModal
        visible={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSubmit={() => {
          setShowVehicleModal(false);
          // handle actual change action here
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // gap: s(12),
    padding: s(16),
  },
  title: { fontSize: ms(18), fontWeight: "700", color: "#000" },
  logout: { fontSize: ms(14), color: "#69417E" },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    paddingVertical: vs(16),
    backgroundColor: "#F4EDFB",
    borderRadius: ms(16),
    marginHorizontal: s(16),
    marginBottom: vs(16),
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
  avatar: { width: 64, height: 64, borderRadius: 32 },
  name: { fontSize: ms(16), fontWeight: "700", color: "#000" },
  email: { fontSize: ms(12), color: "#444", marginVertical: 2 },
  memberId: { fontSize: ms(12), color: "#888" },
  edit: { color: "#69417E", fontSize: ms(12), marginTop: 4 },
  cardRow: {
    backgroundColor: "#218CC012",
    marginHorizontal: s(16),
    marginBottom: vs(16),
    borderRadius: ms(16),
    padding: s(16),
  },
  cardRowVehicle: {
    backgroundColor: "#81B29C1A",
    marginHorizontal: s(16),
    marginBottom: vs(16),
    borderRadius: ms(16),
    padding: s(16),
  },
  cardRowDocument: {
    backgroundColor: "#E7E9F74D",
    marginHorizontal: s(16),
    marginBottom: vs(16),
    borderRadius: ms(16),
    padding: s(16),
  },

  overviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewItem: {
    alignItems: "center",
    flex: 1,
  },

  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
  },

  dropdownIcon: {
    marginTop: vs(5),
    marginRight: s(6),
    marginLeft: -s(3),
  },
  dropdownIconII: {
    marginTop: vs(5),
    marginLeft: -s(3),
  },
  dropdownItem: {
    fontSize: ms(12),
    color: "#444",
    paddingVertical: vs(2),
    textAlign: "center",
  },
  dropdownBox: {
    position: "absolute",
    top: vs(48), // Adjust if needed to position below the value
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: vs(4),
    borderRadius: ms(8),
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 10,
  },

  sectionTitle: {
    fontFamily: "InterMedium",
    fontSize: ms(14),
    marginBottom: vs(8),
    marginLeft: s(16),
    color: "#333",
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoRowLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  infoLabel: {
    fontFamily: "InterVariable",
    fontSize: ms(12),
    color: "#12121D",
  },
  infoValue: {
    fontSize: ms(14),
    fontFamily: "InterSemiBold",
    color: "#69417E",
    marginTop: 4,
  },

  vehicleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleName: {
    fontSize: ms(14),
    fontFamily: "InterSemiBold",
    marginBottom: 4,
    color: "#000",
  },
  vehicleInfo: {
    fontSize: ms(12),
    fontFamily: "InterVariable",
    marginBottom: 4,
    color: "#666",
  },
  link: {
    fontSize: ms(12),
    fontFamily: "InterVariable",
    color: "#69417E",
    marginTop: 4,
  },
  document: {
    fontSize: ms(12),
    fontFamily: "InterVariable",
    color: "#555",
    marginBottom: 5,
  },
  shiftList: { paddingHorizontal: s(16), marginBottom: vs(16) },
  shiftCard: {
    backgroundColor: "#F4EDFB",
    borderRadius: ms(16),
    padding: s(12),
    alignItems: "center",
    marginRight: s(12),
    width: 120,
  },
  moreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: s(16),
    rowGap: vs(16),
  },
  moreItem: {
    backgroundColor: "#F4EDFB",
    width: "30%",
    borderRadius: ms(12),
    padding: s(12),
    alignItems: "center",
  },
  moreText: {
    fontSize: ms(10),
    color: "#000",
    marginTop: 4,
    textAlign: "center",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: ms(12),
    padding: s(20),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: ms(16),
    fontWeight: "700",
    marginBottom: vs(8),
  },
  modalText: {
    fontSize: ms(13),
    textAlign: "center",
    marginBottom: vs(16),
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    gap: s(12),
  },
  modalButton: {
    flex: 1,
    paddingVertical: vs(10),
    borderRadius: ms(8),
    alignItems: "center",
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});

export default ProfileScreen;
