import { create } from "zustand";
import { api } from "../hooks/api";

interface MilkingRecord {
  _id: string;
  milkingDay: number;
  date: string | null;
  dailyMilk: number;
  morning: number;
  evening: number;
  night?: number;
  notes?: string;
}

interface LactationCycle {
  _id: string;
  lactationRound: number;
  LactationStatus: string;
  healthStatus: string;
  milkingRecords: MilkingRecord[];
}

interface CowProfileData {
  cow: any;
  lactationCycles: LactationCycle[];
}

interface CowProfileState {
  data: CowProfileData | null;
  isLoading: boolean;
  error: string | null;

  fetchCowProfile: (cowId: string) => Promise<void>;
  clearProfile: () => void;
  deleteCow: (cowId: string) => Promise<void>;
}

export const useCowProfileStore = create<CowProfileState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchCowProfile: async (cowId) => {
    try {
      set({ isLoading: true, error: null });

      const res = await api.get(`/cows/lact/milk/${cowId}`);

      set({ data: res.data });
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message ??
          "Failed to load cow profile",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCow: async (cowId) => {
    try {
      set({ isLoading: true, error: null });
      // soft delete (cull / died)
      await api.put(`/cows/${cowId}`, {
        status: "Inactive"
      });
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message ??
          "Failed to remove cow",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearProfile: () => set({ data: null }),
}));
