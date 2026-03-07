import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";


const LOCAL_IP = Constants.expoConfig?.hostUri?.split(":")[0];


const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8000"
    : Platform.OS === "android"
    ? `http://${LOCAL_IP}:8000`
    : `http://${LOCAL_IP}:8000`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased to 30 seconds default
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);
