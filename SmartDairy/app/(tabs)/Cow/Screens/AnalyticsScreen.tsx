import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

/* ================= HARDCODED DATA ================= */

// WEEKLY
const weeklyActual = [48, 52, 49, 47, 51, 50, 53];
const weeklyPredicted = [50, 50, 50, 50, 50, 50, 50];

// MONTHLY
const monthlyActual = [1420, 1380, 1510, 1480, 1550];
const monthlyPredicted = [1450, 1450, 1450, 1450, 1450];

// TOTALS
const actualTotalSoFar = 350.5; // liters
const predictedTotal = 365.0; // liters
const deviation = predictedTotal - actualTotalSoFar;

/* ================= SCREEN ================= */

export default function AnalyticsScreen() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const labels =
    timeframe === "week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Jan", "Feb", "Mar", "Apr", "May"];

  const actualData =
    timeframe === "week" ? weeklyActual : monthlyActual;

  const predictedData =
    timeframe === "week" ? weeklyPredicted : monthlyPredicted;

  const chartData = {
    labels,
    datasets: [
      {
        data: actualData,
        color: () => "#16a34a", // green
        strokeWidth: 3,
      },
      {
        data: predictedData,
        color: () => "#2563eb", // blue
        strokeWidth: 2,
      },
    ],
    legend: ["Actual", "Predicted"],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: () => "#0f172a",
    labelColor: () => "#64748b",
    propsForDots: { r: "4" },
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-6">
        <Text className="text-2xl text-white mb-1">
          Analytics & Insights
        </Text>
        <Text className="text-green-100">
          Actual vs Predicted Milk Production
        </Text>
      </View>

      <View className="px-6 py-6 space-y-6">
        {/* Timeframe */}
        <View className="flex-row gap-3">
          {["week", "month"].map((t) => (
            <Pressable
              key={t}
              onPress={() => setTimeframe(t as any)}
              className={`flex-1 py-3 rounded-xl items-center ${
                timeframe === t
                  ? "bg-green-600"
                  : "bg-white border border-slate-200"
              }`}
            >
              <Text
                className={
                  timeframe === t ? "text-white" : "text-slate-700"
                }
              >
                {t === "week" ? "This Week" : "Monthly"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Totals */}
        <View className="flex-row gap-3">
          <SummaryCard
            title="Actual So Far"
            value={`${actualTotalSoFar} L`}
            subtitle="Measured output"
          />
          <SummaryCard
            title="Predicted Total"
            value={`${predictedTotal} L`}
            subtitle="Projected output"
          />
        </View>

        <SummaryCard
          title="Deviation"
          value={`${deviation > 0 ? "+" : ""}${deviation.toFixed(1)} L`}
          subtitle={deviation > 0 ? "Below target" : "Above target"}
        />

        {/* Chart */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-900 mb-1">
            Milk Production Curve
          </Text>
          <Text className="text-sm text-slate-500 mb-4">
            Actual vs Predicted
          </Text>

          <LineChart
            data={chartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* Insights */}
        <Text className="text-slate-900">Key Insights</Text>

        <InsightCard
          icon={<TrendingUp size={20} color="#16a34a" />}
          title="Production On Track"
          text="Actual production is closely following the predicted curve."
          bg="bg-green-50"
          border="border-green-200"
        />

        <InsightCard
          icon={<Lightbulb size={20} color="#2563eb" />}
          title="Projection Insight"
          text="Final yield is expected to reach 365L by period end."
          bg="bg-blue-50"
          border="border-blue-200"
        />

        <InsightCard
          icon={<TrendingDown size={20} color="#ea580c" />}
          title="Minor Deviation"
          text="Current output is slightly below predicted levels."
          bg="bg-orange-50"
          border="border-orange-200"
        />
      </View>
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */

function InsightCard({
  icon,
  title,
  text,
  bg,
  border,
}: any) {
  return (
    <View className={`${bg} ${border} border rounded-2xl p-5`}>
      <View className="flex-row gap-3">
        <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-slate-900 mb-1">{title}</Text>
          <Text className="text-sm text-slate-700">{text}</Text>
        </View>
      </View>
    </View>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-100">
      <Text className="text-sm text-slate-500 mb-1">{title}</Text>
      <Text className="text-2xl text-slate-900">{value}</Text>
      <Text className="text-xs text-green-600 mt-1">{subtitle}</Text>
    </View>
  );
}
