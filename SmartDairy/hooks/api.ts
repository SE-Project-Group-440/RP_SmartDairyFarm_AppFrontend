import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = "10.248.75.24"; 

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
