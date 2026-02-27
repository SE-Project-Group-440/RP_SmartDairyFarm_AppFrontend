import axios from "axios";

/* ===========================
   AXIOS INSTANCE
=========================== */

const API = axios.create({
  baseURL: "http://10.109.230.24:8000/api/ai",
  // ⚠ If using real device, use your PC IP
});

/* ===========================
   TYPES
=========================== */

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

/* ===========================
   API FUNCTIONS
=========================== */

/**
 * Create AI Recommendation
 */
export const recommendAI = async (
  cowId: string,
  row: InputData
): Promise<Recommendation> => {
  const payload = { cowId, row };

  console.log("Sending payload to backend:", payload);

  const response = await API.post<Recommendation>("/recommend", payload);
  return response.data;
};

/**
 * Mark AI as Done
 */
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

/**
 * Fetch All Recommendations
 */
export const fetchPendingCows = async (): Promise<Recommendation[]> => {
  const response = await API.get<Recommendation[]>("/all");
  return response.data;
};

/**
 * Confirm Pregnancy
 */
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