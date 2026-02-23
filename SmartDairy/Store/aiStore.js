import { create } from "zustand";
import { recommendAI, markAIDone,fetchPendingCows } from "../services/aiService";

export const useAIStore = create((set) => ({
  cows: [], // stores all cows added
  loading: false,

  fetchPending: async () => {
  set({ loading: true });
  try {
    const data = await fetchPendingCows();

    // flatten input_data for UI
    const flattened = data.map((rec) => ({
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

  // Add cow AND automatically get AI recommendation
  addCow: async (cow) => {
  set({ loading: true });
  try {
    const processedRow = {
      ...cow,
      "Lactation No": Number(cow["Lactation No"]),
      "Milk_Yield": Number(cow["Milk_Yield"]),
      "Breed": Number(cow["Breed"]),
      "Estrus Cycle Length": Number(cow["Estrus Cycle Length"]),
      "E. Age (Month)": Number(cow["E. Age (Month)"]),
    };

    const savedRecommendation = await recommendAI(cow.cowId, processedRow);

    set((state) => ({
      cows: [
        ...state.cows,
        {
          _id: savedRecommendation._id, // DB _id
          cowId: savedRecommendation.cowId,
          ...savedRecommendation.input_data, // merge the fields here
          recommendation: savedRecommendation, // keep full recommendation for status, etc.
        },
      ],
      loading: false,
    }));
  } catch (err) {
    console.log(err);
    set({ loading: false });
  }
},
  // Mark AI done → triggers pregnancy prediction
  markDone: async (cow, ai_date) => {
  set({ loading: true });
  try {
    await markAIDone(cow.recommendation._id, ai_date);

    // 🔥 Refetch from DB to sync properly
    const updated = await fetchPendingCows();

    const flattened = updated.map((rec) => ({
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