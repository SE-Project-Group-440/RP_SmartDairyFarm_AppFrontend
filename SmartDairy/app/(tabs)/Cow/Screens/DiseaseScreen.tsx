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

    if (res.canceled) return;

    setReport({
      uri: res.assets[0].uri,
      name: res.assets[0].name,
      mimeType: res.assets[0].mimeType,
    });
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async () => {
    console.log("🚀 handleSubmit CALLED");

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
      console.log("🔐 TOKEN FROM STORAGE:", token);
      if (!token) {
        Alert.alert("Authentication Error", "Token not found");
        return;
      }

      const baseURL =
        Platform.OS === "android" || Platform.OS === "ios"
          ? "http://192.168.1.15:8000" // your PC LAN IP
          : "http://192.168.1.15:8000"; // web

      const res = await axios.post(
        `${baseURL}/cattle/disease/predict`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API RESPONSE:", res.data);
      setResult(res.data); // store as object
    } catch (err: any) {
      console.log("UPLOAD ERROR:", err.response?.data || err.message);
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
    <ScrollView className="flex-1 px-6 py-4 bg-slate-50">
      <Text className="text-lg font-bold mb-4">Cattle Disease Prediction</Text>

      <Pressable
        onPress={pickImage}
        className={`p-4 rounded-lg mb-2 ${
          image ? "bg-green-200" : "bg-slate-200"
        }`}
      >
        <Text>{image ? "Image Selected ✅" : "Select Cattle Image"}</Text>
      </Pressable>

      <Pressable
        onPress={pickReport}
        className={`p-4 rounded-lg mb-2 ${
          report ? "bg-green-200" : "bg-slate-200"
        }`}
      >
        <Text>{report ? "Report Selected ✅" : "Select Report (PDF/Image)"}</Text>
      </Pressable>

      <TextInput
        placeholder="Symptoms (comma separated)"
        value={symptoms}
        onChangeText={setSymptoms}
        className="bg-white p-3 rounded-lg mb-3 border border-slate-300"
      />

      <Pressable
        onPress={handleSubmit}
        className="bg-green-600 p-3 rounded-lg items-center mb-4"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Predict Disease</Text>
        )}
      </Pressable>

      {result && (
        <View className="bg-white p-4 rounded-lg border border-slate-200 mb-6">
          <Text className="text-xl font-bold mb-3 text-center text-green-700">
            🐄 Prediction Result
          </Text>

          <Text className="font-bold">Final Decision:</Text>
          <Text className="mb-3 text-lg font-semibold text-green-600">
            {result.final_decision}
          </Text>

          {result.image_prediction && (
            <>
              <Text className="font-bold">Image Prediction:</Text>
              <Text className="mb-3">{result.image_prediction}</Text>
            </>
          )}

          {result.blood_report && (
            <>
              <Text className="font-bold">Blood Report (OCR):</Text>
              <ScrollView
                style={{
                  maxHeight: 200,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  marginBottom: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  selectable
                  style={{ fontSize: 12, lineHeight: 18, color: "#111" }}
                >
                  {result.blood_report}
                </Text>
              </ScrollView>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}
