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

export async function speechToText(file: string | File): Promise<string> {
  const formData = new FormData();

  if (file instanceof File) {
    formData.append("audio", file);
  } else {
    formData.append("audio", {
      uri: file,
      name: "voice.m4a",
      type: "audio/m4a",
    } as any);
  }

  const res = await api.post("/stt", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.text ?? res.data ?? "";
}



