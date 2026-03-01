import axios from "axios";

const API = axios.create({
  baseURL: "http://10.35.236.24:8000/api/ai", 
  // ⚠ IMPORTANT:
  // If testing on real phone, use your PC local IP
  // NOT localhost
});

export const recommendAI = async (cowId, row) => {
  const payload = { cowId, row };

  console.log("Sending payload to backend:", payload); // 🔥 log it here

  const response = await API.post("/recommend", payload);
  return response.data;
};

export const markAIDone = async (recommendationId, ai_date) => {
  const response = await API.post(`/done/${recommendationId}`, {
    ai_date,
  });
  return response.data;
};

// services/aiService.js
export const fetchPendingCows = async () => {
  const response = await API.get("/pending");
  return response.data;
};