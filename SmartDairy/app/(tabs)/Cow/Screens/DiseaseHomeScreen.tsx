import { View, Text, Pressable, ScrollView, Keyboard } from "react-native";

export type DiseaseScreen = "home" | "prediction";

interface DiseaseHomeScreenProps {
  onNavigate: (screen: DiseaseScreen) => void;
}

export default function DiseaseHomeScreen({ onNavigate }: DiseaseHomeScreenProps) {
  const goToPrediction = () => {
    Keyboard.dismiss(); // prevents aria-hidden warning
    onNavigate("prediction");
    console.log("Navigating to DiseaseScreen");
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 py-6">
      {/* Header */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-2xl font-bold text-slate-800 mb-2">
          🐄 Cattle Disease Detection
        </Text>
        <Text className="text-slate-500 leading-6">
          Predict cattle diseases using AI-powered image analysis, medical
          reports, and symptoms.
        </Text>
      </View>

      {/* Upload Options */}
      <View className="space-y-4 mb-6">
        <Text className="text-lg font-semibold text-slate-700">
          Get Started
        </Text>

        {[
          { title: "📷 Upload Cattle Image", desc: "Analyze visible symptoms" },
          { title: "📄 Upload Medical Report", desc: "OCR-based analysis" },
          { title: "📝 Enter Symptoms", desc: "Manual symptom input" },
        ].map((item, index) => (
          <Pressable
            key={index}
            onPress={goToPrediction}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <Text className="text-lg font-semibold mb-1">
              {item.title}
            </Text>
            <Text className="text-slate-500">{item.desc}</Text>
          </Pressable>
        ))}
      </View>

      {/* CTA */}
      <Pressable
        onPress={goToPrediction}
        className="bg-green-600 rounded-2xl py-4 items-center mb-8"
      >
        <Text className="text-white text-lg font-bold">
          🔍 Predict Disease Now
        </Text>
      </Pressable>
    </ScrollView>
  );
}
