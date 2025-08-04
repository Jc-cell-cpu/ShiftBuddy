import StarW from "@/assets/StarW.svg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ms, s, vs } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const EditProfileScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Kriti Saren");
  const [email, setEmail] = useState("yessieklein@gmail.com");
  const [phone, setPhone] = useState("0987861267");
  const [gender, setGender] = useState("Female");
  const [age, setAge] = useState("28");
  const [isFocus, setIsFocus] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgba(224,233,247, 0.4)"
      />

      <LinearGradient
        colors={["rgba(224,233,247, 0.3)", "rgba(239,219,244, 0.5)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.starWrapper}>
          <StarW width={128} height={128} />
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.dropdownContainer}>
                <Dropdown
                  style={[styles.input, isFocus && { borderColor: "#69417E" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={genderOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Gender"
                  value={gender}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setGender(item.value);
                    setIsFocus(false);
                  }}
                  mode="default"
                  dropdownPosition="auto"
                  renderItem={(item) => {
                    // Safeguard against undefined item
                    if (!item || !item.label) {
                      console.warn(
                        "Dropdown renderItem received invalid item:",
                        item
                      );
                      return null;
                    }
                    return (
                      <View style={styles.dropdownItem}>
                        <Text style={styles.itemTextStyle}>{item.label}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>
          <View style={styles.bottomAccent} />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    borderBottomLeftRadius: ms(40),
    borderBottomRightRadius: ms(40),
    paddingBottom: vs(150),
    paddingHorizontal: s(2),
  },
  starWrapper: {
    position: "absolute",
    top: vs(30),
    right: s(10),
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    gap: s(61),
    marginTop: vs(3),
  },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(22),
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(20),
  },
  headerTitle: {
    fontFamily: "InterSemiBold",
    fontSize: ms(18),
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: s(10),
    marginTop: vs(36),
    borderRadius: ms(16),
    padding: s(29),
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    overflow: "visible",
    position: "relative",
  },
  bottomAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(6),
    backgroundColor: "#FFD347",
    borderBottomLeftRadius: ms(16),
    borderBottomRightRadius: ms(16),
  },
  avatar: {
    width: ms(100),
    height: ms(100),
    borderRadius: 99,
    alignSelf: "center",
    marginBottom: vs(20),
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  label: {
    fontSize: ms(13),
    fontWeight: "500",
    color: "#333",
    marginBottom: vs(4),
    marginTop: vs(10),
  },
  input: {
    backgroundColor: "#FAFAFA",
    borderRadius: ms(10),
    paddingHorizontal: s(11),
    paddingVertical: vs(13),
    fontSize: ms(13),
    borderColor: "#ddd",
    borderWidth: 1,
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#999",
    borderColor: "#E0E0E0",
  },
  placeholderStyle: {
    fontSize: ms(13),
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: ms(13),
    color: "#333",
  },
  itemTextStyle: {
    fontSize: ms(13),
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    flex: 0.48,
  },
  saveButton: {
    backgroundColor: "#69417E",
    paddingVertical: vs(14),
    marginHorizontal: s(16),
    marginTop: vs(44),
    borderRadius: 99,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "600",
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: s(11),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  dropdownList: {
    position: "absolute",
    top: vs(50),
    left: 0,
    right: 0,
    backgroundColor: "#FAFAFA",
    borderRadius: ms(10),
    borderColor: "#ddd",
    borderWidth: 1,
    maxHeight: vs(150),
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1001,
  },
});
