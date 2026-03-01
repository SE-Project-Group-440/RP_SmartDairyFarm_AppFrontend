import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "english" | "sinhala" | "tamil";

type LanguageState = {
  language: Language;
  isHydrated: boolean;

  setLanguage: (language: Language) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "english",
  isHydrated: false,

  setLanguage: async (language) => {
    await AsyncStorage.setItem("language", language);
    set({ language });
  },

  hydrate: async () => {
    const savedLanguage = (await AsyncStorage.getItem("language")) as Language | null;
    
    if (savedLanguage && ["english", "sinhala", "tamil"].includes(savedLanguage)) {
      set({ language: savedLanguage });
    }

    set({ isHydrated: true });
  },
}));
