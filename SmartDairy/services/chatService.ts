import { Platform } from "react-native";
import { api } from "./../hooks/api";
export interface ChatResponse {
  answer: string;
  audioUri?: string; 
}

export async function askChat(query: string): Promise<ChatResponse> {
  const response = await api.post("/chat", { query });
  return response.data;
}

export async function speechToText(fileUri: string): Promise<string> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    formData.append("audio", blob, "voice.webm");
  } else {
  formData.append("audio", {
    uri: fileUri,
    name: "voice.wav",
    type: "audio/wav",
  } as any);
  }

  const res = await api.post("/stt", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

  
  return res.data.text; 
}



