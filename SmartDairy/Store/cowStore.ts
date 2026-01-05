import { create } from "zustand";
import { api } from "../hooks/api";

export interface CowPayload {
  name: string;
  breed: string;
  birthDate: string;
  ageInMonths: number;
  color?: string | null;
  weight?: number | null;
  status: "Active" | "Inactive";
}

interface CowState {
  isCreating: boolean;
  error: string | null;
  createCow: (data: CowPayload) => Promise<void>;
}

export const useCowStore = create<CowState>((set) => ({
  isCreating: false,
  error: null,

  createCow: async (data) => {
    try {
      set({ isCreating: true, error: null });

      await api.post("/cows", data);
    } catch (err: any) {
      console.error("Create cow failed:", err);
      set({
        error:
          err?.response?.data?.message ??
          "Failed to create cow",
      });

      throw err; // 👈 important (explained below)
    } finally {
      set({ isCreating: false });
    }
  },
}));
export interface Cow {
  _id: string;
  name: string;
  breed: string;
}

interface CowListState {
  cows: Cow[];
  isLoading: boolean;
  fetchCows: () => Promise<void>;
}

export const useCowListStore = create<CowListState>((set) => ({
  cows: [],
  isLoading: false,

  fetchCows: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/cows");
      set({ cows: res.data });
    } finally {
      set({ isLoading: false });
    }
  },
}));