import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.8.176:8080/api/ai",
});
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
  const response = await API.post<Recommendation>("/recommend", payload);
  return response.data;
};

export const markAIDone = async (
  recommendationId: string,
  ai_date: string
): Promise<Recommendation> => {
  const response = await API.post<Recommendation>(
    `/done/${recommendationId}`,
    { ai_date }
  );
  return response.data;
};

export const fetchPendingCows = async (): Promise<Recommendation[]> => {
  const response = await API.get<Recommendation[]>("/all");
  return response.data;
};


export const confirmPregnancy = async (
  recommendationId: string,
  status: PregnancyStatus
): Promise<Recommendation> => {
  const response = await API.post<Recommendation>(
    `/confirm-pregnancy/${recommendationId}`,
    {
      pregnancy_check_status: status,
    }
  );
  return response.data;
};