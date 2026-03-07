import React from "react";

import { DairyDashboard } from "../../../../components/cow/DairyDashboard";
import { AddCowScreen } from "../../../../components/cow/AddCowScreen";
import { CowListScreen } from "../../../../components/cow/CowListScreen";
import CowProfileScreen from "../../Cow/Screens/CowProfileScreen";
import { MilkEntryScreen } from "../../../../components/cow/MilkEntryScreen";
import  AnalyticsForecastingScreen  from "../../../../components/cow/AnalyticsForecastingScreen";
import { AlertsRecommendationsScreen } from "../../../../components/cow/AlertsRecommendationsScreen";
import { HistoryScreen } from "../../../../components/cow/HistoryScreen";

import type { DairyScreen } from "../LactationCurveHome";

interface DairyManagementScreenProps {
  currentScreen: DairyScreen;
  onNavigate: (screen: DairyScreen) => void;
  selectedCowId: string | null;
  onCowSelect: (cowId: string) => void;
}

export default function DairyManagementScreen({
  currentScreen,
  onNavigate,
  selectedCowId,
  onCowSelect,
}: DairyManagementScreenProps) {
  switch (currentScreen) {
    case "dashboard":
      return (
        <DairyDashboard
          onNavigate={onNavigate}
          onCowSelect={onCowSelect}
        />
      );

    case "add-cow":
      return (
        <AddCowScreen
          onBack={() => onNavigate("dashboard")}
        />
      );

    case "cow-list":
      return (
        <CowListScreen
          onCowSelect={onCowSelect}
          onBack={() => onNavigate("dashboard")}
        />
      );

    case "cow-profile":
      return (
        <CowProfileScreen
          cowId={selectedCowId}
          onBack={() => onNavigate("cow-list")}
        />
      );

    case "milk-entry":
      return (
        <MilkEntryScreen
          onBack={() => onNavigate("dashboard")}
        />
      );

    case "analytics":
      return (
        <AnalyticsForecastingScreen
          onBack={() => onNavigate("dashboard")}
        />
      );

    case "alerts":
    case "recommendations":
      return (
        <AlertsRecommendationsScreen
          onCowSelect={onCowSelect}
          onBack={() => onNavigate("dashboard")}
        />
      );

    case "history":
      return (
        <HistoryScreen
          onBack={() => onNavigate("dashboard")}
        />
      );

    default:
      return (
        <DairyDashboard
          onNavigate={onNavigate}
          onCowSelect={onCowSelect}
        />
      );
  }
}
