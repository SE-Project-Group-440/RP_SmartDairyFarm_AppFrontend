import { useState, useEffect } from "react";
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
import { useTranslations } from "@/hooks/useTranslations";
import { useRecommendationStore } from "@/Store/recommendationStore";

interface AlertsScreenProps {
  onCowSelect: (cowId: string) => void;
}

export default function AlertsScreen({ onCowSelect }: AlertsScreenProps) {
  const { t } = useTranslations();
  const {
    recommendations,
    fetchAll,
    resolveRecommendation,
  } = useRecommendationStore();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAll();
  }, []);

  const activeAlerts = recommendations.filter(
    (alert) => !dismissedIds.has(alert._id)
  );

  const getAlertStyle = () => {
    return {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "#dc2626",
      Icon: AlertCircle,
    };
  };

  const criticalCount = activeAlerts.length;
  const warningCount = 0;
  const infoCount = 0;

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-orange-500 px-6 pt-12 pb-6">
        <Text className="text-2xl text-white mb-1">
          {t('alerts', 'header')}
        </Text>
        <Text className="text-orange-100">
          {t('alerts', 'subheader')}
        </Text>
      </View>

      <View className="px-6 py-6 space-y-4">
        {/* Summary */}
        <View className="flex-row justify-between">
          <SummaryCard label={t('alerts','critical')} value={criticalCount} color="text-red-600" />
          <SummaryCard label={t('alerts','warning')} value={warningCount} color="text-orange-600" />
          <SummaryCard label={t('alerts','info')} value={infoCount} color="text-blue-600" />
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
            const style = getAlertStyle();
            const Icon = style.Icon;

            return (
              <View
                key={alert._id}
                className={`${style.bg} ${style.border} border-2 rounded-2xl p-5`}
              >
                <Pressable
                  onPress={async () => {
                    await resolveRecommendation(alert._id);
                    setDismissedIds((prev) => {
                      const updated = new Set(prev);
                      updated.add(alert._id);
                      return updated;
                    });
                  }}
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
                      {t('alerts', alert.title.startsWith('recommendation_') ? alert.title.replace('recommendation_','') : alert.title)}
                    </Text>
                    <Text className="text-sm text-slate-700 mb-2">
                      {t('alerts', alert.message.startsWith('recommendation_') ? alert.message.replace('recommendation_','') : alert.message)}
                    </Text>
                    <Text className="text-xs text-slate-600">
                      🐄 {alert.cowId.name} • Cow ID: {alert.cowId._id}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => onCowSelect(alert.cowId._id)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 flex-row items-center justify-center gap-2"
                  >
                    <Eye size={16} color="#334155" />
                    <Text className="text-sm">{t('alerts','viewCow')}</Text>
                  </Pressable>

                  <Pressable
                    onPress={async () => {
                      await resolveRecommendation(alert._id);
                      setDismissedIds((prev) => {
                        const updated = new Set(prev);
                        updated.add(alert._id);
                        return updated;
                      });
                    }}
                    className="px-5 bg-green-600 rounded-xl justify-center"
                  >
                    <Text className="text-white text-sm">
                      {t('alerts','takeAction')}
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
