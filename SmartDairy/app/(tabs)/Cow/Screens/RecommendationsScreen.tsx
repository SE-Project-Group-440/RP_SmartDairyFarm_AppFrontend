import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import {
  Leaf,
  Pill,
  Activity,
  Check,
  Clock,
  Sparkles,
} from "lucide-react-native";

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

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "feed",
    title: "Increase concentrated feed by 0.5kg",
    description: "Add 0.5kg of concentrated feed to evening meal",
    reason:
      "Milk yield is trending down for Bella. Increased energy intake may help stabilize production.",
    impact:
      "Expected yield increase: +1.5–2L per day within 3–5 days",
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
  {
    id: "3",
    type: "health",
    title: "Schedule routine health check",
    description: "Monitor for signs of subclinical mastitis",
    reason:
      "Sudden milk drop detected. Early detection prevents bigger issues.",
    impact:
      "Catch potential health issues early, reduce treatment costs",
    urgency: "high",
    cowName: "Bella",
  },
  {
    id: "4",
    type: "feed",
    title: "Maintain current feed schedule",
    description: "Lassie and Daisy are performing well",
    reason:
      "Current feeding program is showing excellent results",
    impact: "Continue optimal production levels",
    urgency: "low",
    cowName: "Lassie",
  },
];

export function RecommendationsScreen() {
  const [completedIds, setCompletedIds] = useState<
    Set<string>
  >(new Set());
  const [remindLaterIds, setRemindLaterIds] =
    useState<Set<string>>(new Set());

  const handleDone = (id: string) => {
    setCompletedIds((prev) => new Set([...prev, id]));
  };

  const handleRemindLater = (id: string) => {
    setRemindLaterIds((prev) => new Set([...prev, id]));
  };

  const active = mockRecommendations.filter(
    (r) =>
      !completedIds.has(r.id) &&
      !remindLaterIds.has(r.id)
  );

  const urgencyOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...active].sort(
    (a, b) =>
      urgencyOrder[a.urgency] -
      urgencyOrder[b.urgency]
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "feed":
        return <Leaf size={20} color="#15803d" />;
      case "supplement":
        return <Pill size={20} color="#7c3aed" />;
      case "health":
        return <Activity size={20} color="#2563eb" />;
      default:
        return <Sparkles size={20} />;
    }
  };

  const urgencyStyle = (u: string) => {
    switch (u) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-orange-50 border-orange-200";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-emerald-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
            <Sparkles size={22} color="#fff" />
          </View>
          <Text className="text-2xl text-white">
            Smart Recommendations
          </Text>
        </View>
        <Text className="text-emerald-100">
          AI-powered suggestions for your farm
        </Text>
      </View>

      <View className="px-6 py-6 space-y-4">
        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-2xl text-slate-900 mb-1">
            {active.length}
          </Text>
          <Text className="text-sm text-slate-600">
            Active recommendations
          </Text>
        </View>

        {/* List */}
        {sorted.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 border border-slate-100 items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Check size={28} color="#16a34a" />
            </View>
            <Text className="text-slate-900 mb-1">
              All caught up!
            </Text>
            <Text className="text-sm text-slate-600">
              No active recommendations
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {sorted.map((rec) => (
              <View
                key={rec.id}
                className={`rounded-2xl p-5 border-2 ${urgencyStyle(
                  rec.urgency
                )}`}
              >
                {/* Header */}
                <View className="flex-row gap-3 mb-3">
                  <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
                    {getIcon(rec.type)}
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 mb-1">
                      {rec.title}
                    </Text>
                    <Text className="text-sm text-slate-700">
                      {rec.description}
                    </Text>
                    <Text className="text-xs text-slate-600 mt-1">
                      🐄 {rec.cowName}
                    </Text>
                  </View>
                </View>

                {/* Why */}
                <View className="bg-white rounded-xl p-3 mb-3">
                  <Text className="text-xs text-slate-500 mb-1">
                    Why this matters
                  </Text>
                  <Text className="text-sm text-slate-700">
                    {rec.reason}
                  </Text>
                </View>

                {/* Impact */}
                <View className="bg-white rounded-xl p-3 mb-4">
                  <Text className="text-xs text-slate-500 mb-1">
                    Expected impact
                  </Text>
                  <Text className="text-sm text-slate-700">
                    {rec.impact}
                  </Text>
                </View>

                {/* Actions */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleDone(rec.id)}
                    className="flex-1 bg-green-600 rounded-xl py-3 flex-row items-center justify-center gap-2"
                  >
                    <Check size={16} color="#fff" />
                    <Text className="text-white">
                      Mark Done
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      handleRemindLater(rec.id)
                    }
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 items-center justify-center"
                  >
                    <Clock size={16} color="#334155" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Completed */}
        {completedIds.size > 0 && (
          <View className="pt-4 border-t border-slate-200">
            <Text className="text-slate-900 mb-3">
              Completed ({completedIds.size})
            </Text>

            {mockRecommendations
              .filter((r) => completedIds.has(r.id))
              .map((rec) => (
                <View
                  key={rec.id}
                  className="bg-white rounded-xl p-4 border border-slate-100 opacity-60 mb-2"
                >
                  <Text className="text-sm text-slate-900 line-through">
                    {rec.title}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {rec.cowName}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
