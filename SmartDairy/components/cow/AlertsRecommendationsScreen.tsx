import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Eye,
  X,
} from "lucide-react-native";

import { useRecommendationStore } from "../../Store/recommendationStore";

interface AlertsRecommendationsScreenProps {
  onCowSelect: (cowId: string) => void;
  onBack: () => void;
}

export function AlertsRecommendationsScreen({
  onCowSelect,
  onBack,
}: AlertsRecommendationsScreenProps) {
  const {
    recommendations,
    fetchAll,
    resolveRecommendation,
  } = useRecommendationStore();

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchAll();
  }, []);

  const activeAlerts = recommendations.filter(
    (r) => !dismissedIds.has(r._id)
  );

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
        {/* Alerts */}
        {activeAlerts.map((alert) => (
          <View
            key={alert._id}
            className="bg-red-50 border-red-200 border-2 rounded-2xl p-5"
          >
            <Pressable
              onPress={async () => {
                setDismissedIds(
                  (p) => new Set([...p, alert._id])
                );
                await resolveRecommendation(alert._id);
              }}
              className="absolute top-4 right-4"
            >
              <X size={16} color="#64748b" />
            </Pressable>

            <View className="flex-row gap-3 mb-4">
              <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center">
                <AlertCircle size={20} color="#dc2626" />
              </View>

              <View className="flex-1 pr-6">
                <Text className="text-slate-900 mb-1">
                  {alert.title}
                </Text>
                <Text className="text-sm text-slate-700 mb-2">
                  {alert.message}
                </Text>
                <Text className="text-xs text-slate-600">
                  🐄 {alert.cowId.name} •{" "}
                  {new Date(alert.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() =>
                  onCowSelect(alert.cowId._id)
                }
                className="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 flex-row items-center justify-center gap-2"
              >
                <Eye size={16} color="#334155" />
                <Text className="text-slate-700 text-sm">
                  View Cow
                </Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  setDismissedIds(
                    (p) => new Set([...p, alert._id])
                  );
                  await resolveRecommendation(alert._id);
                }}
                className="px-6 bg-orange-600 rounded-xl py-2.5"
              >
                <Text className="text-white text-sm">
                  Mark Done
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        {activeAlerts.length === 0 && (
          <View className="items-center py-12">
            <AlertTriangle size={40} color="#94a3b8" />
            <Text className="text-slate-500 mt-3">
              No active alerts 🎉
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
