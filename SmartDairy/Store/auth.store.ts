import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  email: string;
  admintype?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isHydrated: boolean;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  login: async (user, token) => {
    await AsyncStorage.setItem("token", token);
    set({ user, token });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ user: null, token: null });
  },

  hydrate: async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      // Optional: fetch user details using token
      set({ token });
    }

    set({ isHydrated: true });
  },
}));
