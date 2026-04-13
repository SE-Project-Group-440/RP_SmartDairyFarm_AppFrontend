import { useState } from "react";
import {
  View,
  Text,
  Pressable,
} from "react-native";
import { Milk, Package, TrendingUp, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTranslation from "../../hooks/useTranslation";
import ChatScreen from "./SinhalaVoiceAssistedChat/chatbot";
import { AiRecommendationScreen } from "../AIPrediction/AiRecommendationScreen";
import AiHomeScreen from "../AIPrediction/AIHomeScreen";
import { CommonFooter, NavTab } from "../../components/CommonFooter";


import CattleListScreen from "../(tabs)/cattleHeat/Screens/CattleListScreen";
import DairyManagementScreen from "../(tabs)/Cow/Screens/DairyManagementScreen";
import ProfileScreen from "../(tabs)/Cow/Screens/ProfileScreen";
import DiseaseHomeScreen, { DiseaseScreen } from "../(tabs)/Disease/Screens/DiseaseHomeScreen";
import DiseaseScreenComponent from "../(tabs)/Disease/Screens/DiseaseScreen";
import UploadImageScreen from "../(tabs)/Disease/Screens/UploadImageScreen";
import UploadReportScreen from "../(tabs)/Disease/Screens/UploadReportScreen";
import HealthHistoryScreen from "../(tabs)/Disease/Screens/HealthHistoryScreen";
import DiseasePredictionInfoScreen from "../(tabs)/Disease/Screens/DiseasePredictionInfoScreen";

export type MainTab = NavTab;

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

  const [profileScreen, setProfileScreen] =
    useState<"home" | "ai">("home");

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
        if (profileScreen === "ai") {
          return <AiHomeScreen />;
        }
        return <ProfileScreen onNavigateToAI={() => setProfileScreen("ai")} />;

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

      <CommonFooter 
        currentTab={currentTab}
        onTabPress={(tab) => {
          setCurrentTab(tab);
          if (tab === "Dairy") setDairyScreen("dashboard");
          if (tab === "Health") setDiseaseScreen("home");
          if (tab === "profile") setProfileScreen("home");
        }}
      />
    </SafeAreaView>
  );
}
