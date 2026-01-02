// ChatScreen.tsx
import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Speech from "expo-speech";
import { askChat } from "../../../services/chatService";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා. ඔබට ප්‍රශ්න අසන්න පුළුවන් 😊",
      isUser: false,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    "ගවුන්ගේ ආහාර කෙසේ දිය යුතුද?",
    "කිරි නිෂ්පාදනය වැඩි කරන්නේ කෙසේද?",
    "ගවුන්ගේ රෝග ලක්ෂණ මොනවාද?",
    "ගවුන්ට සනීපාරක්ෂාව කෙසේද?",
    "නව ගවයන් තෝරාගන්නේ කෙසේද?",
  ];

  // 🔹 MAIN SEND FUNCTION (REAL MODEL)
  const sendMessage = async (text?: string) => {
    const message = text ?? inputText;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: message.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const data = await askChat(userMsg.text);

      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.answer,
        isUser: false,
      };

      setMessages(prev => [...prev, botMsg]);

      // 🔊 Speak Sinhala answer
      //Speech.speak(data.answer, { language: "si-LK" });
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා 😊",
        isUser: false,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐄 කිරි ගොවිතැන් උපදේශක</Text>
        <Text style={styles.headerSubtitle}>
          AI Dairy Farm Assistant (Sinhala)
        </Text>
      </View>

      {/* Chat */}
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.message,
              msg.isUser ? styles.userMessage : styles.botMessage,
            ]}
          >
            {!msg.isUser && <Text style={styles.avatar}>🤖</Text>}
            <View
              style={[
                styles.bubble,
                msg.isUser ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={{ color: msg.isUser ? "#fff" : "#333" }}>
                {msg.text}
              </Text>
            </View>
            {msg.isUser && <Text style={styles.avatar}>👤</Text>}
          </View>
        ))}

        {loading && <Text style={{ marginTop: 10 }}>🤖 සිතමින්...</Text>}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="ඔබගේ ප්‍රශ්නය ඇතුළත් කරන්න..."
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
            <Text style={{ color: "white" }}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#17a2b8', marginRight: 10 }]}
            onPress={clearChat}
          >
            <Text style={{ color: 'white' }}>🎤 කතා කරන්න</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#dc3545' }]}
            onPress={clearChat}
          >
            <Text style={{ color: 'white' }}>🗑️ මකන්න</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Questions */}
        <Text style={styles.quickTitle}>ඉක්මන් ප්‍රශ්න</Text>
        <View style={styles.quickQuestions}>
          {quickQuestions.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickBtn}
              onPress={() => sendMessage(q)}
            >
              <Text>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  header: { padding: 20, backgroundColor: "#16a34a", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 13, color: "white", opacity: 0.9 },

  chatContainer: { flex: 1, padding: 10 },
  message: { flexDirection: "row", marginBottom: 10 },
  userMessage: { justifyContent: "flex-end" },
  botMessage: { justifyContent: "flex-start" },
  bubble: { maxWidth: "70%", padding: 12, borderRadius: 18 },
  userBubble: { backgroundColor: "#2563eb", borderBottomRightRadius: 4 },
  botBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 4,
  },
  avatar: { marginHorizontal: 6, fontSize: 18 },

  inputSection: { padding: 10, backgroundColor: "white" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 25,
    padding: 12,
  },
  sendBtn: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 25,
  },

  controls: { flexDirection: "row", marginTop: 10 },
  btn: { padding: 10, borderRadius: 20 },

  quickTitle: { marginTop: 15, fontWeight: "bold" },
  quickQuestions: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  quickBtn: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
    margin: 4,
  },
});
