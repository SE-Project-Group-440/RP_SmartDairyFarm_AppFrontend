import { View, Text, Pressable, ScrollView, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export type DiseaseScreen = "home" | "prediction";

interface DiseaseHomeScreenProps {
  onNavigate: (screen: DiseaseScreen) => void;
}

export default function DiseaseHomeScreen({ onNavigate }: DiseaseHomeScreenProps) {
  const goToPrediction = () => {
    Keyboard.dismiss(); // Prevents aria-hidden warnings
    onNavigate("prediction");
    console.log("Navigating to DiseaseScreen");
  };

  const uploadOptions = [
    {
      title: "📷 Upload Cattle Image",
      desc: "Analyze visible symptoms using image recognition",
    },
    {
      title: "📄 Upload Medical Report",
      desc: "OCR-based analysis of laboratory reports",
    },
    {
      title: "📝 Enter Symptoms",
      desc: "Manual symptom-based disease detection",
    },
  ];

return (
  <ScrollView className="flex-1 bg-slate-100">
    {/* HEADER */}
    <View className="bg-green-600 px-6 pt-12 pb-10 rounded-b-3xl">
      <Text className="text-white text-2xl font-bold">
        Healthy Cows, Better Yield 🐄
      </Text>
      <Text className="text-green-100 text-sm mt-1">
        AI-Powered Disease Detection
      </Text>
    </View>

    <View className="px-6 -mt-6">
      {/* TOP STATS — SINGLE ROW */}
      <View className="flex-row justify-between mb-5">
        {[
          {
            label: "Cows",
            value: "24",
            icon: "paw",
            color: "#16a34a",
          },
          {
            label: "Last Check",
            value: "2h",
            icon: "time",
            color: "#2563eb",
          },
          {
            label: "Alerts",
            value: "2",
            icon: "alert-circle",
            color: "#dc2626",
          },
          {
            label: "Healthy",
            value: "22",
            icon: "heart",
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
            2 cows need attention
          </Text>
        </View>
        <Text className="text-red-500 text-xs ml-6">
          Cow #12 and #18 showing symptoms
        </Text>
      </View>

      {/* QUICK ACTIONS */}
      <Text className="text-lg font-semibold text-slate-800 mb-3">
        Quick Actions
      </Text>

      <View className="flex-row justify-between mb-6">
        <Pressable
          onPress={goToPrediction}
          className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm"
        >
          <Ionicons name="camera" size={26} color="#16a34a" />
          <Text className="font-semibold mt-2">
            Upload Cattle Image
          </Text>
          <Text className="text-xs text-slate-500 mt-1">
            Take or upload photo
          </Text>
        </Pressable>

        <Pressable
          onPress={goToPrediction}
          className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm"
        >
          <Ionicons name="document-text" size={26} color="#7c3aed" />
          <Text className="font-semibold mt-2">
            Upload Medical Report
          </Text>
          <Text className="text-xs text-slate-500 mt-1">
            Scan or upload report
          </Text>
        </Pressable>
      </View>

      {/* FEATURES — SAME SIZE AS QUICK ACTIONS */}
      <View className="flex-row justify-between mb-8">
        <View className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm items-center">
          <Ionicons name="analytics" size={26} color="#16a34a" />
          <Text className="font-semibold mt-2">
            Disease Prediction
          </Text>
          <Text className="text-xs text-slate-500 mt-1 text-center">
            AI-powered analysis
          </Text>
        </View>

        <View className="bg-white w-[48%] rounded-2xl p-4 border border-slate-200 shadow-sm items-center">
          <Ionicons name="time-outline" size={26} color="#2563eb" />
          <Text className="font-semibold mt-2">
            Health History
          </Text>
          <Text className="text-xs text-slate-500 mt-1 text-center">
            View past records
          </Text>
        </View>
      </View>

      {/* CTA */}
      <Pressable
        onPress={goToPrediction}
        className="bg-green-600 rounded-2xl py-4 items-center mb-10"
      >
        <Text className="text-white text-lg font-bold">
          🔍 Start Disease Prediction
        </Text>
      </Pressable>
    </View>
  </ScrollView>
);

}
