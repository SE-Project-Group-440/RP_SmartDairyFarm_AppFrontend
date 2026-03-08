import { View, Text, Pressable, ScrollView, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTranslation from "../../../../hooks/useTranslation";

type IconName = keyof typeof Ionicons.glyphMap;


export type DiseaseScreen = "home" | "prediction" | "uploadImage" | "uploadReport" | "healthHistory" | "diseasePredictionInfo";

interface DiseaseHomeScreenProps {
  onNavigate: (screen: DiseaseScreen) => void;
}

export default function DiseaseHomeScreen({ onNavigate }: DiseaseHomeScreenProps) {
  const { t } = useTranslation();
  
  const goToPrediction = () => {
    Keyboard.dismiss(); 
    onNavigate("prediction");
    console.log("Navigating to DiseaseScreen");
  };

  const goToUploadImage = () => {
    Keyboard.dismiss();
    onNavigate("uploadImage");
    console.log("Navigating to Upload Image Screen");
  };

  const goToUploadReport = () => {
    Keyboard.dismiss();
    onNavigate("uploadReport");
    console.log("Navigating to Upload Report Screen");
  };

  const goToHealthHistory = () => {
    Keyboard.dismiss();
    onNavigate("healthHistory");
    console.log("Navigating to Health History Screen");
  };

  const goToDiseasePredictionInfo = () => {
    Keyboard.dismiss();
    onNavigate("diseasePredictionInfo");
    console.log("Navigating to Disease Prediction Info Screen");
  };

  const uploadOptions = [
    {
      title: t("disease", "uploadCattleImage"),
      desc: t("disease", "aiPoweredAnalysis"),
    },
    {
      title: t("disease", "uploadMedicalReport"), 
      desc: "OCR-based analysis of laboratory reports",
    },
    {
      title: t("disease", "enterSymptoms"),
      desc: "Manual symptom-based disease detection",
    },
  ];

return (
  <ScrollView className="flex-1 bg-slate-100">
    {/* HEADER */}
    <View className="bg-green-600 px-6 pt-12 pb-10 rounded-b-3xl">
      <Text className="text-white text-2xl font-bold">
        {t("disease", "homeTitle")}
      </Text>
      <Text className="text-green-100 text-sm mt-1">
        {t("disease", "homeSubtitle")}
      </Text>
    </View>

    <View className="px-6 -mt-6">
      {/* TOP STATS — SINGLE ROW */}
      <View className="flex-row justify-between mb-5">
        {[
          {
            label: t("disease", "cows"),
            value: "24",
            icon: "paw" as IconName,
            color: "#16a34a",
          },
          {
            label: t("disease", "lastCheck"),
            value: "1min",
            icon: "time" as IconName,
            color: "#2563eb",
          },
          {
            label: t("disease", "alerts"),
            value: "2", 
            icon: "alert-circle" as IconName,
            color: "#dc2626",
          },
          {
            label: t("disease", "healthy"),
            value: "22",
            icon: "heart" as IconName,
            color: "#059669",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="bg-white w-[23%] rounded-xl p-3 items-center border border-slate-200 shadow-sm"
          >
            <Ionicons name={item.icon} size={18} color={item.color} />
            <Text className="text-sm font-bold mt-1 text-slate-800">
              {item.value}
            </Text>
            <Text className="text-[10px] text-slate-500 mt-0.5">
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* RISK ALERT */}
      <View className="border border-red-400 bg-red-50 rounded-xl p-4 mb-6">
        <View className="flex-row items-center mb-1">
          <Ionicons name="warning" size={18} color="#dc2626" />
          <Text className="text-red-600 font-semibold ml-2 text-sm">
            2 {t("disease", "cowsNeedAttention")}
          </Text>
        </View>
        <Text className="text-red-500 text-xs ml-6">
          Cow #12 and #18 {t("disease", "cowsShowingSymptoms")}
        </Text>
      </View>

      {/* QUICK ACTIONS */}
      <Text className="text-lg font-semibold text-slate-800 mb-3">
        {t("disease", "quickActions")}
      </Text>

      <View className="flex-row justify-between mb-6">
        <Pressable
          onPress={goToUploadImage}
          className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm"
        >
          <Ionicons name="camera" size={26} color="#16a34a" />
          <Text className="font-semibold mt-2">
            {t("disease", "uploadCattleImage")}
          </Text>
          <Text className="text-xs text-slate-500 mt-1">
            {t("disease", "takeOrUploadPhoto")}
          </Text>
        </Pressable>

        <Pressable
          onPress={goToUploadReport}
          className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm"
        >
          <Ionicons name="document-text" size={26} color="#7c3aed" />
          <Text className="font-semibold mt-2">
            {t("disease", "uploadMedicalReport")}
          </Text>
          <Text className="text-xs text-slate-500 mt-1">
            {t("disease", "scanOrUploadReport")}
          </Text>
        </Pressable>
      </View>

      {/* FEATURES — SAME SIZE AS QUICK ACTIONS */}
      <View className="flex-row justify-between mb-8">
        <Pressable
          onPress={goToDiseasePredictionInfo}
          className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm items-center"
        >
          <Ionicons name="analytics" size={26} color="#16a34a" />
          <Text className="font-semibold mt-2">
            {t("disease", "diseasePrediction")}
          </Text>
          <Text className="text-xs text-slate-500 mt-1 text-center">
            {t("disease", "aiPoweredAnalysis")}
          </Text>
        </Pressable>

        <Pressable
          onPress={goToHealthHistory}
          className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm items-center"
        >
          <Ionicons name="time-outline" size={26} color="#2563eb" />
          <Text className="font-semibold mt-2">
            {t("disease", "healthHistory")}
          </Text>
          <Text className="text-xs text-slate-500 mt-1 text-center">
            {t("disease", "viewPastRecords")}
          </Text>
        </Pressable>
      </View>

      {/* CTA */}
      <Pressable
        onPress={goToPrediction}
        className="bg-green-600 rounded-2xl py-4 items-center mb-10"
      >
        <Text className="text-white text-lg font-bold">
          {t("disease", "startDiseasePrediction")}
        </Text>
      </Pressable>
    </View>
  </ScrollView>
);

}
