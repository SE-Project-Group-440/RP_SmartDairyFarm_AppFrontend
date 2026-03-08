import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTranslation from "../../../../hooks/useTranslation";

interface DiseasePredictionInfoScreenProps {
  onBack: () => void;
}

export default function DiseasePredictionInfoScreen({ onBack }: DiseasePredictionInfoScreenProps) {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const infoSections = [
    {
      id: "methods",
      title: t("disease", "detectionMethods"),
      icon: "options" as any,
      color: "#16a34a",
      content: [
        t("disease", "uploadPhotoAnalysis"),
        t("disease", "scanMedicalReports"), 
        t("disease", "enterSymptomsManually")
      ]
    },
    {
      id: "diseases",
      title: t("disease", "whatWeDetect"),
      icon: "medical" as any,
      color: "#16a34a",
      content: [
        t("disease", "footMouthDisease"),
        t("disease", "lumpySkinDisease"),
        t("disease", "respiratoryIssues"),
        t("disease", "otherCommonDiseases")
      ]
    },
    {
      id: "accuracy",
      title: t("disease", "systemFeatures"), 
      icon: "checkmark-circle" as any,
      color: "#16a34a",
      content: [
        t("disease", "accuracyRate"),
        t("disease", "instantResults"),
        t("disease", "careInstructionsIncluded"),
        t("disease", "trackHistory")
      ]
    }
  ];

  const stats = [
    { label: t("disease", "predictions"), value: "10K+", icon: "analytics" as any, color: "#16a34a" },
    { label: t("disease", "accuracy"), value: "92%", icon: "checkmark-circle" as any, color: "#16a34a" },
    { label: t("disease", "diseases"), value: "2", icon: "medical" as any, color: "#16a34a" }
  ];

  return (
    <ScrollView className="flex-1 bg-slate-100">
      {/* HEADER */}
      <View className="bg-green-600 px-6 pt-12 pb-10 rounded-b-3xl">
        <View className="flex-row items-center mb-4">
          <Pressable onPress={onBack} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">
            {t("disease", "diseasePrediction")}
          </Text>
        </View>
        <Text className="text-green-100 text-sm">
          {t("disease", "aiPoweredAnalysis")}
        </Text>
      </View>

      <View className="px-6 -mt-6">
        {/* STATS OVERVIEW */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm">
          <Text className="text-lg font-semibold mb-4">{t("disease", "systemOverview")}</Text>
          <View className="flex-row justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <Ionicons name={stat.icon} size={24} color={stat.color} />
                <Text className="text-lg font-bold mt-1" style={{ color: stat.color }}>
                  {stat.value}
                </Text>
                <Text className="text-xs text-slate-500 text-center">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* EXPANDABLE INFO SECTIONS */}
        <Text className="text-lg font-semibold text-slate-800 mb-4">
          {t("disease", "howItWorks")}
        </Text>

        {infoSections.map((section) => (
          <View key={section.id} className="bg-white rounded-2xl mb-4 border border-slate-200 shadow-sm overflow-hidden">
            <Pressable 
              onPress={() => toggleSection(section.id)}
              className="p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name={section.icon} size={24} color={section.color} />
                <Text className="text-lg font-semibold ml-3 flex-1">
                  {section.title}
                </Text>
              </View>
              <Ionicons 
                name={expandedSection === section.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#64748b" 
              />
            </Pressable>
            
            {expandedSection === section.id && (
              <View className="px-4 pb-4 border-t border-slate-100">
                {section.content.map((item, index) => (
                  <Text key={index} className="text-slate-600 text-sm mb-2 leading-5">
                    {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* HOW TO GET STARTED */}
        <View className="bg-green-600 rounded-2xl p-6 mb-6">
          <Text className="text-white text-xl font-bold mb-3">
            {t("disease", "getStarted")}
          </Text>
          <Text className="text-green-100 text-sm mb-4">
            {t("disease", "chooseMethodDetect")}
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">1</Text>
              </View>
              <Text className="text-white text-sm flex-1">
                {t("disease", "selectMethod")}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">2</Text>
              </View>
              <Text className="text-white text-sm flex-1">
                {t("disease", "uploadEnterInfo")}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">3</Text>
              </View>
              <Text className="text-white text-sm flex-1">
                {t("disease", "getResultsCare")}
              </Text>
            </View>
          </View>
        </View>

        {/* DISCLAIMER */}
        <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-10">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={20} color="#d97706" />
            <Text className="text-amber-700 font-semibold ml-2">{t("disease", "note")}</Text>
          </View>
          <Text className="text-amber-600 text-sm leading-5">
            {t("disease", "consultVeterinarian")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}