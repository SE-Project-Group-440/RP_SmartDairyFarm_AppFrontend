import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, TrendingDown, Activity, Info } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { api } from "@/hooks/api";
import { useCowProfileStore } from "@/Store/cowProfileStore";
import { useTranslations } from "@/hooks/useTranslations";

const screenWidth = Dimensions.get("window").width;

interface CowProfileScreenProps {
  cowId: string | null;
  onBack: () => void;
}

export default function CowProfileScreen({
  cowId,
  onBack,
}: CowProfileScreenProps) {
  const { data, fetchCowProfile, isLoading } = useCowProfileStore();

  const { t } = useTranslations();

  const [predictions, setPredictions] = useState<any[]>([]);
  const [loadingPred, setLoadingPred] = useState(false);

  useEffect(() => {
    if (cowId) {
      fetchCowProfile(cowId);
      fetchPredictions(cowId);
    }
  }, [cowId]);

  async function fetchPredictions(cowId: string) {
    try {
      setLoadingPred(true);

      const res = await api.get(`/analytics/cow/${cowId}/latest-lactation`);

      if (!res.data?.success) {
        setPredictions([]);
        return;
      }

      const normalized = res.data.predictions.map((p: any) => ({
        milkingDay: p.milkingDay || 0,
        actualMilk: p.actualMilk || 0,
        predictedMilk: p.predictedMilk || 0,
      }));

      normalized.sort((a: any, b: any) => a.milkingDay - b.milkingDay);

      setPredictions(normalized);
    } catch (err) {
      console.warn("Prediction load error", err);
      setPredictions([]);
    } finally {
      setLoadingPred(false);
    }
  }

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("common", "loading")}</Text>
      </View>
    );
  }

  const { cow, lactationCycles } = data;

  const activeLactation = lactationCycles?.at(-1);


  // Defensive: Ensure all numbers are valid and not NaN/Infinity
  const safeNumber = (n: any, fallback = 0) => {
    if (typeof n !== "number" || isNaN(n) || !isFinite(n)) return fallback;
    return n;
  };

  const validActualMilk = predictions.map((p) => safeNumber(p.actualMilk, 0));
  const validPredictedMilk = predictions.map((p) => safeNumber(p.predictedMilk, 0));

  // If no predictions, set averages to 0
  const actualCount = validActualMilk.filter((v) => v > 0).length;
  const avgMilk = actualCount > 0
    ? validActualMilk.reduce((s, v) => s + v, 0) / actualCount
    : 0;

  const predictedAvg = validPredictedMilk.length > 0
    ? validPredictedMilk.reduce((s, v) => s + v, 0) / validPredictedMilk.length
    : 0;

  const status = (actualCount > 0 && avgMilk < predictedAvg) ? "warning" : "healthy";

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: () => "#0f172a",
    labelColor: () => "#475569",
    propsForDots: {
      r: "3",
      strokeWidth: "2",
      stroke: "#fff",
    },
  };


  // Defensive: filter out invalid milkingDay values
  const displayData = predictions
    .map((p) => ({
      milkingDay: safeNumber(p.milkingDay, 0),
      actualMilk: safeNumber(p.actualMilk, 0),
      predictedMilk: safeNumber(p.predictedMilk, 0),
    }))
    .slice(0, Math.min(predictions.length, 280));

  const totalDays = displayData.length;
  const interval = Math.max(1, Math.floor(totalDays / 6));

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* HEADER */}

      <View className="bg-green-600 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="flex-row items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} color="#dcfce7" />
          <Text className="text-green-100">
            {t("common", "back")}
          </Text>
        </Pressable>

        <View className="flex-row items-center gap-4">
          <View className="w-20 h-20 bg-amber-200 rounded-2xl items-center justify-center">
            <Text className="text-4xl">🐄</Text>
          </View>

          <View>
            <Text className="text-2xl text-white mb-1">
              {cow.name}
            </Text>

            <Text className="text-green-100">
              {cow.breed}
            </Text>
          </View>
        </View>
      </View>

      {/* STATUS */}

      <View className="px-6 mt-4 mb-4">
        {status === "healthy" ? (
          <View className="flex-row items-center gap-2 bg-green-100 px-4 py-2 rounded-full self-start">
            <Activity size={16} color="#16a34a" />
            <Text className="text-green-700">
              {t("cowList", "healthy")}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-2 bg-orange-100 px-4 py-2 rounded-full self-start">
            <TrendingDown size={16} color="#ea580c" />
            <Text className="text-orange-700">
              {t("alerts", "below_expected_title")}
            </Text>
          </View>
        )}
      </View>

      {/* BASIC INFO */}

      <View className="px-6">
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-900 mb-4">
            {t("addCow", "basicInformation")}
          </Text>

          <View className="flex-row flex-wrap gap-y-4">

            <InfoItem
              label={t("cowList", "age")}
              value={`${safeNumber(cow.ageInMonths, 0)} ${t("cowList", "months")}`}
            />

            <InfoItem
              label={t("cowList", "lactation")}
              value={`#${activeLactation?.lactationRound ?? "-"}`}
            />

            <InfoItem
              label={t("cowList", "day")}
              value={displayData.length > 0 ? `${displayData.at(-1)?.milkingDay ?? 0}` : "-"}
            />

            <InfoItem
              label={t("cowList", "avgMilk")}
              value={actualCount > 0 ? `${safeNumber(avgMilk, 0).toFixed(1)} L` : "-"}
            />
          </View>
        </View>
      </View>

      {/* CHART */}

      <View className="px-6 mt-6">
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-900">
              Lactation Curve
            </Text>
            <Info size={18} color="#64748b" />
          </View>
          {loadingPred ? (
            <ActivityIndicator />
          ) : displayData.length === 0 ? (
            <Text className="text-slate-500 text-center py-8">
              No lactation or milk records yet.
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{
                  labels: displayData.map((p, index) => {
                    if (index === 0) return "D1";
                    if (index === totalDays - 1)
                      return `D${safeNumber(p.milkingDay, 0)}`;
                    if (index % interval === 0)
                      return `D${safeNumber(p.milkingDay, 0)}`;
                    return "";
                  }),
                  datasets: [
                    {
                      data: displayData.map((p) => safeNumber(p.actualMilk, 0)),
                      color: () => "#10b981",
                      strokeWidth: 3,
                    },
                    {
                      data: displayData.map((p) => safeNumber(p.predictedMilk, 0)),
                      color: () => "#6366f1",
                      strokeWidth: 2,
                    },
                  ],
                  legend: ["Actual", "Predicted"],
                }}
                width={Math.max(
                  screenWidth - 48,
                  displayData.length * 6
                )}
                height={260}
                fromZero
                yAxisSuffix="L"
                chartConfig={chartConfig}
                withDots={false}
                withVerticalLines={false}
                style={{ borderRadius: 16 }}
              />
            </ScrollView>
          )}
        </View>
      </View>

      {/* INSIGHT */}

      <View className="px-6 mt-6 mb-10">
        {status === "healthy" ? (
          <Insight
            icon={<Activity size={20} color="#16a34a" />}
            title="Performing Well"
            text={`${cow.name} is performing as expected.`}
            bg="bg-green-50"
            border="border-green-200"
          />
        ) : (
          <Insight
            icon={<TrendingDown size={20} color="#ea580c" />}
            title="Milk Yield Drop"
            text="Milk production is below predicted curve."
            bg="bg-orange-50"
            border="border-orange-200"
          />
        )}
      </View>
    </ScrollView>
  );
}

/* ---------- COMPONENTS ---------- */

function InfoItem({ label, value }: any) {
  return (
    <View className="w-1/2">
      <Text className="text-sm text-slate-500 mb-1">
        {label}
      </Text>

      <Text className="text-slate-900">{value}</Text>
    </View>
  );
}

function Insight({ icon, title, text, bg, border }: any) {
  return (
    <View className={`${bg} ${border} border rounded-2xl p-5`}>
      <View className="flex-row gap-3">
        <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
          {icon}
        </View>

        <View className="flex-1">
          <Text className="text-slate-900 mb-1">
            {title}
          </Text>

          <Text className="text-sm text-slate-600">
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
}