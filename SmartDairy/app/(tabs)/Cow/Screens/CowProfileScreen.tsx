import { useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  ArrowLeft,
  Calendar,
  TrendingDown,
  Activity,
  Info,
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { useCowProfileStore } from "@/Store/cowProfileStore";

const screenWidth = Dimensions.get("window").width;

interface CowProfileScreenProps {
  cowId: string | null;
  onBack: () => void;
}

export default function CowProfileScreen({
  cowId,
  onBack,
}: CowProfileScreenProps) {
  const { data, fetchCowProfile, isLoading } =
    useCowProfileStore();

  useEffect(() => {
    if (cowId) fetchCowProfile(cowId);
  }, [cowId]);

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-slate-600">
          Loading cow profile…
        </Text>
      </View>
    );
  }

  const { cow, lactationCycles } = data;
  const activeLactation = lactationCycles.at(-1);
  const milkings = activeLactation?.milkingRecords ?? [];

  /* ---------- GRAPH DATA (REAL) ---------- */
  const chart = useMemo(() => {
    const labels: string[] = [];
    const actual: number[] = [];
    const expected: number[] = [];

    milkings.forEach((m) => {
      labels.push(m.milkingDay.toString());

      actual.push(m.dailyMilk);

      // Simple expected lactation curve (Wood-style decay)
      const exp =
        25 * Math.exp(-0.003 * m.milkingDay);
      expected.push(Number(exp.toFixed(1)));
    });

    return { labels, actual, expected };
  }, [milkings]);

  const avgMilk =
    milkings.reduce((s, m) => s + m.dailyMilk, 0) /
      (milkings.length || 1);

  const status =
    avgMilk < chart.expected.at(-1)!
      ? "warning"
      : "healthy";

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) =>
      status === "healthy"
        ? `rgba(16, 185, 129, ${opacity})`
        : `rgba(245, 158, 11, ${opacity})`,
    labelColor: () => "#64748b",
    strokeWidth: 3,
    propsForDots: { r: "3" },
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* ---------- HEADER ---------- */}
      <View className="bg-green-600 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="flex-row items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} color="#dcfce7" />
          <Text className="text-green-100">
            Back to Home
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

      {/* ---------- STATUS ---------- */}
      <View className="px-6 mt-4 mb-4">
        {status === "healthy" ? (
          <View className="flex-row items-center gap-2 bg-green-100 px-4 py-2 rounded-full self-start">
            <Activity size={16} color="#16a34a" />
            <Text className="text-green-700">
              Healthy
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-2 bg-orange-100 px-4 py-2 rounded-full self-start">
            <TrendingDown size={16} color="#ea580c" />
            <Text className="text-orange-700">
              Needs Attention
            </Text>
          </View>
        )}
      </View>

      {/* ---------- INFO ---------- */}
      <View className="px-6 space-y-4">
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-900 mb-4">
            Basic Information
          </Text>

          <View className="flex-row flex-wrap gap-y-4">
            <InfoItem
              label="Age"
              value={`${cow.ageInMonths} months`}
            />
            <InfoItem
              label="Lactation #"
              value={`#${activeLactation?.lactationRound ?? "-"}`}
            />
            <InfoItem
              label="Current Day"
              value={`Day ${milkings.at(-1)?.milkingDay ?? 0}`}
            />
            <InfoItem
              label="Avg Milk"
              value={`${avgMilk.toFixed(1)} L`}
            />
          </View>
        </View>

        {/* ---------- GRAPH ---------- */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-slate-900 mb-1">
                Lactation Curve
              </Text>
              <Text className="text-sm text-slate-500">
                Expected vs Actual
              </Text>
            </View>
            <Info size={18} color="#64748b" />
          </View>

          <LineChart
            data={{
              labels: chart.labels,
              datasets: [
                {
                  data: chart.expected,
                  color: () => "#94a3b8",
                  strokeWidth: 2,
                },
                {
                  data: chart.actual,
                  color: () =>
                    status === "healthy"
                      ? "#10b981"
                      : "#f59e0b",
                  strokeWidth: 3,
                },
              ],
              legend: ["Expected", "Actual"],
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* ---------- INSIGHT ---------- */}
        {status === "warning" ? (
          <Insight
            icon={<TrendingDown size={20} color="#ea580c" />}
            title="Milk Yield Drop Detected"
            text="Production dropped below expected curve."
            bg="bg-orange-50"
            border="border-orange-200"
          />
        ) : (
          <Insight
            icon={<Activity size={20} color="#16a34a" />}
            title="Performing Well"
            text={`${cow.name} is on track for this lactation stage.`}
            bg="bg-green-50"
            border="border-green-200"
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
