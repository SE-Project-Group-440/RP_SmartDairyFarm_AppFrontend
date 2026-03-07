import { create } from "zustand";
import { api } from "../hooks/api";

// Types for Disease Prediction
interface DiseaseInfo {
  fullName: string;
  emoji: string;
  description: string;
}

interface ActionSection {
  title: string;
  actions?: string[];
  treatments?: string[];
  measures?: string[];
  symptoms?: string[];
}

interface CareInstructions {
  diseaseInfo?: DiseaseInfo;
  immediateActions?: ActionSection;
  care?: ActionSection;
  vectorControl?: ActionSection;
  monitoring?: ActionSection;
  prevention?: ActionSection;
}

export interface PredictionResult {
  prediction: string;
  careInstructions?: CareInstructions;
  hasCareInstructions?: boolean;
  // Additional backend fields
  image_prediction?: string;
  blood_report?: string;
  final_decision?: string;
}

export interface DiseasePredictionPayload {
  image?: {
    uri: string;
    name: string;
    type: string;
  };
  report?: {
    uri: string;
    name: string;
    type: string;
  };
  symptoms?: string;
}

interface DiseaseState {
  // State
  isPredicting: boolean;
  isFetchingCare: boolean;
  error: string | null;
  predictionResult: PredictionResult | null;
  
  // Actions
  predictDisease: (data: DiseasePredictionPayload) => Promise<PredictionResult>;
  getCareInstructions: (diseaseType: string) => Promise<CareInstructions | null>;
  clearResult: () => void;
  clearError: () => void;
}

export const useDiseaseStore = create<DiseaseState>((set, get) => ({
  // Initial State
  isPredicting: false,
  isFetchingCare: false,
  error: null,
  predictionResult: null,

  // Predict Disease Action
  predictDisease: async (data) => {
    try {
      set({ isPredicting: true, error: null });

      // Create FormData for multipart upload
      const formData = new FormData();

      if (data.image) {
        formData.append("image", data.image as any);
      }

      if (data.report) {
        formData.append("report", data.report as any);
      }

      if (data.symptoms) {
        formData.append("symptoms", data.symptoms);
      }

      // API call to disease prediction endpoint
      const res = await api.post("/cattle/disease/predict", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && res.data.data) {
        const backendData = res.data.data;
        
        // Map backend response to frontend structure
        const prediction = backendData.final_decision || backendData.image_prediction || 'Unknown';
        
        const mappedResult: PredictionResult = {
          prediction: prediction,
          image_prediction: backendData.image_prediction,
          blood_report: backendData.blood_report,
          final_decision: backendData.final_decision,
        };

        // Try to fetch care instructions automatically
        if (prediction && prediction !== 'Unknown') {
          try {
            const careData = await get().getCareInstructions(prediction);
            if (careData) {
              mappedResult.careInstructions = careData;
              mappedResult.hasCareInstructions = true;
            }
          } catch (error) {
            console.log('Could not fetch care instructions:', error);
            mappedResult.hasCareInstructions = false;
          }
        }

        set({ predictionResult: mappedResult });
        return mappedResult;
      } else {
        throw new Error(res.data.message || 'Prediction failed');
      }
    } catch (err: any) {
      console.error("Disease prediction failed:", err);
      const errorMessage = err?.response?.data?.message ?? "Disease prediction failed";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isPredicting: false });
    }
  },

  // Get Care Instructions Action
  getCareInstructions: async (diseaseType) => {
    try {
      set({ isFetchingCare: true, error: null });

      const res = await api.get(`/cattle/disease/care/${diseaseType}`);

      if (res.data.success && res.data.data) {
        return res.data.data.careInstructions || res.data.data;
      } else {
        return null;
      }
    } catch (err: any) {
      console.error("Failed to fetch care instructions:", err);
      
      // Don't set error for 404 (care instructions not available)
      if (err?.response?.status !== 404) {
        const errorMessage = err?.response?.data?.message ?? "Failed to get care instructions";
        set({ error: errorMessage });
      }
      
      return null;
    } finally {
      set({ isFetchingCare: false });
    }
  },

  // Clear Result Action
  clearResult: () => {
    set({ predictionResult: null, error: null });
  },

  // Clear Error Action
  clearError: () => {
    set({ error: null });
  },
}));

// Prediction History Store (Optional - for storing past predictions)
export interface PredictionHistoryItem {
  id: string;
  timestamp: Date;
  result: PredictionResult;
  inputs: {
    hasImage: boolean;
    hasReport: boolean;
    symptoms?: string;
  };
}

interface PredictionHistoryState {
  history: PredictionHistoryItem[];
  addToHistory: (result: PredictionResult, inputs: any) => void;
  clearHistory: () => void;
  getHistoryById: (id: string) => PredictionHistoryItem | null;
}

export const usePredictionHistoryStore = create<PredictionHistoryState>((set, get) => ({
  history: [],

  addToHistory: (result, inputs) => {
    const historyItem: PredictionHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      result,
      inputs: {
        hasImage: !!inputs.image,
        hasReport: !!inputs.report,
        symptoms: inputs.symptoms,
      },
    };

    set((state) => ({
      history: [historyItem, ...state.history].slice(0, 50), // Keep last 50 predictions
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },

  getHistoryById: (id) => {
    const { history } = get();
    return history.find(item => item.id === id) || null;
  },
}));
