import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import {
  AlertTriangle,
  Info,
  AlertCircle,
  Eye,
  X,
} from "lucide-react-native";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  cowId: string;
  cowName: string;
  timestamp: string;
}

interface AlertsScreenProps {
  onCowSelect: (cowId: string) => void;
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
    title: "Lactation Day Milestone",
    description: "Daisy has reached day 200 of lactation",
    cowId: "3",
    cowName: "Daisy",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "info",
    title: "Above Average Performance",
    description: "Lassie is producing 8% above expected",
    cowId: "1",
    cowName: "Lassie",
    timestamp: "1 day ago",
  },
];

export default function AlertsScreen({ onCowSelect }: AlertsScreenProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const activeAlerts = mockAlerts.filter(
    (alert) => !dismissedIds.has(alert.id)
  );

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

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

  const criticalCount = activeAlerts.filter(a => a.type === "critical").length;
  const warningCount = activeAlerts.filter(a => a.type === "warning").length;
  const infoCount = activeAlerts.filter(a => a.type === "info").length;

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-orange-500 px-6 pt-12 pb-6">
        <Text className="text-2xl text-white mb-1">
          Alerts & Notifications
        </Text>
        <Text className="text-orange-100">
          Stay on top of your farm's needs
        </Text>
      </View>

      <View className="px-6 py-6 space-y-4">
        {/* Summary */}
        <View className="flex-row justify-between">
          <SummaryCard label="Critical" value={criticalCount} color="text-red-600" />
          <SummaryCard label="Warning" value={warningCount} color="text-orange-600" />
          <SummaryCard label="Info" value={infoCount} color="text-blue-600" />
        </View>

        {/* Alerts */}
        {activeAlerts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Info size={32} color="#16a34a" />
            <Text className="text-slate-900 mt-3">All Clear!</Text>
            <Text className="text-slate-600 text-sm">
              No active alerts
            </Text>
          </View>
        ) : (
          activeAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            const Icon = style.Icon;

            return (
              <View
                key={alert.id}
                className={`${style.bg} ${style.border} border-2 rounded-2xl p-5`}
              >
                <Pressable
                  onPress={() => handleDismiss(alert.id)}
                  className="absolute top-4 right-4"
                >
                  <X size={18} color="#64748b" />
                </Pressable>

                <View className="flex-row gap-3 mb-4">
                  <View className={`${style.iconBg} w-10 h-10 rounded-xl items-center justify-center`}>
                    <Icon size={20} color={style.iconColor} />
                  </View>

                  <View className="flex-1">
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
                    <Text className="text-sm">View Cow</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDismiss(alert.id)}
                    className="px-5 bg-green-600 rounded-xl justify-center"
                  >
                    <Text className="text-white text-sm">
                      {alert.type === "info" ? "Dismiss" : "Take Action"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

/* Helper */
function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View className="bg-white rounded-xl p-4 items-center w-[30%]">
      <Text className={`text-2xl ${color}`}>{value}</Text>
      <Text className="text-xs text-slate-600">{label}</Text>
    </View>
  );
}
