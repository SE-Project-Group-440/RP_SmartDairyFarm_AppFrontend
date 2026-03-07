import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const LOCAL_IP = "172.28.1.99"; 
const LOCAL_IP = "192.168.1.15"; 
//const LOCAL_IP = "192.168.138.238"; 

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8000"
    : `http://${LOCAL_IP}:8000`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased to 30 seconds default
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a specialized instance for ML operations
export const mlApi = axios.create({
  baseURL: BASE_URL,
  timeout: 90000, // 90 seconds for ML operations
  headers: {
    "Content-Type": "application/json",
  },
});

//token
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

// Add token interceptor for ML API as well
mlApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

mlApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);
