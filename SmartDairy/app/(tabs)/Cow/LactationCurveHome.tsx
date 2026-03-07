import { useState } from "react";
import {
  View,
  Text,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Milk, Package, TrendingUp, User } from "lucide-react-native";

import  DairyManagementScreen  from "./Screens/DairyManagementScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import DiseaseScreen from "../Disease/Screens/DiseaseScreen";

export type MainTab =
  | "dairy"
  | "Samudra"
  | "Anjana"
  | "Dinidi"
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
  const [currentTab, setCurrentTab] =
    useState<MainTab>("dairy");
  const [dairyScreen, setDairyScreen] =
    useState<DairyScreen>("dashboard");
  const [selectedCowId, setSelectedCowId] =
    useState<string | null>(null);

  const handleCowSelect = (cowId: string) => {
    setSelectedCowId(cowId);
    setDairyScreen("cow-profile");
  };

  const renderMainContent = () => {
    switch (currentTab) {
      case "dairy":
        return (
          <DairyManagementScreen
            currentScreen={dairyScreen}
            onNavigate={setDairyScreen}
            selectedCowId={selectedCowId}
            onCowSelect={handleCowSelect}
          />
        );

      case "Samudra":
        return (
          <View className="flex-1 items-center justify-center bg-slate-50 px-6">
            <View className="w-20 h-20 bg-slate-200 rounded-2xl items-center justify-center mb-4">
              <Package size={40} color="#94a3b8" />
            </View>
            <Text className="text-slate-900 mb-1">
              Samudra
            </Text>
            <Text className="text-slate-600 text-sm">
              Coming Soon
            </Text>
          </View>
        );

      case "Anjana":
        return (
          <View className="flex-1 items-center justify-center bg-slate-50 px-6">
            <View className="w-20 h-20 bg-slate-200 rounded-2xl items-center justify-center mb-4">
              <TrendingUp size={40} color="#94a3b8" />
            </View>
            <Text className="text-slate-900 mb-1">
              Anjana
            </Text>
            <Text className="text-slate-600 text-sm">
              Coming Soon
            </Text>
          </View>
        );

      case "Dinidi":
        return <DiseaseScreen />;

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
              setCurrentTab("dairy");
              setDairyScreen("dashboard");
            }}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "dairy"
                ? "bg-green-50"
                : ""
            }`}
          >
            <Milk
              size={24}
              color={
                currentTab === "dairy"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "dairy"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              Dairy
            </Text>
          </Pressable>

          {/* Feature 2 */}
          <Pressable
            onPress={() => setCurrentTab("Samudra")}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "Samudra"
                ? "bg-green-50"
                : ""
            }`}
          >
            <Package
              size={24}
              color={
                currentTab === "Samudra"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "Samudra"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              Samudra
            </Text>
          </Pressable>

          {/* Feature 3 */}
          <Pressable
            onPress={() => setCurrentTab("Anjana")}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "Anjana"
                ? "bg-green-50"
                : ""
            }`}
          >
            <TrendingUp
              size={24}
              color={
                currentTab === "Anjana"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "Anjana"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              Anjana
            </Text>
          </Pressable>

          {/* Feature 4 */}
          <Pressable
            onPress={() => setCurrentTab("Dinidi")}
            className={`items-center px-4 py-2 rounded-xl ${
              currentTab === "Dinidi"
                ? "bg-green-50"
                : ""
            }`}
          >
            <TrendingUp
              size={24}
              color={
                currentTab === "Dinidi"
                  ? "#15803d"
                  : "#475569"
              }
            />
            <Text
              className={`text-xs ${
                currentTab === "Dinidi"
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              Dinidi
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
