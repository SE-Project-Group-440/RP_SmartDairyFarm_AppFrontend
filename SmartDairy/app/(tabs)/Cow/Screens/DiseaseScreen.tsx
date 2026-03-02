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


const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

export default function DiseaseScreen() {
  const [image, setImage] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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

      const res = await axios.post(
        `${baseURL}/cattle/disease/predict`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err: any) {
      Alert.alert(
        "Prediction Failed",
        err.response?.data?.message || "Server error"
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

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          className={`rounded-xl py-4 items-center mb-10 ${
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

        {/* Result */}
        {result && (
          <View className="bg-white p-4 rounded-xl shadow-sm mb-10">
            <Text className="text-center text-green-700 text-lg font-bold mb-3">
              🐄 Prediction Result
            </Text>

            <Text className="font-semibold">Final Decision</Text>
            <Text className="text-green-600 font-bold mb-3">
              {result.final_decision}
            </Text>

            {result.image_prediction && (
              <>
                <Text className="font-semibold">Image Prediction</Text>
                <Text className="mb-3 text-sm">{result.image_prediction}</Text>
              </>
            )}

            {result.blood_report && (
              <>
                <Text className="font-semibold mb-1">Blood Report Overview</Text>
                <ScrollView className="max-h-48 border border-slate-200 rounded-lg p-2">
                  <Text selectable className="text-xs leading-5">
                    {result.blood_report}
                  </Text>
                </ScrollView>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
