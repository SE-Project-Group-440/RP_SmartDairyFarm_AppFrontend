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
  const [image, setImage] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const navigation = useNavigation();

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
        Alert.alert("Authentication Error", "Token not found");
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
      Alert.alert("Provide at least one input!");
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
        Alert.alert("Authentication Error", "Token not found");
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
        "Prediction Failed",
        err.response?.data?.message || err.message || "Server error"
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
            Disease Prediction
          </Text>
          <Text className="text-green-100 text-center mt-1 text-sm">
            Upload information for AI analysis
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
          <Text className="font-semibold mb-1">1. Cattle Image</Text>
          <Text className="text-xs text-slate-500 mb-3">
            Upload a clear image of visible symptoms
          </Text>

          <Pressable
            onPress={pickImage}
            className="bg-green-100 border border-green-300 rounded-lg py-3 items-center mb-3 flex-row justify-center"
          >
            <Text className="text-green-700 font-medium mr-2">
              📷 Take Photo
            </Text>
            {image && <Text className="text-green-700 font-bold">✅ Uploaded</Text>}
          </Pressable>

          <Pressable
            onPress={pickImage}
            className="bg-blue-50 border border-blue-300 rounded-lg py-3 items-center flex-row justify-center"
          >
            <Text className="text-blue-700 font-medium mr-2">
              ⬆ Upload from Gallery
            </Text>
            {image && <Text className="text-green-700 font-bold">✅ Uploaded</Text>}
          </Pressable>
        </View>

        {/* Section 2: Report */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <Text className="font-semibold mb-1">2. Medical Report (Optional)</Text>
          <Text className="text-xs text-slate-500 mb-3">
            AI will extract key values from your report
          </Text>

          <Pressable
            onPress={pickReport}
            className="bg-purple-50 border border-purple-300 rounded-lg py-3 items-center flex-row justify-center"
          >
            <Text className="text-purple-700 font-medium mr-2">
              📄 Upload Report
            </Text>
            {report && <Text className="text-green-700 font-bold">✅ Uploaded</Text>}
          </Pressable>
        </View>

        {/* Section 3: Symptoms */}
        <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
          <Text className="font-semibold mb-1">3. Symptoms</Text>
          <Text className="text-xs text-slate-500 mb-2">
            Select all visible symptoms
          </Text>

          <TextInput
            placeholder="Select symptoms..."
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
              ⚠ Please provide at least one input: cattle image, medical report, or symptoms
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              🔍 Predict Disease
            </Text>
          )}
        </Pressable>

        {/* ===================== PREDICTION RESULT ===================== */}
        {result && (
          <View className="bg-white p-5 rounded-2xl shadow-sm mb-10">
            {/* Header */}
            <Text className="text-center text-green-700 text-xl font-bold mb-4">
              🐄 Disease Prediction Result
            </Text>

            {/* Main Prediction */}
            <View className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4">
              <Text className="text-xs text-slate-500 mb-1">
                Final Decision
              </Text>
              <Text className="text-lg font-bold text-green-700">
                {result.final_decision || result.prediction || 'Unknown'}
              </Text>
            </View>

            {/* Additional Prediction Info */}
            {result.image_prediction && (
              <View className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-4">
                <Text className="text-xs text-slate-500 mb-1">
                  Image Analysis Result
                </Text>
                <Text className="text-base font-semibold text-blue-700">
                  {result.image_prediction}
                </Text>
              </View>
            )}

            {/* Blood Report */}
            {result.blood_report && (
              <View className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-4">
                <Text className="text-xs text-slate-500 mb-2">
                  📋 Blood Report Analysis
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
                      {result.careInstructions.immediateActions.title}
                    </Text>
                    {result.careInstructions.immediateActions.actions?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-red-800 mb-1">
                          • {item}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= CARE & TREATMENT ================= */}
                {result.careInstructions.care && (
                  <View className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-blue-700 mb-2">
                      {result.careInstructions.care.title}
                    </Text>
                    {result.careInstructions.care.treatments?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-blue-800 mb-1">
                          • {item}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= VECTOR CONTROL (For LSD) ================= */}
                {result.careInstructions.vectorControl && (
                  <View className="bg-purple-50 border border-purple-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-purple-700 mb-2">
                      {result.careInstructions.vectorControl.title}
                    </Text>
                    {result.careInstructions.vectorControl.measures?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-purple-800 mb-1">
                          • {item}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= MONITORING ================= */}
                {result.careInstructions.monitoring && (
                  <View className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-yellow-700 mb-2">
                      {result.careInstructions.monitoring.title}
                    </Text>
                    {result.careInstructions.monitoring.symptoms?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-yellow-800 mb-1">
                          • {item}
                        </Text>
                      )
                    )}
                  </View>
                )}

                {/* ================= PREVENTION ================= */}
                {result.careInstructions.prevention && (
                  <View className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4">
                    <Text className="font-semibold text-green-700 mb-2">
                      {result.careInstructions.prevention.title}
                    </Text>
                    {result.careInstructions.prevention.measures?.map(
                      (item: string, index: number) => (
                        <Text key={index} className="text-sm text-green-800 mb-1">
                          • {item}
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
                  ℹ️ No specific care instructions available for this prediction.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

