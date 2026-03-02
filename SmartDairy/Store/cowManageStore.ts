import { create } from "zustand";
import { api } from "../hooks/api";

export interface CowProfile {
  _id: string;
  cowId: string;
  name: string;
  breed: string;
  birthDate: string;
  ageInMonths: number;
  status: string;

  lactationRound?: number;
  lactationDay?: number;
  avgMilk?: number;
}


interface CowManageState {
  cows: CowProfile[];
  isLoading: boolean;
  error: string | null;

  fetchCows: () => Promise<void>;
}

export const useCowManageStore = create<CowManageState>((set) => ({
  cows: [],
  isLoading: false,
  error: null,

  fetchCows: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get("/cows/cowsummary");
      set({ cows: res.data });
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message ??
          "Failed to load cows",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
