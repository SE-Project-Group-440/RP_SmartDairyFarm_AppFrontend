import { useState } from "react";
import {
  View,
  Text,
  Pressable,
} from "react-native";
import {
  Milk,
  Bot,
  Thermometer,
  HeartPulse,
  User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTranslation from "../../hooks/useTranslation";

import ChatScreen from "./SinhalaVoiceAssistedChat/chatbot";
import CattleListScreen from "../(tabs)/cattleHeat/Screens/CattleListScreen";
import DairyManagementScreen from "../(tabs)/Cow/Screens/DairyManagementScreen";
import ProfileScreen from "../(tabs)/Cow/Screens/ProfileScreen";

import DiseaseHomeScreen, {
  DiseaseScreen,
} from "../(tabs)/Disease/Screens/DiseaseHomeScreen";
import DiseaseScreenComponent from "../(tabs)/Disease/Screens/DiseaseScreen";
import UploadImageScreen from "../(tabs)/Disease/Screens/UploadImageScreen";
import UploadReportScreen from "../(tabs)/Disease/Screens/UploadReportScreen";
import HealthHistoryScreen from "../(tabs)/Disease/Screens/HealthHistoryScreen";
import DiseasePredictionInfoScreen from "../(tabs)/Disease/Screens/DiseasePredictionInfoScreen";

export type MainTab =
  | "Dairy"
  | "Chatbot"
  | "HeatStress"
  | "Health"
  | "profile";

export type DairyScreen =
  | "dashboard"
  | "add-cow"
  | "cow-list"
  | "cow-profile"
  | "milk-entry"
  | "analytics"
  | "forecasting"
  | "alerts"
  | "recommendations"
  | "history";

export default function LactationCurveHome() {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] =
    useState<MainTab>("Dairy");

  const [dairyScreen, setDairyScreen] =
    useState<DairyScreen>("dashboard");

  const [diseaseScreen, setDiseaseScreen] =
    useState<DiseaseScreen>("home");

  const [selectedCowId, setSelectedCowId] =
    useState<string | null>(null);

  const handleCowSelect = (cowId: string) => {
    setSelectedCowId(cowId);
    setDairyScreen("cow-profile");
  };

  const renderMainContent = () => {
    switch (currentTab) {
      case "Dairy":
        return (
          <DairyManagementScreen
            currentScreen={dairyScreen}
            onNavigate={setDairyScreen}
            selectedCowId={selectedCowId}
            onCowSelect={handleCowSelect}
          />
        );

      case "Chatbot":
        return <ChatScreen />;

      case "HeatStress":
        return <CattleListScreen />;

      case "Health":
        switch (diseaseScreen) {
          case "home":
            return <DiseaseHomeScreen onNavigate={setDiseaseScreen} />;
          case "prediction":
            return <DiseaseScreenComponent />;
          case "uploadImage":
            return <UploadImageScreen onBack={() => setDiseaseScreen("home")} />;
          case "uploadReport":
            return <UploadReportScreen onBack={() => setDiseaseScreen("home")} />;
          case "healthHistory":
            return <HealthHistoryScreen onBack={() => setDiseaseScreen("home")} />;
          case "diseasePredictionInfo":
            return <DiseasePredictionInfoScreen onBack={() => setDiseaseScreen("home")} />;
          default:
            return <DiseaseHomeScreen onNavigate={setDiseaseScreen} />;
        }

      case "profile":
        return <ProfileScreen />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Main Content */}
      <View className="flex-1 pb-20">
        {renderMainContent()}
      </View>

      {/* Bottom Tab Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-1 py-2">
        <View className="flex-row items-center justify-between">

          {/* 🐄 Dairy */}
          <Pressable
            onPress={() => {
              setCurrentTab("Dairy");
              setDairyScreen("dashboard");
            }}
            className={`flex-1 items-center py-2 rounded-xl ${
              currentTab === "Dairy" ? "bg-green-50" : ""
            }`}
          >
            <Milk size={22} color={currentTab === "Dairy" ? "#15803d" : "#475569"} />
            <Text numberOfLines={1} className={`text-xs ${currentTab === "Dairy" ? "text-green-700" : "text-slate-600"}`}>
              🐄 Dairy
            </Text>
          </Pressable>

          {/* 🤖 Chatbot */}
          <Pressable
            onPress={() => setCurrentTab("Chatbot")}
            className={`flex-1 items-center py-2 rounded-xl ${
              currentTab === "Chatbot" ? "bg-green-50" : ""
            }`}
          >
            <Bot size={22} color={currentTab === "Chatbot" ? "#15803d" : "#475569"} />
            <Text numberOfLines={1} className={`text-xs ${currentTab === "Chatbot" ? "text-green-700" : "text-slate-600"}`}>
              🤖 AI
            </Text>
          </Pressable>

          {/* 🌡️ Heat */}
          <Pressable
            onPress={() => setCurrentTab("HeatStress")}
            className={`flex-1 items-center py-2 rounded-xl ${
              currentTab === "HeatStress" ? "bg-green-50" : ""
            }`}
          >
            <Thermometer size={22} color={currentTab === "HeatStress" ? "#15803d" : "#475569"} />
            <Text numberOfLines={1} className={`text-xs ${currentTab === "HeatStress" ? "text-green-700" : "text-slate-600"}`}>
              🌡️ Heat
            </Text>
          </Pressable>

          {/* ❤️ Health */}
          <Pressable
            onPress={() => {
              setCurrentTab("Health");
              setDiseaseScreen("home");
            }}
            className={`flex-1 items-center py-2 rounded-xl ${
              currentTab === "Health" ? "bg-green-50" : ""
            }`}
          >
            <HeartPulse size={22} color={currentTab === "Health" ? "#15803d" : "#475569"} />
            <Text numberOfLines={1} className={`text-xs ${currentTab === "Health" ? "text-green-700" : "text-slate-600"}`}>
              ❤️ Health
            </Text>
          </Pressable>

          {/* 👤 Profile */}
          <Pressable
            onPress={() => setCurrentTab("profile")}
            className={`flex-1 items-center py-2 rounded-xl ${
              currentTab === "profile" ? "bg-green-50" : ""
            }`}
          >
            <User size={22} color={currentTab === "profile" ? "#15803d" : "#475569"} />
            <Text numberOfLines={1} className={`text-xs ${currentTab === "profile" ? "text-green-700" : "text-slate-600"}`}>
              👤 Profile
            </Text>
          </Pressable>

        </View>
      </View>
    </SafeAreaView>
  );
}