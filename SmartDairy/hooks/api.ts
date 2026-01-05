import axios from "axios";
import { Platform } from "react-native";

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
