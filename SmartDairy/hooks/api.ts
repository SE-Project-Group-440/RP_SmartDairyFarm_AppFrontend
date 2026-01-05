import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const LOCAL_IP = "172.28.1.99"; 
const LOCAL_IP = "192.168.1.15"; 
//const LOCAL_IP = "192.168.100.238"; 

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8000"
    : `http://${LOCAL_IP}:8000`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 Optional: handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);
