import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";


const LOCAL_IP = "10.98.42.24"; // Replace with your machine's local IP address


const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8080"
    : Platform.OS === "android"
    ? `http://${LOCAL_IP}:8080`
    : `http://${LOCAL_IP}:8080`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, 
  headers: {
    "Content-Type": "application/json",
  },
});


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
