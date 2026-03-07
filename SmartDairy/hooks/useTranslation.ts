import { useLanguageStore, Language } from "../Store/language.store";
import translations from "../constants/translations.json";

type TranslationKeys = {
  common: {
    back: string;
    backToDashboard: string;
    save: string;
    done: string;
    dismiss: string;
    tryAgain: string;
    error: string;
    success: string;
    loading: string;
    noData: string;
  };
  disease: {
    diseaseDetection: string;
    uploadImage: string;
    uploadBloodReport: string;
    enterSymptoms: string;
    analyzeNow: string;
    analyzing: string;
    results: string;
    predictionHistory: string;
    clearHistory: string;
    noHistory: string;
    
    // Image upload
    imageUpload: string;
    takePhoto: string;
    selectFromGallery: string;
    imageSelected: string;
    noImageSelected: string;
    
    // Blood report upload
    bloodReportUpload: string;
    selectBloodReport: string;
    bloodReportSelected: string;
    noBloodReportSelected: string;
    
    // Symptoms
    symptoms: string;
    enterSymptomsHere: string;
    symptomsPlaceholder: string;
    
    // Predictions
    finalDecision: string;
    imageAnalysis: string;
    bloodReportAnalysis: string;
    confidence: string;
    
    // Diseases
    fmd: string;
    lsd: string;
    healthy: string;
    
    // Care instructions
    careInstructions: string;
    prevention: string;
    treatment: string;
    monitoring: string;
    
    // Errors
    authenticationError: string;
    tokenNotFound: string;
    provideAtLeastOneInput: string;
    predictionFailed: string;
    
    // Loading states
    loadingCareInstructions: string;
    
    // History
    predictionDate: string;
    viewDetails: string;
  };
};

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  
  const t = (section: keyof TranslationKeys, key: string): string => {
    const langData = translations[language as Language];
    if (!langData) return key;
    
    const sectionData = langData[section];
    if (!sectionData) return key;
    
    return sectionData[key] || key;
  };
  
  return { t, language };
};

export default useTranslation;