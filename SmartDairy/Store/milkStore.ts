import { create } from "zustand";
import { api } from "../hooks/api";

export interface MilkPayload {
  cowId: string;
  dailyMilk: number;
  morning: number;
  evening: number;
  notes?: string;
}

interface MilkState {
  isSubmitting: boolean;
  error: string | null;
  submitMilk: (data: MilkPayload) => Promise<void>;
}

export const useMilkStore = create<MilkState>((set) => ({
  isSubmitting: false,
  error: null,

  submitMilk: async (data) => {
    try {
      set({ isSubmitting: true, error: null });
      await api.post("/milktoml", data);
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message ??
          "Milk submission failed",
      });
      throw err;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));