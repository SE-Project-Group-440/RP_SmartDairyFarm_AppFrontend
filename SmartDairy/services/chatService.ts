import { Platform } from "react-native";

export const API_URL = "http://10.98.42.24:8000/chat"; 
export interface ChatResponse {
  answer: string;
  audioUri?: string; 
}

export async function askChat(query: string): Promise<ChatResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from backend");
  }

  return response.json();
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

  const res = await fetch("http://10.98.42.24:8000/stt", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }

  const data = await res.json();
  return data.text; 
}



