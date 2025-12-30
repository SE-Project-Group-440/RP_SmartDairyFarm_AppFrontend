// App.tsx
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';

// Knowledge base
const knowledgeBase: Record<string, { response: string; audio?: string }> = {
  'ආහාර': {
    response: 'ගවුන්ගේ ආහාර ගැන:\n🌱 තණකොළ: දිනකට ශරීර බරෙන් 2-3%\n🌾 පිදුරු: දිනකට 1-2 කිලෝ\n🥬 කොළ ආහාර: කස්සාව, ගිනිතිත්ත, ඉප්පොහා\n💧 ජලය: දිනකට ලීටර 30-50\n🧂 ලුණු: දිනකට ග්‍රෑම් 20-30\nසමතුලිත ආහාරයක් ගවුන්ට ගැනීම ඉතාමත් වැදගත්.',
    audio: 'ගවුන්ගේ ආහාරයට තණකොළ, පිදුරු, කොළ ආහාර සහ ජලය අවශ්‍යයි.',
  },
  'කිරි': {
    response: 'කිරි නිෂ්පාදනය වැඩි කරන ක්‍රම:\n🥛 නිසි ආහාර ගැනීම\n⏰ කාලානුකූල කිරි ගැනීම\n🏥 නිසි සෞඛ්‍ය රැකවරණය\n🛁 සනීපාරක්ෂාව\n🌡️ සුදුසු උෂ්ණත්වය\n💆‍♀️ ආතතිය අඩු කිරීම',
    audio: 'කිරි නිෂ්පාදනය වැඩි කරන්න නිසි ආහාර සහ සනීපාරක්ෂාව වැදගත්.',
  },
  'රෝග': {
    response: 'ගවුන්ගේ සාමාන්‍ය රෝග ලක්ෂණ:\n🌡️ උණ\n😴 සුස්තිකම\n👃 නාසාවේ ස්‍රාවය\n💧 අමාත්‍ය පාචනය\n🦵 කෙඳි ගැටගැසීම\n⚠️ වහාම වෛද්‍ය බලන්න',
    audio: 'ගවුන්ගේ රෝග ලක්ෂණ උණ, සුස්තිකම, නාසාවේ ස්‍රාවය වැනි දේ.',
  },
  'සනීපාරක්ෂාව': {
    response: 'ගවුන්ගේ සනීපාරක්ෂාව:\n🧼 දිනකට 2 වාරයක් අත් සෝදන්න\n🪣 උපකරණ පිරිසිදු කරන්න\n🏠 ගවත්ත පිරිසිදුව තබාගන්න\n💧 ශුද්ධ ජලය ලබාදෙන්න\n🧽 ශරීරය පිරිසිදු කරන්න',
    audio: 'සනීපාරක්ෂාවට අත් සෝදන්න, උපකරණ පිරිසිදු කරන්න වැදගත්.',
  },
  'තෝරාගැනීම': {
    response: 'හොඳ ගවයන් තෝරාගන්නේ:\n🐄 වර්ගය\n📏 ශරීර ගොඩනැගිල්ල\n🥛 කිරි නිෂ්පාදන ඉතිහාසය\n🏥 සෞඛ්‍ය තත්ත්වය\n🎯 වයස 2-6 අවුරුදු',
    audio: 'හොඳ ගවයන් තෝරාගන්න වර්ගය, ශරීර ගොඩනැගිල්ල, සෞඛ්‍ය තත්ත්වය බලන්න.',
  },
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<
    { id: number; text: string; isUser: boolean }[]
  >([
    {
      id: 1,
      text: 'ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා. ඔබට කතා කරන්න හෝ ටයිප් කරන්න පුළුවන්!',
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    'ගවුන්ගේ ආහාර කෙසේ දිය යුතුද?',
    'කිරි නිෂ්පාදනය වැඩි කරන්නේ කෙසේද?',
    'ගවුන්ගේ රෝග ලක්ෂණ මොනවාද?',
    'ගවුන්ට සනීපාරක්ෂාව කෙසේද?',
    'නව ගවයන් තෝරාගන්නේ කෙසේද?',
  ];

  const findResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    for (let keyword in knowledgeBase) {
      if (
        lowerQuestion.includes(keyword) ||
        (lowerQuestion.includes('feed') || lowerQuestion.includes('food')) &&
          keyword === 'ආහාර' ||
        lowerQuestion.includes('milk') && keyword === 'කිරි' ||
        (lowerQuestion.includes('disease') || lowerQuestion.includes('sick')) &&
          keyword === 'රෝග' ||
        (lowerQuestion.includes('clean') || lowerQuestion.includes('hygiene')) &&
          keyword === 'සනීපාරක්ෂාව' ||
        (lowerQuestion.includes('select') || lowerQuestion.includes('choose')) &&
          keyword === 'තෝරාගැනීම'
      ) {
        return knowledgeBase[keyword];
      }
    }
    return {
      response:
        'මට ඔබගේ ප්‍රශ්නය හරියටම තේරුණේ නෑ. කරුණාකර වඩාත් නිශ්චිත ප්‍රශ්නයක් අසන්න.',
      audio: 'මට ඔබගේ ප්‍රශ්නය හරියටම තේරුණේ නෑ.',
    };
  };

  const sendMessage = (text?: string) => {
    const message = text || inputText;
    if (!message.trim()) return;

    const userMessage = { id: Date.now(), text: message.trim(), isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResp = findResponse(message);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResp.response, isUser: false },
      ]);
      if (botResp.audio) Speech.speak(botResp.audio, { language: 'si-LK' });
    }, 500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: 'ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා. ඔබට කතා කරන්න හෝ ටයිප් කරන්න පුළුවන්!',
        isUser: false,
      },
    ]);
  };

  const askQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐄 කිරි ගොවිතැන් උපදේශක</Text>
        <Text style={styles.headerSubtitle}>Dairy Farm Educational Assistant</Text>
      </View>

      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.message, msg.isUser ? styles.userMessage : styles.botMessage]}
          >
            {!msg.isUser && <View style={styles.avatarBot}>🤖</View>}
            <View
              style={[
                styles.messageContent,
                msg.isUser ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={{ color: msg.isUser ? '#fff' : '#333' }}>{msg.text}</Text>
            </View>
            {msg.isUser && <View style={styles.avatarUser}>👤</View>}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="ඔබගේ ප්‍රශ්නය යොමු කරන්න..."
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
            <Text style={{ color: 'white', fontSize: 16 }}>📤 යවන්න</Text>
          </TouchableOpacity>
        </View>

        
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

        <Text style={{ color: 'black', marginTop: 20,fontWeight: 'bold' }}>ඉක්මන් ප්‍රශ්න :</Text>


        <View style={styles.quickQuestions}>  
          {quickQuestions.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickBtn}
              onPress={() => askQuickQuestion(q)}
            >
              <Text>{q}</Text>
            </TouchableOpacity>
          ))}
          
        </View>

        

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#667eea' },
  header: { padding: 20, backgroundColor: '#4CAF50', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'white', opacity: 0.9 },
  chatContainer: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  message: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' },
  userMessage: { justifyContent: 'flex-end' },
  botMessage: { justifyContent: 'flex-start' },
  messageContent: { maxWidth: '70%', padding: 12, borderRadius: 20 },
  userBubble: { backgroundColor: '#007bff', borderBottomRightRadius: 5 },
  botBubble: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e9ecef', borderBottomLeftRadius: 5 },
  avatarUser: { marginLeft: 5 },
  avatarBot: { marginRight: 5 },
  inputSection: { padding: 10, backgroundColor: 'white' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 25,
    padding: 12,
  },
  sendBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickQuestions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 5 },
  quickBtn: {
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 3,
  },
  controls: { flexDirection: 'row', marginTop: 10 },
  btn: { padding: 12, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
});
