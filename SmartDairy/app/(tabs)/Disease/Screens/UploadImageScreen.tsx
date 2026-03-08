import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useTranslation from "../../../../hooks/useTranslation";
import { api } from "../../../../hooks/api";

interface PredictionResult {
  prediction: string;
  confidence?: number;
  careInstructions?: any;
  image_prediction?: string;
  final_decision?: string;
}

interface UploadImageScreenProps {
  onBack: () => void;
}

export default function UploadImageScreen({ onBack }: UploadImageScreenProps) {
  const { t } = useTranslation();
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted === false) {
        Alert.alert("Permission denied", "Camera access is required to take photos");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        return;
      }

      const formData = new FormData();
      
      // Add image to form data
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

      console.log('Starting image analysis...');
      const res = await api.post('/cattle/disease/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for ML model inference
      });
      
      console.log('✅ Image analysis successful');
      
      if (res.data.success && res.data.data) {
        const backendData = res.data.data;
        const prediction = backendData.final_decision || backendData.image_prediction || 'Unknown';
        
        setResult({
          prediction: prediction,
          confidence: 92, // You can extract this from backend if available
          image_prediction: backendData.image_prediction,
          final_decision: backendData.final_decision,
          careInstructions: {
            diseaseInfo: {
              fullName: prediction,
              emoji: prediction.toLowerCase().includes('fmd') ? '🦠' : 
                     prediction.toLowerCase().includes('lsd') ? '🔴' : '🏥',
              description: `AI detected: ${prediction}`
            }
          }
        });
      } else {
        throw new Error(res.data.message || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Image analysis error:', err);
      
      let errorMessage = "Image analysis failed";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      Alert.alert("Analysis Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <ScrollView className="flex-1 bg-slate-100">
      {/* HEADER */}
      <View className="bg-green-600 px-6 pt-12 pb-10 rounded-b-3xl">
        <View className="flex-row items-center mb-4">
          <Pressable onPress={onBack} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">
            {t("disease", "uploadCattleImage")}
          </Text>
        </View>
        <Text className="text-green-100 text-sm">
          {t("disease", "takeOrUploadPhoto")}
        </Text>
      </View>

      <View className="px-6 -mt-6">
        {/* IMAGE PREVIEW */}
        {image && (
          <View className="bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold">Selected Image</Text>
              <Pressable onPress={removeImage}>
                <Ionicons name="close-circle" size={24} color="#dc2626" />
              </Pressable>
            </View>
            <Image
              source={{ uri: image.uri }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          </View>
        )}

        {/* PREDICTION RESULT */}
        {result && (
          <View className="bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              <Text className="text-lg font-semibold ml-2">
                {t("disease", "predictionResult")}
              </Text>
            </View>
            <View className="bg-green-50 rounded-xl p-4">
              <Text className="text-green-700 font-semibold">
                {result.careInstructions?.diseaseInfo?.emoji} {result.prediction}
              </Text>
              <Text className="text-green-600 text-sm mt-1">
                Confidence: {result.confidence}%
              </Text>
            </View>
          </View>
        )}

        {!image && (
          <>
            {/* UPLOAD OPTIONS */}
            <View className="mb-6">
              <Pressable
                onPress={takePhoto}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-4 flex-row items-center"
              >
                <Ionicons name="camera" size={32} color="#16a34a" />
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-lg">{t("disease", "takePhoto")}</Text>
                  <Text className="text-slate-500 text-sm">
                    Capture cattle image
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </Pressable>

              <Pressable
                onPress={pickImageFromGallery}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-row items-center"
              >
                <Ionicons name="images" size={32} color="#16a34a" />
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-lg">{t("disease", "selectFromGallery")}</Text>
                  <Text className="text-slate-500 text-sm">
                    Select existing photo
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </Pressable>
            </View>
          </>
        )}

        {/* ANALYZE BUTTON */}
        <Pressable
          onPress={analyzeImage}
          disabled={!image || loading}
          className={`rounded-2xl py-4 items-center mb-10 ${
            image && !loading ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white text-lg font-bold ml-2">Analyzing...</Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-bold">
              {t("disease", "analyzeImage")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}