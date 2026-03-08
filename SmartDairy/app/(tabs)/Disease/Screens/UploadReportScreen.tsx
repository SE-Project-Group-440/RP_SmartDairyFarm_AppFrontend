import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  confidence?: number;
  careInstructions?: CareInstructions;
  hasCareInstructions?: boolean;
  reportAnalysis?: any;
  blood_report?: string;
  blood_analysis?: any;
  final_decision?: string;
}

interface UploadReportScreenProps {
  onBack: () => void;
}

export default function UploadReportScreen({ onBack }: UploadReportScreenProps) {
  const { t, language } = useTranslation();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

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
    return disease;
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
    return title;
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setReport(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const analyzeReport = async () => {
    if (!report) {
      Alert.alert("Error", "Please select a medical report first");
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
      
      // Add report to form data
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

      console.log('Starting report analysis...');
      const res = await api.post('/cattle/disease/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for OCR and analysis
      });
      
      console.log('✅ Report analysis successful');
      
      if (res.data.success && res.data.data) {
        const backendData = res.data.data;
        const prediction = backendData.final_decision || backendData.blood_report || 'Analysis Complete';
        
        // Create result with proper structure matching DiseaseScreen
        const mappedResult: PredictionResult = {
          prediction: prediction,
          confidence: backendData.blood_analysis?.confidence || 88,
          blood_report: backendData.blood_report,
          blood_analysis: backendData.blood_analysis,
          final_decision: backendData.final_decision,
          hasCareInstructions: false
        };

        // Try to fetch care instructions if we have a disease prediction
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
            // You can add care instruction fetching logic here if needed
            // const careData = await getCareInstructions(prediction);
            // if (careData && careData.careInstructions) {
            //   mappedResult.careInstructions = careData.careInstructions;
            //   mappedResult.hasCareInstructions = true;
            // }
          } catch (error) {
            console.log('⚠️ Could not fetch care instructions:', error);
          }
        }
        
        setResult(mappedResult);
      } else {
        throw new Error(res.data.message || 'Report analysis failed');
      }
    } catch (err: any) {
      console.error('Report analysis error:', err);
      
      let errorMessage = "Report analysis failed";
      
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

  const removeReport = () => {
    setReport(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            {t("disease", "uploadMedicalReport")}
          </Text>
        </View>
        <Text className="text-green-100 text-sm">
          {t("disease", "scanOrUploadReport")}
        </Text>
      </View>

      <View className="px-6 -mt-6">
        {/* REPORT PREVIEW */}
        {report && (
          <View className="bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold">Selected Report</Text>
              <Pressable onPress={removeReport}>
                <Ionicons name="close-circle" size={24} color="#dc2626" />
              </Pressable>
            </View>
            <View className="flex-row items-center p-3 bg-slate-50 rounded-xl">
              <Ionicons 
                name={report.mimeType?.includes('pdf') ? "document-text" : "image"} 
                size={32} 
                color="#7c3aed" 
              />
              <View className="ml-3 flex-1">
                <Text className="font-medium" numberOfLines={1}>
                  {report.name}
                </Text>
                <Text className="text-slate-500 text-sm">
                  {formatFileSize(report.size)}
                </Text>
              </View>
            </View>
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
            
            {/* Main Result */}
            <View className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4">
              <Text className="text-green-800 font-semibold text-base">
                🩺 {getDiseaseTranslation(result.prediction)}
              </Text>
            </View>

            {/* Blood Analysis */}
            {result.blood_analysis && (
              <View className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-4">
                <Text className="text-blue-700 font-semibold text-sm mb-2">
                  📊 {t("disease", "bloodAnalysisResults")}
                </Text>
                <Text className="text-sm font-semibold text-blue-800">
                  {result.blood_analysis.status?.toUpperCase()} 
                  <Text className="text-xs font-normal text-slate-600">
                    ({Math.round((result.blood_analysis.confidence || 0) * 100)}% {t("disease", "confidence").toLowerCase()})
                  </Text>
                </Text>
                
                {/* Health Indicators */}
                {result.blood_analysis.health_flags && result.blood_analysis.health_flags.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-xs text-slate-600 mb-1">{t("disease", "healthIndicators")}:</Text>
                    {result.blood_analysis.health_flags.map((flag: string, index: number) => (
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
                        • {key.replace('_', ' ').toUpperCase()}: {(value as string)?.toUpperCase()}
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

                {/* Disease Info */}
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

                {/* Immediate Actions */}
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

                {/* Care & Treatment */}
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

                {/* Vector Control */}
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

                {/* Monitoring */}
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

                {/* Prevention */}
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

        {!report && (
          <>
            {/* UPLOAD SECTION */}
            <Pressable
              onPress={pickDocument}
              className="bg-white rounded-2xl p-6 border-2 border-dashed border-green-300 mb-6 items-center"
            >
              <Ionicons name="cloud-upload-outline" size={48} color="#16a34a" />
              <Text className="text-lg font-semibold mt-3 text-slate-800">
                {t("disease", "chooseFile")}
              </Text>
              <Text className="text-slate-500 text-sm mt-1 text-center">
                Select PDF or image file
              </Text>
            </Pressable>

            {/* SUPPORTED FORMATS */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <Text className="font-semibold text-slate-800 mb-2">Supported:</Text>
              <View className="flex-row flex-wrap">
                <View className="bg-white rounded-full px-3 py-1 mr-2 mb-1">
                  <Text className="text-xs font-medium">PDF</Text>
                </View>
                <View className="bg-white rounded-full px-3 py-1 mr-2 mb-1">
                  <Text className="text-xs font-medium">JPG</Text>
                </View>
                <View className="bg-white rounded-full px-3 py-1 mr-2 mb-1">
                  <Text className="text-xs font-medium">PNG</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ANALYZE BUTTON */}
        <Pressable
          onPress={analyzeReport}
          disabled={!report || loading}
          className={`rounded-2xl py-4 items-center mb-10 ${
            report && !loading ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white text-lg font-bold ml-2">Processing...</Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-bold">
              {t("disease", "analyzeReport")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}