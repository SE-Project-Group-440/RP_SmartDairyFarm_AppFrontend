import { Platform } from "react-native";
import { api } from "./../hooks/api";
export interface ChatResponse {
  answer: string;
  audioUri?: string;
}

export async function askChat(query: string): Promise<ChatResponse> {
  const response = await api.post("/chat", { query });
  const data = response.data;
  
  // Frontend-only fix: Rewrite internal backend URL back to the public IP
  if (data.audioUri && data.audioUri.includes("fastapi-backend")) {
    try {
      const hostIP = api.defaults.baseURL?.match(/https?:\/\/([^:/]+)/)?.[1];
      if (hostIP) {
        // Swap out the fake docker domain with our public server IP on port 8080
        data.audioUri = data.audioUri.replace(/fastapi-backend(:\d+)?/g, `${hostIP}:8080`);
      }
    } catch (e) {
      console.warn("Failed to rewrite audioUri", e);
    }
  }

  return data;
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

  // ✅ call Node backend
  const res = await api.post("/stt", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.text ?? "";
}


