import React from "react";
import { View, Text, Pressable } from "react-native";
import { Milk, Package, TrendingUp, User, Brain } from "lucide-react-native";
import useTranslation from "../hooks/useTranslation";

export type NavTab = "Dairy" | "Chatbot" | "HeatStress" | "Health" | "profile" | "AI";

interface CommonFooterProps {
  currentTab: NavTab;
  onTabPress: (tab: NavTab) => void;
}

export function CommonFooter({ currentTab, onTabPress }: CommonFooterProps) {
  const { t } = useTranslation();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2">
      <View className="flex-row items-center justify-around">
        {/* Dairy */}
        <Pressable
          onPress={() => onTabPress("Dairy")}
          className={`items-center px-4 py-2 rounded-xl ${
            currentTab === "Dairy" ? "bg-green-50" : ""
          }`}
        >
          <Milk
            size={24}
            color={currentTab === "Dairy" ? "#15803d" : "#475569"}
          />
          <Text
            className={`text-xs ${
              currentTab === "Dairy" ? "text-green-700" : "text-slate-600"
            }`}
          >
            {t("common", "dairy")}
          </Text>
        </Pressable>

        {/* Chatbot */}
        <Pressable
          onPress={() => onTabPress("Chatbot")}
          className={`items-center px-4 py-2 rounded-xl ${
            currentTab === "Chatbot" ? "bg-green-50" : ""
          }`}
        >
          <Package
            size={24}
            color={currentTab === "Chatbot" ? "#15803d" : "#475569"}
          />
          <Text
            numberOfLines={2}
            className={`text-xs ${
              currentTab === "Chatbot" ? "text-green-700" : "text-slate-600"
            }`}
          >
            උපදේශක
          </Text>
        </Pressable>

        {/* HeatStress */}
        <Pressable
          onPress={() => onTabPress("HeatStress")}
          className={`items-center px-4 py-2 rounded-xl ${
            currentTab === "HeatStress" ? "bg-green-50" : ""
          }`}
        >
          <TrendingUp
            size={24}
            color={currentTab === "HeatStress" ? "#15803d" : "#475569"}
          />
          <Text
            className={`text-xs ${
              currentTab === "HeatStress" ? "text-green-700" : "text-slate-600"
            }`}
          >
            {t("common", "heatstress")}
          </Text>
        </Pressable>

        {/* Health */}
        <Pressable
          onPress={() => onTabPress("Health")}
          className={`items-center px-4 py-2 rounded-xl ${
            currentTab === "Health" ? "bg-green-50" : ""
          }`}
        >
          <TrendingUp
            size={24}
            color={currentTab === "Health" ? "#15803d" : "#475569"}
          />
          <Text
            className={`text-xs ${
              currentTab === "Health" ? "text-green-700" : "text-slate-600"
            }`}
          >
            {t("common", "health")}
          </Text>
        </Pressable>

        {/* Profile */}
        <Pressable
          onPress={() => onTabPress("profile")}
          className={`items-center px-4 py-2 rounded-xl ${
            currentTab === "profile" ? "bg-green-50" : ""
          }`}
        >
          <User
            size={24}
            color={currentTab === "profile" ? "#15803d" : "#475569"}
          />
          <Text
            className={`text-xs ${
              currentTab === "profile" ? "text-green-700" : "text-slate-600"
            }`}
          >
            {t("common", "profile")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
