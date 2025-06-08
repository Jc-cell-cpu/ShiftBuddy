import { ms, s, vs } from "@/utils/scale";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Notification = {
  id: number;
  type: "success" | "leave";
  title: string;
  message: string;
  time: string;
};

const Notifications = () => {
  const router = useRouter();

  const notifications: Notification[] = [
    {
      id: 1,
      type: "success",
      title: "Congratulations 🙌",
      message: "You have successfully completed Emily Harrington booking.",
      time: "9:45 AM",
    },
    {
      id: 2,
      type: "leave",
      title: "Leave apply",
      message: "You leave is for 25th – 28th may is approved.",
      time: "9:45 AM",
    },
    {
      id: 3,
      type: "success",
      title: "Congratulations 🙌",
      message: "You have successfully completed Emily Harrington booking.",
      time: "9:45 AM",
    },
    {
      id: 4,
      type: "leave",
      title: "Leave apply",
      message: "You leave is for 25th – 28th may is approved.",
      time: "9:45 AM",
    },
  ];

  const renderNotification = ({ item }: { item: Notification }) => {
    const isSuccess = item.type === "success";

    return (
      <View
        style={[
          styles.notificationCard,
          {
            backgroundColor: isSuccess
              ? "rgba(255, 243, 232, 0.7)"
              : "rgba(232, 227, 246, 0.7)",
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.bullet} />
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.messageText}>
          {item.message.includes("Emily Harrington") ? (
            <>
              You have successfully completed{" "}
              <Text style={styles.bold}>Emily Harrington</Text> booking.
            </>
          ) : (
            item.message
          )}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />
      {/* <View style={StyleSheet.absoluteFill}>
        <BackgroundSVGWhite />
      </View> */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={s(20)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        renderItem={renderNotification}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(15),
    paddingVertical: vs(10),
    marginBottom: vs(3),
    marginTop: Platform.OS === "android" ? vs(25) : vs(20),
  },
  backButton: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: "#F3F3F3",
    borderColor: "#ccc",
    // borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },
  headerTitle: {
    fontFamily: "Inter18SemiBold",
    fontSize: ms(20),
    // fontWeight: "700",
    // color: "#111827",
    flex: 1,
    textAlign: "center",
    marginRight: s(44),
  },
  content: {
    paddingHorizontal: s(15),
    paddingTop: vs(10),
    paddingBottom: vs(20),
  },
  notificationCard: {
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(10),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(4),
  },
  bullet: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: "#8B5CF6",
    marginRight: s(6),
  },
  titleText: {
    fontSize: ms(14),
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  timeText: {
    fontSize: ms(12),
    color: "#6B7280",
  },
  messageText: {
    fontSize: ms(14),
    color: "#4B5563",
    marginTop: vs(2),
    lineHeight: ms(20),
  },
  bold: {
    fontWeight: "700",
    color: "#111827",
  },
});

export default Notifications;
