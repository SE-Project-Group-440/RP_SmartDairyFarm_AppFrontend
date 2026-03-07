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
import {AiRecommendationScreen} from "../AIPrediction/AiRecommendationScreen";
import AiHomeScreen from "../AIPrediction/AIHomeScreen";


import  CattleListScreen  from "../(tabs)/cattleHeat/Screens/CattleListScreen";
import  DairyManagementScreen  from "../(tabs)/Cow/Screens/DairyManagementScreen";
import  ProfileScreen  from "../(tabs)/Cow/Screens/ProfileScreen";
import DiseaseHomeScreen, { DiseaseScreen } from "../(tabs)/Disease/Screens/DiseaseHomeScreen";
import DiseaseScreenComponent from "../(tabs)/Disease/Screens/DiseaseScreen";

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
        return diseaseScreen === "home" ? (
          <DiseaseHomeScreen onNavigate={setDiseaseScreen} />
        ) : (
          <DiseaseScreenComponent />
        );

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
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2">
        <View className="flex-row items-center justify-around">
          {/* Dairy */}
          <Pressable
            onPress={() => {
              setCurrentTab("Dairy");
              setDairyScreen("dashboard");
            }}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "Dairy"
                ? "bg-green-50"
                : ""
            }`}
          >
            <Milk
              size={24}
              color={
                currentTab === "Dairy"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "Dairy"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              Dairy
            </Text>
          </Pressable>

          {/* Feature 2 */}
          <Pressable
            onPress={() => setCurrentTab("Chatbot")}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "Chatbot"
                ? "bg-green-50"
                : ""
            }`}
          >
            <Package
              size={24}
              color={
                currentTab === "Chatbot"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
            numberOfLines={2}
              className={`text-xs ${
                currentTab === "Chatbot"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              
              උපදේශක
            </Text>
          </Pressable>

          {/* Feature 3 */}
          <Pressable
            onPress={() => setCurrentTab("HeatStress")}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "HeatStress"
                ? "bg-green-50"
                : ""
            }`}
          >
            <TrendingUp
              size={24}
              color={
                currentTab === "HeatStress"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "HeatStress"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              HeatStress
            </Text>
          </Pressable>

          {/* Feature 4 */}
          <Pressable
            onPress={() => {
              setCurrentTab("Health");
              setDiseaseScreen("home");
            }}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "Health"
                ? "bg-green-50"
                : ""
            }`}
          >
            <TrendingUp
              size={24}
              color={
                currentTab === "Health"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "Health"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              {t("common", "health")}
            </Text>
          </Pressable>


          {/* Profile */}
          <Pressable
            onPress={() => setCurrentTab("profile")}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "profile"
                ? "bg-green-50"
                : ""
            }`}
          >
            <User
              size={24}
              color={
                currentTab === "profile"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "profile"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
