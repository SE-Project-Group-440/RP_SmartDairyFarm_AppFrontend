
import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Audio, AVPlaybackStatus} from "expo-av";
import { askChat, ChatResponse,speechToText } from "../../../services/chatService";



type Message = {
  id: number;
  text: string;
  isUser: boolean;
  audioUri?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා. ඔබට ප්‍රශ්න අසන්න පුළුවන්",
      isUser: false,
      audioUri: "http://10.154.183.24:8000/audio/welcome.mp3",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [soundObjects, setSoundObjects] = useState<{ [key: number]: Audio.Sound }>({});
  const [playingId, setPlayingId] = useState<number | null>(null);
  const recordingOptions: Audio.RecordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/wav",
    bitsPerSecond: 128000,
  },
};


  const quickQuestions = [
    "ගවුන්ට ආහාර ලබා දෙන්නේ කෙසේද?",
    "කිරි නිෂ්පාදනය වැඩි කරන්නේ කෙසේද?",
    "ගවුන්ගේ රෝග ලක්ෂණ මොනවාද?",
    "ගවුන්ට සනීපාරක්ෂාව කෙසේද?",
    "නව ගවයන් තෝරාගන්නේ කෙසේද?",
  ];

  /** ---------------- Audio Playback ---------------- */
  const playPauseAudio = async (msg: Message) => {
    if (!msg.audioUri) return;

    let sound = soundObjects[msg.id];

    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: msg.audioUri },
        { shouldPlay: true }
      );

      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
    setPlayingId(null);
  }
      });

      setSoundObjects((prev) => ({ ...prev, [msg.id]: newSound }));
      setPlayingId(msg.id);
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
  // Pause if playing
  await sound.pauseAsync();
  setPlayingId(null);
} else {
  // If audio already finished
  if (
    status.durationMillis &&
    status.positionMillis >= status.durationMillis
  ) {
    await sound.setPositionAsync(0);
  }

  await sound.playAsync();
  setPlayingId(msg.id);
}

  };
const playFromBeginning = async (msg: Message) => {
  if (!msg.audioUri) return;

  let sound = soundObjects[msg.id];

  // If sound not created yet, create and play
  if (!sound) {
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: msg.audioUri },
      { shouldPlay: true }
    );

    newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) setPlayingId(null);
    });

    setSoundObjects((prev) => ({ ...prev, [msg.id]: newSound }));
    setPlayingId(msg.id);
    return;
  }

  // Reset to beginning and play
  const status = await sound.getStatusAsync();
  if (!status.isLoaded) return;

  await sound.setPositionAsync(0);
  await sound.playAsync();
  setPlayingId(msg.id);
};

  const stopAllAudio = async () => {
    for (let key in soundObjects) {
      const s = soundObjects[Number(key)];
      const status = await s.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await s.stopAsync();
      }
    }
    setPlayingId(null);
  };
  // Start recording
const startRecording = async () => {
  try {
   
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Create recording instance
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(recordingOptions);

    //Start recording
    await rec.startAsync();

    setRecording(rec);
    setIsRecording(true); 
  } catch (err) {
    console.error("Recording failed:", err);
  }
};


