import { ms, s, vs } from "@/utils/scale";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";

dayjs.extend(relativeTime);

type Notification = {
  id: number;
  type: "success" | "leave";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const TAB_OPTIONS = ["All", "Success", "Leave"];

const Notifications = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNoti, setSelectedNoti] = useState<Notification | null>(null);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const loadNotifications = async () => {
    try {
      const stored = await SecureStore.getItemAsync("notifications");
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        const now = new Date().toISOString();
        const initialData: Notification[] = [
          {
            id: 1,
            type: "success",
            title: "Congratulations 🙌",
            message:
              "You have successfully completed Emily Harrington booking.",
            time: now,
            read: false,
          },
          {
            id: 2,
            type: "leave",
            title: "Leave apply",
            message: "Your leave for 25th – 28th May is approved.",
            time: now,
            read: false,
          },
        ];
        setNotifications(initialData);
        await SecureStore.setItemAsync(
          "notifications",
          JSON.stringify(initialData)
        );
      }
    } catch (error) {
      console.error("Error loading notifications", error);
    }
  };

  const saveNotifications = async (data: Notification[]) => {
    try {
      setNotifications(data);
      await SecureStore.setItemAsync("notifications", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving notifications", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const toggleRead = (id: number) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: !n.read } : n
    );
    saveNotifications(updated);
  };

  const deleteNotification = (id: number) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      const newNoti: Notification = {
        id: Date.now(),
        type: Math.random() > 0.5 ? "success" : "leave",
        title:
          Math.random() > 0.5
            ? "Congratulations 🙌"
            : "Leave application update",
        message:
          Math.random() > 0.5
            ? "You have successfully completed a booking."
            : "Your leave request has been processed.",
        time: new Date().toISOString(),
        read: false,
      };
      saveNotifications([newNoti, ...notifications]);
    }, 1500);
  }, [notifications]);

  const filteredNotifications =
    activeTab === "All"
      ? notifications
      : notifications.filter(
          (n) => n.type.toLowerCase() === activeTab.toLowerCase()
        );

  const navigateFromNotification = (item: Notification) => {
    if (item.type === "success") {
      router.push("/rawPages/bookingdetails");
    } else if (item.type === "leave") {
      router.push("/rawPages/LeaveScreen");
    }
  };

  const renderRightActions = (item: Notification, dragX: any) => (
    <View
      style={[
        styles.swipeAction,
        {
          backgroundColor: "#EF4444",
          borderTopRightRadius: ms(12),
          borderBottomRightRadius: ms(12),
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => deleteNotification(item.id)}
        style={styles.actionBtn}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderLeftActions = (item: Notification, dragX: any) => (
    <View
      style={[
        styles.swipeAction,
        {
          backgroundColor: "#10B981",
          borderTopLeftRadius: ms(12),
          borderBottomLeftRadius: ms(12),
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleRead(item.id)}
        style={styles.actionBtn}
      >
        <Ionicons
          name={item.read ? "mail-unread-outline" : "mail-open-outline"}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  const openMenu = (item: Notification) => {
    setSelectedNoti(item);
    setMenuVisible(true);
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const isSuccess = item.type === "success";
    return (
      <Swipeable
        renderRightActions={(progress) => renderRightActions(item, progress)}
        renderLeftActions={(progress) => renderLeftActions(item, progress)}
      >
        <TouchableOpacity
          style={[
            styles.notificationCard,
            {
              backgroundColor: isSuccess
                ? "rgba(255, 243, 232, 0.7)"
                : "rgba(232, 227, 246, 0.7)",
            },
          ]}
          onPress={() => navigateFromNotification(item)}
          onLongPress={() => openMenu(item)}
        >
          <View style={styles.headerRow}>
            {!item.read && <View style={styles.unreadDot} />}
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.timeText}>
              {dayjs(item.time).fromNow(true)} ago
            </Text>
          </View>
          <Text style={styles.messageText}>{item.message}</Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={s(20)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Ionicons name="checkmark-done" size={24} color="#69417E" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TAB_OPTIONS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.content, { flexGrow: 1 }]}
          renderItem={renderNotification}
          refreshing={refreshing}
          onRefresh={onRefresh}
          alwaysBounceVertical
          overScrollMode="always"
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ionicons
            name="notifications-off-outline"
            size={50}
            color="#6B7280"
          />
          <Text style={styles.emptyText}>No Notifications Yet</Text>
        </ScrollView>
      )}

      {/* Custom Bottom Sheet */}
      <Modal
        isVisible={isMenuVisible}
        onBackdropPress={() => setMenuVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.sheetButton}
            onPress={() => {
              if (selectedNoti) toggleRead(selectedNoti.id);
              setMenuVisible(false);
            }}
          >
            <Ionicons name="mail-outline" size={20} color="#69417E" />
            <Text style={styles.sheetText}>
              {selectedNoti?.read ? "Mark as Unread" : "Mark as Read"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetButton}
            onPress={() => setMenuVisible(false)}
          >
            <Ionicons name="copy-outline" size={20} color="#69417E" />
            <Text style={styles.sheetText}>Copy Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sheetButton, { backgroundColor: "#FEE2E2" }]}
            onPress={() => {
              if (selectedNoti) deleteNotification(selectedNoti.id);
              setMenuVisible(false);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.sheetText, { color: "#EF4444" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(15),
    paddingVertical: vs(10),
    marginTop: Platform.OS === "android" ? vs(25) : vs(20),
    justifyContent: "space-between",
  },
  backButton: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "InterSemiBold",
    fontSize: ms(20),
    flex: 1,
    textAlign: "center",
    marginHorizontal: s(10),
  },
  content: { paddingHorizontal: s(15), paddingTop: vs(10) },
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
  titleText: { fontSize: ms(14), fontWeight: "600", color: "#111827", flex: 1 },
  timeText: { fontSize: ms(12), color: "#6B7280" },
  messageText: { fontSize: ms(14), color: "#4B5563", marginTop: vs(2) },
  unreadDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: "#8B5CF6",
    marginRight: s(6),
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    height: "83%",
  },
  actionBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: s(10),
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: s(15),
    marginBottom: vs(5),
    marginTop: vs(5),
  },
  tabButton: {
    flex: 1,
    paddingVertical: vs(8),
    borderRadius: ms(20),
    backgroundColor: "#F3F3F3",
    marginHorizontal: s(3),
    alignItems: "center",
  },
  tabButtonActive: { backgroundColor: "#69417E" },
  tabText: { fontSize: ms(14), color: "#6B7280" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  emptyText: {
    fontFamily: "InterSemiBold",
    fontSize: ms(16),
    color: "#6B7280",
    marginTop: vs(12),
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: s(15),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  sheetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(12),
    paddingHorizontal: s(10),
    borderRadius: ms(12),
  },
  sheetText: { marginLeft: s(10), fontSize: ms(16), color: "#111827" },
});

export default Notifications;
