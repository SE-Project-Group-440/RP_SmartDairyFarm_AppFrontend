import { create } from "zustand";
import {
  recommendAI,
  markAIDone,
  fetchPendingCows,
  confirmPregnancy,
} from "../services/aiService";

/* ===========================
   TYPES
=========================== */

export interface InputData {
  "Lactation No": number;
  "Milk_Yield": number;
  "Breed": number;
  "Milking/Dry": string;
  "Hormonal Treatment": string;
  "Estrus Cycle Length": number;
  "Previous AI Dates": string;
  "Last Caving Date": string;
  "E. Age (Month)": number;
}

export interface Recommendation {
  _id: string;
  cowId: string;
  input_data: InputData;
  recommended_next_ai?: string;
  status: "PENDING" | "COMPLETED";
  pregnancy_probability?: number;
  risk_level?: string;
  pregnancy_check_date?: string;
  pregnancy_check_status?: "PREGNANT" | "NOT_PREGNANT";
}

export interface Cow {
  _id: string;
  cowId: string;
  recommendation: Recommendation;
  // flattening input_data into UI
  "Lactation No": number;
  "Milk_Yield": number;
  "Breed": number;
  "Milking/Dry": string;
  "Hormonal Treatment": string;
  "Estrus Cycle Length": number;
  "Previous AI Dates": string;
  "Last Caving Date": string;
  "E. Age (Month)": number;
}

interface AIStore {
  cows: Cow[];
  loading: boolean;
  fetchPending: () => Promise<void>;
  addCow: (cow: any) => Promise<void>;
  markDone: (cow: Cow, ai_date: string) => Promise<void>;
  confirmPregnancyStatus: (
    recommendationId: string,
    status: "PREGNANT" | "NOT_PREGNANT"
  ) => Promise<void>;
}

/* ===========================
   STORE
=========================== */

export const useAIStore = create<AIStore>((set) => ({
  cows: [],
  loading: false,

  /* ===========================
     FETCH PENDING
  =========================== */
  fetchPending: async () => {
    set({ loading: true });
    try {
      const data: Recommendation[] = await fetchPendingCows();

      const flattened: Cow[] = data.map((rec) => ({
        _id: rec._id,
        cowId: rec.cowId,
        ...rec.input_data,
        recommendation: rec,
      }));

      set({ cows: flattened, loading: false });
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },

  /* ===========================
     ADD COW + GET RECOMMENDATION
  =========================== */
  addCow: async (cow) => {
    set({ loading: true });
    try {
      const processedRow: InputData = {
        ...cow,
        "Lactation No": Number(cow["Lactation No"]),
        "Milk_Yield": Number(cow["Milk_Yield"]),
        "Breed": Number(cow["Breed"]),
        "Estrus Cycle Length": Number(cow["Estrus Cycle Length"]),
        "E. Age (Month)": Number(cow["E. Age (Month)"]),
      };

      const savedRecommendation: Recommendation = await recommendAI(
        cow.cowId,
        processedRow
      );

      set((state) => ({
        cows: [
          ...state.cows,
          {
            _id: savedRecommendation._id,
            cowId: savedRecommendation.cowId,
            ...savedRecommendation.input_data,
            recommendation: savedRecommendation,
          },
        ],
        loading: false,
      }));
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },

  /* ===========================
     MARK AI DONE
  =========================== */
  markDone: async (cow, ai_date) => {
    set({ loading: true });
    try {
      await markAIDone(cow.recommendation._id, ai_date);

      const updated: Recommendation[] = await fetchPendingCows();

      const flattened: Cow[] = updated.map((rec) => ({
        _id: rec._id,
        cowId: rec.cowId,
        ...rec.input_data,
        recommendation: rec,
      }));

      set({ cows: flattened, loading: false });
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },

  /* ===========================
     CONFIRM PREGNANCY
  =========================== */
  confirmPregnancyStatus: async (recommendationId, status) => {
    set({ loading: true });
    try {
      await confirmPregnancy(recommendationId, status);

      const updated: Recommendation[] = await fetchPendingCows();

      const flattened: Cow[] = updated.map((rec) => ({
        _id: rec._id,
        cowId: rec.cowId,
        ...rec.input_data,
        recommendation: rec,
      }));

      set({ cows: flattened, loading: false });
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },
}));