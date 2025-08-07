import { ms, s, vs } from "@/utils/scale";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Message {
  id: string;
  text: string;
  sender: "self" | "other";
  time: string;
  isRead?: boolean;
}

const messages: Message[] = [
  {
    id: "1",
    text: "I have some meeting now",
    sender: "self",
    time: "9:12 AM",
    isRead: true,
  },
  {
    id: "2",
    text: "Sure, let me know when you'll be free!",
    sender: "other",
    time: "9:12 AM",
  },
  {
    id: "3",
    text: "Hi Alvin, good morning!!",
    sender: "self",
    time: "9:12 AM",
    isRead: true,
  },
  {
    id: "4",
    text: "Halo! Good Morning, whats up man?",
    sender: "other",
    time: "9:12 AM",
  },
  {
    id: "5",
    text: "Sorry to bother, can i ask you for a help today?",
    sender: "self",
    time: "9:12 AM",
    isRead: true,
  },
  {
    id: "6",
    text: "Of course, what can I help you with??",
    sender: "other",
    time: "9:12 AM",
  },
];

export default function ChatScreen() {
  const [inputText, setInputText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const renderMessage = ({ item }: { item: Message }) => {
    const isSelf = item.sender === "self";
    return (
      <View style={styles.messageWrapper}>
        <View
          style={[
            styles.messageContainer,
            isSelf ? styles.selfMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <View style={styles.messageFooter}>
            {isSelf && item.isRead && (
              <Ionicons name="checkmark-done" size={ms(12)} color="#69417E" />
            )}
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Handle sending message logic here
      console.log("Sending message:", inputText);
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pollard Chris</Text>
            <Text style={styles.headerSubtitle}>Initiated Today</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            Platform.OS === "android" &&
              !isKeyboardVisible &&
              styles.inputContainerWithBottomSpace,
          ]}
        >
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={ms(20)} color="#69417E" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Start typing..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : {},
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={ms(23)}
              color={inputText.trim() ? "#69417E" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(22),
    backgroundColor: "rgba(243, 243, 243, 1)",
    borderColor: "rgba(243, 243, 243, 1)",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(20),
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    marginRight: s(40),
    fontSize: ms(18),
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "InterSemiBold",
  },
  headerSubtitle: {
    marginRight: s(40),
    fontSize: ms(12),
    color: "#666",
    marginTop: vs(2),
    fontFamily: "InterMedium",
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
  },
  messageWrapper: {
    marginVertical: vs(4),
  },
  messageContainer: {
    maxWidth: "75%",
    borderRadius: ms(16),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selfMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F0E6D6",
    borderBottomRightRadius: ms(4),
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: ms(4),
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  messageText: {
    fontSize: ms(14),
    color: "#1A1A1A",
    lineHeight: ms(20),
    fontFamily: "Inter18Regular",
    marginBottom: vs(4),
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: vs(2),
  },
  messageTime: {
    fontSize: ms(10),
    color: "#999",
    marginLeft: s(4),
    fontFamily: "InterMedium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    // backgroundColor: "#fff",
    // borderTopWidth: 1,
    // borderTopColor: "#E5E5E5",
    // elevation: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
  },
  attachButton: {
    padding: s(8),
    marginRight: s(8),
  },
  input: {
    flex: 1,
    minHeight: vs(40),
    maxHeight: vs(100),
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    backgroundColor: "rgba(236, 240, 240, 1)",
    borderRadius: ms(20),
    fontSize: ms(14),
    color: "#1A1A1A",
    fontFamily: "Inter18Regular",
    textAlignVertical: "center",
  },
  sendButton: {
    padding: s(10),
    marginLeft: s(10),
  },
  sendButtonActive: {
    // backgroundColor: "#F0E6D6",
    borderRadius: ms(20),
  },
  inputContainerWithBottomSpace: {
    paddingBottom: vs(27),
    marginBottom: -vs(25),
  },
});
