import axios from "axios";
import { api } from "./../hooks/api";

export interface InputData {
  "Lactation No": number;
  "Milk_Yield": number;
  "Breed": string;
  "Milking/Dry": string;
  "Hormonal Treatment": string;
  "Estrus Cycle Length": number;
  "Previous AI Dates": string;
  "Last Caving Date": string;
  "E. Age (Month)": number;
}

export type RecommendationStatus = "PENDING" | "COMPLETED";

export type PregnancyStatus = "PREGNANT" | "NOT_PREGNANT";

export interface Recommendation {
  _id: string;
  cowId: string;
  input_data: InputData;
  recommended_next_ai?: string;
  status: RecommendationStatus;
  pregnancy_probability?: number;
  risk_level?: string;
  pregnancy_check_date?: string;
  pregnancy_check_status?: PregnancyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export const recommendAI = async (
  cowId: string,
  row: InputData
): Promise<Recommendation> => {
  const payload = { cowId, row };
  console.log("Sending payload to backend:", payload);
  const response = await api.post<Recommendation>("/api/ai/recommend", payload);
  return response.data;
};

export const markAIDone = async (
  recommendationId: string,
  ai_date: string
): Promise<Recommendation> => {
  const response = await api.post<Recommendation>(
    `/api/ai/done/${recommendationId}`,
    { ai_date }
  );
  return response.data;
};

export const fetchPendingCows = async (): Promise<Recommendation[]> => {
  const response = await api.get<Recommendation[]>("/api/ai/all");
  return response.data;
};


export const confirmPregnancy = async (
  recommendationId: string,
  status: PregnancyStatus
): Promise<Recommendation> => {
  const response = await api.post<Recommendation>(
    `/api/ai/confirm-pregnancy/${recommendationId}`,
    {
      pregnancy_check_status: status,
    }
  );
  return response.data;
};