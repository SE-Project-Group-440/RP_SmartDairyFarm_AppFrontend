import { create } from "zustand";
import { api } from "../hooks/api";

type CowPayload = {
  name?: string;
  breed?: string;
  birthDate?: string;
  ageInMonths?: number;
  color?: string;
  weight?: number;
  status?: string;
};

type CowState = {
  loading: boolean;
  createCow: (data: CowPayload) => Promise<void>;
};

export const useCowStore = create<CowState>((set) => ({
  loading: false,

  createCow: async (data) => {
    try {
      set({ loading: true });
      await api.post("/cows", data);
    } finally {
      set({ loading: false });
    }
  },
}));
