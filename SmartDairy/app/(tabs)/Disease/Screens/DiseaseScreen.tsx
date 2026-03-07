import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useTranslation from "../../../../hooks/useTranslation";
import { translateInstructionArray } from "../../../../utils/careInstructionTranslator";
import { api } from "../../../../hooks/api";

// Types for better type safety
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

interface PredictionResult {
  prediction: string;
  careInstructions?: CareInstructions;
  hasCareInstructions?: boolean;
  // Additional backend fields
  image_prediction?: string;
  blood_report?: string;
  blood_analysis?: {
    status: string;
    confidence: number;
    parameters: {
      lymphocyte_status?: string;
      wbc_status?: string;
    };
    health_flags: string[];
    abnormal_indicators: number;
    total_parameters_found: number;
    interpretation: {
      lymphocyte_check?: string;
      wbc_check?: string;
    };
  };
  final_decision?: string;
}

const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

export default function DiseaseScreen() {
  const { t, language } = useTranslation();
  const [image, setImage] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const navigation = useNavigation();

  // Predefined symptoms based on the ML model
  const availableSymptoms = [
    // FMD symptoms (weight 2)
    { id: 'salivation', label: t("disease", "salivation") || 'Salivation', category: 'FMD' },
    { id: 'blisters', label: t("disease", "blisters") || 'Blisters', category: 'FMD' },
    // FMD symptoms (weight 1)
    { id: 'fever', label: t("disease", "fever") || 'Fever', category: 'FMD' },
    { id: 'lameness', label: t("disease", "lameness") || 'Lameness', category: 'FMD' },
    // LSD symptoms (weight 2)
    { id: 'nodules', label: t("disease", "nodules") || 'Nodules', category: 'LSD' },
    { id: 'skin lesions', label: t("disease", "skinLesions") || 'Skin Lesions', category: 'LSD' },
    // LSD symptoms (weight 1)
    { id: 'swollen lymph nodes', label: t("disease", "swollenLymphNodes") || 'Swollen Lymph Nodes', category: 'LSD' },
    { id: 'nasal discharge', label: t("disease", "nasalDischarge") || 'Nasal Discharge', category: 'LSD' },
    // Common symptom (weight 1 for both)
    { id: 'reduced appetite', label: t("disease", "reducedAppetite") || 'Reduced Appetite', category: 'Both' },
  ];

  // Function to toggle symptom selection
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  // Helper function to translate disease names
  const getDiseaseTranslation = (disease: string): string => {
    const diseaseKey = disease?.toLowerCase();
    if (diseaseKey?.includes('fmd') || diseaseKey?.includes('foot') || diseaseKey?.includes('mouth')) {
      return t("disease", "fmd");
    }
    if (diseaseKey?.includes('lsd') || diseaseKey?.includes('lumpy') || diseaseKey?.includes('skin')) {
      return t("disease", "lsd");
    }
    if (diseaseKey?.includes('healthy') || diseaseKey?.includes('normal')) {
      return t("disease", "healthy");
    }
    if (diseaseKey?.includes('uncertain')) {
      return t("disease", "uncertain") || "Uncertain";
    }
    if (diseaseKey?.includes('unknown')) {
      return t("disease", "unknown") || "Unknown";
    }
    return disease; // Return original if no match
  };

  // Helper function to translate care section titles
  const translateSectionTitle = (title: string): string => {
    const titleKey = title?.toLowerCase();
    if (titleKey?.includes('immediate')) {
      return t("disease", "immediateActions");
    }
    if (titleKey?.includes('care') || titleKey?.includes('treatment')) {
      return t("disease", "careAndTreatment");
    }
    if (titleKey?.includes('vector')) {
      return t("disease", "vectorControl");
    }
    if (titleKey?.includes('monitoring')) {
      return t("disease", "monitoring");
    }
    if (titleKey?.includes('prevention')) {
      return t("disease", "prevention");
    }
    return title; // Return original if no match
  };

  /* -------------------- Pick Cattle Image -------------------- */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) setImage(res.assets[0]);
  };

  /* -------------------- Pick Report (PDF OR Image) -------------------- */
  const pickReport = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });

    if (!res.canceled && res.assets?.length > 0) {
      const file = res.assets[0];

      setReport({
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
      });
    }
  };

  /* -------------------- Get Care Instructions (Optional) -------------------- */
  const getCareInstructions = async (diseaseType: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token available for care instructions");
        return null;
      }

      console.log(`Fetching care instructions for: ${diseaseType}`);
      const res = await api.get(`/cattle/disease/care/${encodeURIComponent(diseaseType)}`, {
        timeout: 15000, // 15 seconds for care instructions
      });

      console.log('Care instructions response:', res.data);
      
      if (res.data.success && res.data.data) {
        return res.data.data;
      } else {
        console.log('Care API response structure issue:', res.data);
        return null;
      }
    } catch (err: any) {
      console.error('Failed to fetch care instructions:', err.response?.status, err.message);
      
      // Don't show alert for automatic fetching, just log the error
      if (err.response?.status === 404) {
        console.log('Care instructions not available for:', diseaseType);
      } else if (err.response?.status === 400) {
        console.log('Invalid disease type for care instructions:', diseaseType);
      } else if (err.code === 'ECONNABORTED') {
        console.log('Care instructions request timed out');
      }
      
      return null;
    }
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async () => {
    if (!image && !report && selectedSymptoms.length === 0) {
      Alert.alert(t("disease", "provideAtLeastOneInput"));
      return;
    }

    const formData = new FormData();

    /* ---------- IMAGE ---------- */
    if (image) {
      if (Platform.OS === "web") {
        const blob = await uriToBlob(image.uri);
        formData.append("image", blob, "cow.jpg");
      } else {
        formData.append("image", {
          uri: image.uri,
          name: image.fileName || "cow.jpg",
          type: "image/jpeg",
        } as any);
      }
    }

    /* ---------- REPORT ---------- */
    if (report) {
      if (Platform.OS === "web") {
        const blob = await uriToBlob(report.uri);
        formData.append("report", blob, report.name);
      } else {
        formData.append("report", {
          uri: report.uri,
          name: report.name,
          type: report.mimeType || "application/pdf",
        } as any);
      }
    }

    // Convert selected symptoms array to string for backend
    if (selectedSymptoms.length > 0) {
      const symptomsString = selectedSymptoms.join(', ');
      formData.append("symptoms", symptomsString);
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(t("disease", "authenticationError"), t("disease", "tokenNotFound"));
        return;
      }

      // Use the configured API instance with extended timeout for ML operations
      console.log('Attempting disease prediction...');
      console.log('Form data prepared with image:', !!image, 'report:', !!report, 'symptoms:', selectedSymptoms.length > 0, 'selected symptoms:', selectedSymptoms);

      const res = await api.post('/cattle/disease/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for ML model inference
      });
      
      console.log('✅ Disease prediction successful');

      // Handle the backend response structure
      if (res.data.success && res.data.data) {
        const backendData = res.data.data;
        console.log('Raw backend response:', backendData);
        
        // Map backend response to frontend structure
        const prediction = backendData.final_decision || backendData.image_prediction || 'Unknown';
        
        // Create the result object with proper structure
        const mappedResult: PredictionResult = {
          prediction: prediction,
          // Store additional backend data for display
          image_prediction: backendData.image_prediction,
          blood_report: backendData.blood_report,
          blood_analysis: backendData.blood_analysis,
          final_decision: backendData.final_decision,
        };

        console.log('Mapped result:', mappedResult);
        
        // Only try to fetch care instructions for actual disease predictions
        const validDiseases = ['FMD', 'LSD', 'Foot and Mouth Disease', 'Lumpy Skin Disease'];
        const shouldFetchCare = prediction && 
                               prediction !== 'Unknown' && 
                               prediction !== 'Uncertain' && 
                               prediction !== 'Healthy' &&
                               validDiseases.some(disease => 
                                 prediction.toLowerCase().includes(disease.toLowerCase())
                               );
        
        if (shouldFetchCare) {
          try {
            console.log(`Fetching care instructions for: ${prediction}`);
            const careData = await getCareInstructions(prediction);
            if (careData && careData.careInstructions) {
              mappedResult.careInstructions = careData.careInstructions;
              mappedResult.hasCareInstructions = true;
              console.log('✅ Added care instructions to result');
            }
          } catch (error) {
            console.log('⚠️ Could not fetch care instructions:', error);
            mappedResult.hasCareInstructions = false;
          }
        } else {
          console.log(`ℹ️ Skipping care instructions for prediction: ${prediction}`);
          mappedResult.hasCareInstructions = false;
        }
        
        setResult(mappedResult);
      } else {
        throw new Error(res.data.message || 'Prediction failed');
      }
    } catch (err: any) {
      console.error('Disease prediction error:', err);
      
      let errorMessage = t("disease", "predictionFailed");
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. The AI model is taking longer than expected. Please try again.";
      } else if (err.response?.status === 404) {
        errorMessage = "Disease prediction service not found. Please contact support.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (err.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      Alert.alert(
        t("common", "error"),
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <ScrollView className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl flex-row items-center">
        {/* Back Button */}
        <Pressable
          onPress={() => navigation.goBack()}
          className="absolute left-6 top-12"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-white text-lg font-semibold text-center">
            {t("disease", "diseaseDetection")}
          </Text>
          <Text className="text-green-100 text-center mt-1 text-sm">
            {t("disease", "uploadImage")} {t("disease", "enterSymptoms")}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="px-6 -mt-6">
        {/* Cow ID */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <Text className="text-xs text-slate-500 mb-1">
            Cow ID or Name (Optional)
          </Text>
          <TextInput
            placeholder="e.g., Cow #12 or Bella"
            placeholderTextColor="#94a3b8"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </View>

        {/* Section 1: Image */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <Text className="font-semibold mb-1">1. {t("disease", "imageUpload")}</Text>
          <Text className="text-xs text-slate-500 mb-3">
            {t("disease", "uploadImage")}
          </Text>

          <Pressable
            onPress={pickImage}
            className="bg-green-100 border border-green-300 rounded-lg py-3 items-center mb-3 flex-row justify-center"
          >
            <Text className="text-green-700 font-medium mr-2">
              📷 {t("disease", "takePhoto")}
            </Text>
            {image && <Text className="text-green-700 font-bold">✅ {t("disease", "imageSelected")}</Text>}
          </Pressable>

          <Pressable
            onPress={pickImage}
            className="bg-blue-50 border border-blue-300 rounded-lg py-3 items-center flex-row justify-center"
          >
            <Text className="text-blue-700 font-medium mr-2">
              ⬆ {t("disease", "selectFromGallery")}
            </Text>
            {image && <Text className="text-green-700 font-bold">✅ {t("disease", "imageSelected")}</Text>}
          </Pressable>
        </View>

        {/* Section 2: Report */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <Text className="font-semibold mb-1">2. {t("disease", "bloodReportUpload")}</Text>
          <Text className="text-xs text-slate-500 mb-3">
            {t("disease", "uploadBloodReport")}
          </Text>

          <Pressable
            onPress={pickReport}
            className="bg-purple-50 border border-purple-300 rounded-lg py-3 items-center flex-row justify-center"
          >
            <Text className="text-purple-700 font-medium mr-2">
              📄 {t("disease", "selectBloodReport")}
            </Text>
            {report && <Text className="text-green-700 font-bold">✅ {t("disease", "bloodReportSelected")}</Text>}
          </Pressable>
        </View>

        {/* Section 3: Symptoms */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <Text className="font-semibold mb-1">3. {t("disease", "symptoms")}</Text>
          <Text className="text-xs text-slate-500 mb-3">
            Select observed symptoms (multiple selection allowed)
          </Text>

          {/* Selected Symptoms Count */}
          {selectedSymptoms.length > 0 && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
              <Text className="text-green-700 text-xs font-medium">
                ✅ {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected: {selectedSymptoms.join(', ')}
              </Text>
            </View>
          )}

          {/* Symptoms Grid */}
          <View className="flex-row flex-wrap gap-2">
            {availableSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              
              return (
                <Pressable
                  key={symptom.id}
                  onPress={() => toggleSymptom(symptom.id)}
                  className={`px-3 py-2 rounded-lg border-2 flex-row items-center ${
                    isSelected
                      ? 'bg-green-100 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Text 
                    className={`text-xs font-medium ${
                      isSelected
                        ? 'text-green-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{symptom.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Warning */}
        {!image && !report && selectedSymptoms.length === 0 && (
          <View className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-4">
            <Text className="text-orange-700 text-xs">
              ⚠ {t("disease", "provideAtLeastOneInput")}
            </Text>
          </View>
        )}


        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          className={`rounded-xl py-4 items-center mb-4 ${
            loading
              ? "bg-green-400"
              : image || report || selectedSymptoms.length > 0
              ? "bg-green-600"
              : "bg-slate-300"
          }`}
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#fff" />
              <Text className="text-white font-semibold text-base ml-2">
                {t("disease", "analyzing")}
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              🔍 {t("disease", "analyzeNow")}
            </Text>
          )}
        </Pressable>

        {/* ===================== PREDICTION RESULT ===================== */}
        {result && (
          <View className="bg-white p-5 rounded-2xl shadow-sm mb-10">
            {/* Header */}
            <Text className="text-center text-green-700 text-xl font-bold mb-4">
              🐄 {t("disease", "results")}
            </Text>

            {/* Main Prediction */}
            <View className={`rounded-xl p-4 mb-4 ${
              (result.final_decision || result.prediction)?.toLowerCase().includes('uncertain') ||
              (result.final_decision || result.prediction)?.toLowerCase().includes('unknown')
                ? 'bg-yellow-50 border border-yellow-300'
                : 'bg-green-50 border border-green-300'
            }`}>
              <Text className="text-xs text-slate-500 mb-1">
                {t("disease", "finalDecision")}
              </Text>
              <Text className={`text-lg font-bold ${
                (result.final_decision || result.prediction)?.toLowerCase().includes('uncertain') ||
                (result.final_decision || result.prediction)?.toLowerCase().includes('unknown')
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}>
                {getDiseaseTranslation(result.final_decision || result.prediction || t("disease", "healthy"))}
              </Text>
              
              {/* Uncertain prediction guidance */}
              {((result.final_decision || result.prediction)?.toLowerCase().includes('uncertain') ||
                (result.final_decision || result.prediction)?.toLowerCase().includes('unknown')) && (
                <View className="mt-3 pt-3 border-t border-yellow-200">
                  <Text className="text-yellow-800 text-sm font-medium mb-2">
                    ℹ️ {t("disease", "uncertainGuidanceHeader")}
                  </Text>
                  <Text className="text-yellow-700 text-xs leading-5">
                    • {t("disease", "uncertainReason1")}{'\n'}
                    • {t("disease", "uncertainReason2")}{'\n'}
                    • {t("disease", "uncertainReason3")}{'\n'}
                    • {t("disease", "uncertainReason4")}
                  </Text>
                </View>
              )}
            </View>

            {/* Additional Prediction Info */}
            {result.image_prediction && (
              <View className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-4">
                <Text className="text-xs text-slate-500 mb-1">
                  {t("disease", "imageAnalysis")}
                </Text>
                <Text className="text-base font-semibold text-blue-700">
                  {getDiseaseTranslation(result.image_prediction)}
                </Text>
              </View>
            )}

            {/* Blood Analysis Prediction */}
            {result.blood_analysis && (
              <View className={`rounded-xl p-4 mb-4 ${
                result.blood_analysis.status?.toLowerCase() === 'unhealthy'
                  ? 'bg-red-50 border border-red-300'
                  : 'bg-green-50 border border-green-300'
              }`}>
                <Text className="text-xs text-slate-500 mb-1">
                  📋 {t("disease", "bloodAnalysisPrediction")}
                </Text>
                <Text className={`text-base font-semibold mb-2 ${
                  result.blood_analysis.status?.toLowerCase() === 'unhealthy'
                    ? 'text-red-700'
                    : 'text-green-700'
                }`}>
                  {result.blood_analysis.status?.toUpperCase()} 
                  <Text className="text-xs font-normal text-slate-600">
                    ({Math.round((result.blood_analysis.confidence || 0) * 100)}% {t("disease", "confidence").toLowerCase()})
                  </Text>
                </Text>
                
                {/* Health Indicators */}
                {result.blood_analysis.health_flags && result.blood_analysis.health_flags.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-xs text-slate-600 mb-1">{t("disease", "healthIndicators")}:</Text>
                    {result.blood_analysis.health_flags.map((flag, index) => (
                      <Text key={index} className="text-xs text-red-600 mb-1">
                        • {flag.replace('_', ' ').toUpperCase()}
                      </Text>
                    ))}
                  </View>
                )}
                
                {/* Parameter Status */}
                {result.blood_analysis.parameters && (
                  <View className="mt-2 pt-2 border-t border-gray-200">
                    <Text className="text-xs text-slate-600 mb-1">{t("disease", "parameterAnalysis")}:</Text>
                    {Object.entries(result.blood_analysis.parameters).map(([key, value]) => (
                      <Text key={key} className={`text-xs mb-1 ${
                        value === 'high' ? 'text-red-600' : 
                        value === 'low' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        • {key.replace('_', ' ').toUpperCase()}: {value?.toUpperCase()}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Blood Report */}
            {result.blood_report && (
              <View className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-4">
                <Text className="text-xs text-slate-500 mb-2">
                  📋 {t("disease", "bloodReportAnalysis")}
                </Text>
                <ScrollView className="max-h-48">
                  <Text selectable className="text-xs leading-5 text-gray-700">
                    {result.blood_report}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* Care Instructions */}
            {result.hasCareInstructions && result.careInstructions && (
              <View>
                {/* Care Instructions Header */}
                <View className="bg-indigo-50 border border-indigo-300 rounded-xl p-4 mb-4">
                  <Text className="text-indigo-700 font-semibold text-base text-center">
                    📋 {t("disease", "careInstructions")}
                  </Text>
                </View>

                {/* ================= DISEASE INFO ================= */}
                {result.careInstructions.diseaseInfo && (
                  <View className="mb-4">
                    <Text className="font-semibold text-base mb-1">
                      {result.careInstructions.diseaseInfo.emoji}{" "}
                      {result.careInstructions.diseaseInfo.fullName}
                    </Text>
                    <Text className="text-sm text-slate-600">
                      {result.careInstructions.diseaseInfo.description}
                    </Text>
                  </View>
                )}

                {/* ================= IMMEDIATE ACTIONS ================= */}
                {result.careInstructions.immediateActions && (
                  <View className="bg-red-50 border border-red-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-red-700 mb-2">
                      {translateSectionTitle(result.careInstructions.immediateActions.title)}
                    </Text>
                    {result.careInstructions.immediateActions.actions?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-red-800 mb-1">
                          • {translateInstructionArray([item], language)[0]}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= CARE & TREATMENT ================= */}
                {result.careInstructions.care && (
                  <View className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-blue-700 mb-2">
                      {translateSectionTitle(result.careInstructions.care.title)}
                    </Text>
                    {result.careInstructions.care.treatments?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-blue-800 mb-1">
                          • {translateInstructionArray([item], language)[0]}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= VECTOR CONTROL (For LSD) ================= */}
                {result.careInstructions.vectorControl && (
                  <View className="bg-purple-50 border border-purple-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-purple-700 mb-2">
                      {translateSectionTitle(result.careInstructions.vectorControl.title)}
                    </Text>
                    {result.careInstructions.vectorControl.measures?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-purple-800 mb-1">
                          • {translateInstructionArray([item], language)[0]}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= MONITORING ================= */}
                {result.careInstructions.monitoring && (
                  <View className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-yellow-700 mb-2">
                      {translateSectionTitle(result.careInstructions.monitoring.title)}
                    </Text>
                    {result.careInstructions.monitoring.symptoms?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-yellow-800 mb-1">
                          • {translateInstructionArray([item], language)[0]}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= PREVENTION ================= */}
                {result.careInstructions.prevention && (
                  <View className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-green-700 mb-2">
                      {translateSectionTitle(result.careInstructions.prevention.title)}
                    </Text>
                    {result.careInstructions.prevention.measures?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-green-800 mb-1">
                          • {translateInstructionArray([item], language)[0]}
                        </Text>
                      )
                    )}
                  </View>
                )}
              </View>
            )}

            {/* No care instructions available */}
            {!result.hasCareInstructions && (
              <View className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                <Text className="text-gray-600 text-sm text-center">
                  ℹ️ {t("disease", "noCareInstructions")}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