// Stop recording and send to STT
const stopRecording = async () => {
  if (!recording) return;

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI(); 
  setRecording(null);
  setIsRecording(false);

  if (uri) {
    try {
      console.log("Sending audio URI to backend:", uri);  
      const text = await speechToText(uri);
      setInputText(text);
    } catch (err) {
      console.error("STT failed:", err);
    }
  }
};

  /** ---------------- Chat Messaging ---------------- */
  const sendMessage = async (text?: string) => {
    const message = text ?? inputText;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: message.trim(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const data: ChatResponse = await askChat(userMsg.text);

      // Map backend answer to a Message with optional pre-generated audio
      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.answer,
        isUser: false,
        audioUri: data.audioUri, 
      };
      setMessages((prev) => [...prev, botMsg]);

      // Auto-play
      playPauseAudio(botMsg);
    } catch {
      const botMsg: Message = {
        id: Date.now() + 2,
        text: "දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    await stopAllAudio();
    setMessages([
      {
        id: 1,
        text: "ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා. ඔබට ප්‍රශ්න අසන්න පුළුවන්",
        isUser: false,
        audioUri: "http://exp://10.154.183.24:8000/audio/welcome.mp3",
      },
    ]);
  };

  /** ---------------- UI ---------------- */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}> කිරි ගොවිතැන් උපදේශක</Text>

        <TouchableOpacity onPress={clearChat} style={styles.trashBtn}>
          <Image
            source={require("../../../assets/images/trash.png")}
            style={styles.trashIcon}
          />
        </TouchableOpacity>
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
            {!msg.isUser && (
              <Image
                source={require("../../../assets/images/chatbot.png")}
                style={styles.avatar}
              />
            )}

            <View style={{ flexDirection: "column", maxWidth: "85%"}}>
              <View style={[styles.bubble, msg.isUser ? styles.userBubble : styles.botBubble]}>
                <Text style={{ color: msg.isUser ? "#fff" : "#333" }}>{msg.text}</Text>
              </View>

              {!msg.isUser && msg.audioUri && (
                <View style={styles.audioControls}>
                  {/* PLAY / PAUSE */}
                  <TouchableOpacity
                    onPress={() => playPauseAudio(msg)}
                    style={[
                      styles.audioBtn,
                      playingId === msg.id && styles.audioBtnActive,
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={
                          playingId === msg.id
                            ? require("../../../assets/images/pause.png")
                            : require("../../../assets/images/play.png")
                        }
                        style={{ width: 18, height: 18, marginRight: 6 }}
                      />

                      <Text style={styles.audioText}>
                        {playingId === msg.id ? "නවත්වන්න" : "සවන් දෙන්න"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* RESTART */}
                  <TouchableOpacity
                    onPress={() => playFromBeginning(msg)}
                    style={[styles.audioBtn, { marginLeft: 10 }]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../../assets/images/restart.png")}
                        style={{ width: 18, height: 18, marginRight: 6 }}
                      />

                      <Text style={styles.audioText}>මුල සිට</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {msg.isUser && (
              <Image
                source={require("../../../assets/images/user.png")}
                style={styles.avatar}
              />
            )}
          </View>
        ))}
        {loading && <Text style={styles.loading}>සිතමින්...</Text>}
      </ScrollView>

      <View style={styles.inputSection}>
        <Text style={styles.quickTitle}>ඉක්මන් ප්‍රශ්න</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {quickQuestions.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => sendMessage(q)}
              style={styles.quickBtn}
            >
              <Text style={{ color: "#047857", fontSize: 12 }}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="ඔබගේ ප්‍රශ්නය මෙහි සටහන් කරන්න..."
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            style={styles.sendBtn}
          >
            <Image source={require("../../../assets/images/send.png")}/>  
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[
              styles.micBtn,
              {
                backgroundColor: isRecording ? "#ef4444" : "#bbf7d0", 
              },
            ]}
          >
            <Image
              source={
                isRecording
                  ? require("../../../assets/images/stop.png")
                  : require("../../../assets/images/mic.png")
              }
              style={{ width: 24, height: 24}} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>
          නොමිලේ ලබාදෙන කෘතිම බුද්ධි උපදේශකයෙකි. වැදගත් තීරණ සඳහා විශේෂඥ සහාය පතන්න.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  header: { padding: 20, backgroundColor: "#16a34a",flexDirection: "row",             
  justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },

  chatContainer: { flex: 1, padding: 10 },
  message: { flexDirection: "row", marginBottom: 10 },
  userMessage: { justifyContent: "flex-end" },
  botMessage: { justifyContent: "flex-start" },

  bubble: { padding: 8, borderRadius: 18 },
  userBubble: { backgroundColor: "#16a34a", borderBottomRightRadius: 4 },
  botBubble: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 4,
  },

  avatar: { width: 28, height: 28, marginHorizontal: 6, borderRadius: 14 },
  loading: { marginTop: 10, textAlign: "center" },

  inputSection: { padding: 10, backgroundColor: "#fff" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  textInput: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 25, padding: 12 },
  sendBtn: { backgroundColor: "#16a34a", padding: 12, borderRadius: 25, alignItems: "center" },

  controls: { flexDirection: "row", marginTop: 10 },
  btn: { padding: 10, borderRadius: 20 },

  quickTitle: {fontWeight: "bold" },
  quickQuestions: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  quickBtn: {  paddingVertical: 6, paddingHorizontal: 10, borderRadius: 18, margin: 4,borderWidth: 1,
  borderColor: "#dcfce7", },

  ttsBtn: { paddingVertical: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", minWidth: 80 },
  ttsBtnText: { color: "#fff", fontSize: 13, textAlign: "center" },
   micBtn: {
    padding: 12,
    borderRadius: 10,
  },
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  audioBtn: {
    
    height: 42,
    borderRadius: 20,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    padding:4,
    elevation: 3, 

    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  audioBtnActive: {
    backgroundColor: "#f87171",
  },

  audioIcon: {
    fontSize: 12,
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#94a3b8", 
    marginTop: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.6,
  },

  audioText: {
  
    fontSize: 13,
    fontWeight: "200",
  },
  trashBtn: {
    width: 36,
    height: 36,
    borderRadius: 4, 
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },

  trashIcon: {
    width: 18,
    height: 18,
    
  },
});




