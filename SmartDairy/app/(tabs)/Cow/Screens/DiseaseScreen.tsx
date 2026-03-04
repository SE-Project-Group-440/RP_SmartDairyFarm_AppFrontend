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
import { useLanguageStore } from "../../../../Store/language.store";

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
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const navigation = useNavigation();

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
        Alert.alert(t("disease", "authenticationError"), t("disease", "tokenNotFound"));
        return;
      }

      const baseURL =
        Platform.OS === "android" || Platform.OS === "ios"
          ? "http://192.168.1.15:8000"
          : "http://192.168.1.15:8000";

      // Based on your backend setup: app.use("/cattle", cattleDiseaseRoutes)
      const correctEndpoint = `${baseURL}/cattle/disease/care/${diseaseType}`;

      console.log(`Trying correct endpoint: ${correctEndpoint}`);
      const res = await axios.get(correctEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
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
      }
      
      return null;
    }
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async () => {
    if (!image && !report && !symptoms) {
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

    if (symptoms) formData.append("symptoms", symptoms);

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(t("disease", "authenticationError"), t("disease", "tokenNotFound"));
        return;
      }

      const baseURL =
        Platform.OS === "android" || Platform.OS === "ios"
          ? "http://192.168.1.15:8000"
          : "http://192.168.1.15:8000"; 

      // Based on your backend setup: app.use("/cattle", cattleDiseaseRoutes)
      const correctEndpoint = `${baseURL}/cattle/disease/predict`;

      console.log('Attempting to connect to:', correctEndpoint);
      console.log('Form data prepared with image:', !!image, 'report:', !!report, 'symptoms:', !!symptoms);

      const res = await axios.post(correctEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10 second timeout
      });
      
      console.log('✅ Success with correct endpoint:', correctEndpoint);

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
          final_decision: backendData.final_decision,
        };

        console.log('Mapped result:', mappedResult);
        
        // Try to fetch care instructions for the predicted disease
        if (prediction && prediction !== 'Unknown') {
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
        }
        
        setResult(mappedResult);
      } else {
        throw new Error(res.data.message || 'Prediction failed');
      }
    } catch (err: any) {
      console.error('Disease prediction error:', err);
      Alert.alert(
        t("common", "error"),
        err.response?.data?.message || err.message || t("disease", "predictionFailed")
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
          <Text className="text-xs text-slate-500 mb-2">
            {t("disease", "enterSymptoms")}
          </Text>

          <TextInput
            placeholder={t("disease", "symptomsPlaceholder")}
            placeholderTextColor="#94a3b8"
            value={symptoms}
            onChangeText={setSymptoms}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </View>

        {/* Warning */}
        {!image && !report && !symptoms && (
          <View className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-4">
            <Text className="text-orange-700 text-xs">
              ⚠ {t("disease", "provideAtLeastOneInput")}
            </Text>
          </View>
        )}

        {/* Backend info */}
        <View className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4">
          <Text className="text-blue-700 text-xs font-semibold mb-1">
            ℹ️ How predictions work:
          </Text>
          <Text className="text-blue-600 text-xs">
            1. AI analyzes your inputs → Gets disease prediction{'\n'}
            2. App automatically fetches care instructions for the predicted disease{'\n'}
            3. Shows complete results with treatment guidance
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          className={`rounded-xl py-4 items-center mb-4 ${
            loading
              ? "bg-green-400"
              : image || report || symptoms
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
            <View className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4">
              <Text className="text-xs text-slate-500 mb-1">
                {t("disease", "finalDecision")}
              </Text>
              <Text className="text-lg font-bold text-green-700">
                {getDiseaseTranslation(result.final_decision || result.prediction || t("disease", "healthy"))}
              </Text>
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

