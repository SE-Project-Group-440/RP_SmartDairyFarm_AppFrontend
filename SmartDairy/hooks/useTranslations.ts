import { useLanguageStore } from "@/Store/language.store";
import translations from "@/constants/translations.json";

type TranslationKey = keyof typeof translations.english;

export const useTranslations = () => {
  const language = useLanguageStore((state) => state.language);

  const t = (section: string, key: string): string => {
    try {
      const langTranslations = translations[language as keyof typeof translations];
      const sectionTranslations = langTranslations[section as TranslationKey];
      
      if (sectionTranslations && typeof sectionTranslations === "object") {
        const value = sectionTranslations[key as keyof typeof sectionTranslations];
        return typeof value === "string" ? value : key;
      }
      
      return key;
    } catch (error) {
      console.warn(`Translation not found: ${section}.${key}`);
      return key;
    }
  };

  return { t, language };
};
