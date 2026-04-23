import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";



const BASE_URL = "http://13.63.58.14:8080";

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
