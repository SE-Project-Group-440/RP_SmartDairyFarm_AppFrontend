import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  AlertCircle,
  Eye,
  X,
  Lightbulb,
  Check,
  Clock,
} from "lucide-react-native";

interface AlertsRecommendationsScreenProps {
  onCowSelect: (cowId: string) => void;
  onBack: () => void;
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  cowId: string;
  cowName: string;
  timestamp: string;
}

interface Recommendation {
  id: string;
  type: "feed" | "supplement" | "health";
  title: string;
  description: string;
  reason: string;
  impact: string;
  urgency: "low" | "medium" | "high";
  cowName: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Sudden Milk Drop Detected",
    description: "Milk production decreased by 12% over the last 3 days",
    cowId: "2",
    cowName: "Bella",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "info",
    title: "Lactation Milestone",
    description: "Daisy has reached day 200 of lactation",
    cowId: "3",
    cowName: "Daisy",
    timestamp: "5 hours ago",
  },
];

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "feed",
    title: "Increase concentrated feed by 0.5kg",
    description: "Add 0.5kg of concentrated feed to evening meal",
    reason:
      "Milk yield is trending down for Bella. Increased energy intake may help stabilize production.",
    impact: "Expected yield increase: +1.5–2L per day within 3–5 days",
    urgency: "high",
    cowName: "Bella",
  },
  {
    id: "2",
    type: "supplement",
    title: "Add mineral supplement for 3 days",
    description: "Calcium and phosphorus supplement recommended",
    reason:
      "Bella is at lactation day 89, a critical period for mineral balance.",
    impact:
      "Helps prevent milk fever and supports consistent production",
    urgency: "medium",
    cowName: "Bella",
  },
];

export function AlertsRecommendationsScreen({
  onCowSelect,
  onBack,
}: AlertsRecommendationsScreenProps) {
  const [view, setView] = useState<"alerts" | "recommendations">("alerts");
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(
    new Set()
  );
  const [completedRecIds, setCompletedRecIds] = useState<Set<string>>(
    new Set()
  );

  const activeAlerts = mockAlerts.filter(
    (a) => !dismissedAlertIds.has(a.id)
  );


  const getAlertStyle = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "#dc2626",
          Icon: AlertCircle,
        };
      case "warning":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          iconBg: "bg-orange-100",
          iconColor: "#ea580c",
          Icon: AlertTriangle,
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "#2563eb",
          Icon: Info,
        };
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-orange-500 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="mb-4 flex-row items-center gap-2"
        >
          <ArrowLeft size={20} color="#ffedd5" />
          <Text className="text-orange-100">Back to Dashboard</Text>
        </Pressable>

        <Text className="text-2xl text-white mb-1">
          Alerts & Recommendations
        </Text>
        <Text className="text-orange-100">
          Stay informed and take action
        </Text>
      </View>

      <View className="px-6 py-6 space-y-4">
        {/* Tabs */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setView("alerts")}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
              view === "alerts"
                ? "bg-orange-600"
                : "bg-white border-2 border-slate-200"
            }`}
          >
            <AlertTriangle
              size={18}
              color={view === "alerts" ? "white" : "#334155"}
            />
            <Text
              className={
                view === "alerts" ? "text-white" : "text-slate-700"
              }
            >
              Alerts ({activeAlerts.length})
            </Text>
          </Pressable>

        </View>

        {/* Alerts */}
        {view === "alerts" &&
          activeAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            const Icon = style.Icon;

            return (
              <View
                key={alert.id}
                className={`${style.bg} ${style.border} border-2 rounded-2xl p-5`}
              >
                <Pressable
                  onPress={() =>
                    setDismissedAlertIds(
                      (p) => new Set([...p, alert.id])
                    )
                  }
                  className="absolute top-4 right-4"
                >
                  <X size={16} color="#64748b" />
                </Pressable>

                <View className="flex-row gap-3 mb-4">
                  <View
                    className={`w-10 h-10 ${style.iconBg} rounded-xl items-center justify-center`}
                  >
                    <Icon size={20} color={style.iconColor} />
                  </View>

                  <View className="flex-1 pr-6">
                    <Text className="text-slate-900 mb-1">
                      {alert.title}
                    </Text>
                    <Text className="text-sm text-slate-700 mb-2">
                      {alert.description}
                    </Text>
                    <Text className="text-xs text-slate-600">
                      🐄 {alert.cowName} • {alert.timestamp}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => onCowSelect(alert.cowId)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 flex-row items-center justify-center gap-2"
                  >
                    <Eye size={16} color="#334155" />
                    <Text className="text-slate-700 text-sm">
                      View Cow
                    </Text>
                  </Pressable>

                  {alert.type === "warning" && (
                    <Pressable className="px-6 bg-orange-600 rounded-xl py-2.5">
                      <Text className="text-white text-sm">
                        Take Action
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

       
      </View>
    </ScrollView>
  );
}
