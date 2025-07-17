// app/rawPages/EditProfileScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import { ms, s, vs } from "react-native-size-matters";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import StarW from "@/assets/StarW.svg";

const EditProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState("Kriti Saren");
    const [email, setEmail] = useState("yessieklein@gmail.com");
    const [phone, setPhone] = useState("0987861267");
    const [gender, setGender] = useState("Female");
    const [age, setAge] = useState("28");

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar barStyle="dark-content" backgroundColor="rgba(224,233,247, 0.4)" />

            {/* Top Gradient Background */}
            <LinearGradient
                colors={["rgba(224,233,247, 0.3)", "rgba(239,219,244, 0.5)"]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.gradient}
            >
                {/* Header and Card */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
                    editable={false}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

                <View style={styles.row}>
                    <View style={styles.half}>
                        <Text style={styles.label}>Gender</Text>
                        <TextInput style={styles.input} value={gender} onChangeText={setGender} />
                    </View>
                    <View style={styles.half}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput style={styles.input} value={age} onChangeText={setAge} />
                    </View>
                </View>
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
    container: { flex: 1, backgroundColor: "rgba(255, 255, 255, 1)" },
    gradient: {
        borderBottomLeftRadius: ms(40),
        borderBottomRightRadius: ms(40),
        paddingBottom: vs(150),
        paddingHorizontal: s(2),
    },
    starWrapper: {
        position: "absolute",
        top: vs(30), // push it below header
        right: s(10), // move it to the right like the design
        zIndex: -1, // keep it behind the card, not behind the header
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
        backgroundColor: "rgba(243, 243, 243, 1)",
        borderColor: "#ccc",
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
        marginTop: vs(56),
        borderRadius: ms(16),
        padding: s(29),
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 8,
    },
    avatar: {
        width: ms(80),
        height: ms(80),
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
        marginTop: vs(24),
        borderRadius: 99,
        alignItems: "center",
    },
    saveText: {
        color: "#fff",
        fontSize: ms(16),
        fontWeight: "600",
    },
});
