import { create } from "zustand";
import { api } from "../hooks/api";

interface Recommendation {
  _id: string;
  cowId: {
    _id: string;
    name: string;
  };
  title: string;
  message: string;
  actions: string[];
  status: string;
  actualMilk?: number;
  expectedMilk?: number;
  createdAt: string;
}

interface RecommendationStore {
  recommendations: Recommendation[];
  loading: boolean;

  fetchActiveByCow: (cowId: string) => Promise<void>;
  fetchAll: () => Promise<void>;
  resolveRecommendation: (id: string) => Promise<void>;
}

export const useRecommendationStore = create<RecommendationStore>(
  (set, get) => ({
    recommendations: [],
    loading: false,

    fetchActiveByCow: async (cowId) => {
      set({ loading: true });
      const res = await api.get(
        `/rec/cow/${cowId}/active`
      );
      set({ recommendations: res.data, loading: false });
    },

    fetchAll: async () => {
      set({ loading: true });
      const res = await api.get("/rec/all");
      set({ recommendations: res.data, loading: false });
    },

    resolveRecommendation: async (id) => {
      await api.patch(`/rec/${id}/resolve`);

      // remove locally (instant UX)
      set({
        recommendations: get().recommendations.filter(
          (r) => r._id !== id
        ),
      });
    },
  })
);
