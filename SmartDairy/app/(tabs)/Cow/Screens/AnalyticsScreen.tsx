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
  Calendar,
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

/* ---------- DATA ---------- */

const weeklyChart = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [48, 52, 49, 47, 51, 50, 53],
      color: () => "#10b981",
      strokeWidth: 3,
    },
    {
      data: [50, 50, 50, 50, 50, 50, 50],
      color: () => "#94a3b8",
      strokeWidth: 2,
    },
  ],
  legend: ["Actual", "Expected"],
};

const monthlyChart = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      data: [1420, 1380, 1510, 1480, 1550],
      color: () => "#10b981",
      strokeWidth: 3,
    },
    {
      data: [1450, 1450, 1450, 1450, 1450],
      color: () => "#94a3b8",
      strokeWidth: 2,
    },
  ],
  legend: ["Actual", "Expected"],
};

/* ---------- SCREEN ---------- */

export function AnalyticsScreen() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const chartData = timeframe === "week" ? weeklyChart : monthlyChart;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
    labelColor: () => "#64748b",
    strokeWidth: 3,
    propsForDots: {
      r: "4",
    },
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-6">
        <Text className="text-2xl text-white mb-1">
          Analytics & Insights
        </Text>
        <Text className="text-green-100">
          Track your farm's performance
        </Text>
      </View>

      <View className="px-6 py-6 space-y-6">
        {/* Timeframe Selector */}
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

        {/* Chart */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-slate-900 mb-1">
                Milk Production
              </Text>
              <Text className="text-sm text-slate-500">
                Expected vs Actual
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl text-slate-900">
                350.5L
              </Text>
              <Text className="text-xs text-green-600">
                +3.2% this week
              </Text>
            </View>
          </View>

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
          title="Production Above Target"
          text="This week's production is 3.2% higher than expected."
          bg="bg-green-50"
          border="border-green-200"
        />

        <InsightCard
          icon={<Lightbulb size={20} color="#2563eb" />}
          title="Best Performing Day"
          text="Sunday had the highest yield at 53L."
          bg="bg-blue-50"
          border="border-blue-200"
        />

        <InsightCard
          icon={<TrendingDown size={20} color="#ea580c" />}
          title="Weekly Low Point"
          text="Thursday dipped 6% below weekly average."
          bg="bg-orange-50"
          border="border-orange-200"
        />

        {/* Individual Performance */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-900">
              Individual Performance
            </Text>
            <Text className="text-green-600 text-sm">
              See All
            </Text>
          </View>

          {[
            { name: "Daisy", milk: 20.1, trend: "+8%", up: true },
            { name: "Lassie", milk: 18.5, trend: "+2%", up: true },
            { name: "Bella", milk: 12.3, trend: "-12%", up: false },
          ].map((cow, i) => (
            <View key={i} className="flex-row items-center gap-4 mb-4">
              <View className="w-10 h-10 bg-amber-200 rounded-xl items-center justify-center">
                🐄
              </View>

              <View className="flex-1">
                <Text className="text-slate-900 mb-1">
                  {cow.name}
                </Text>
                <View className="h-2 bg-slate-100 rounded-full">
                  <View
                    className={`h-2 rounded-full ${
                      cow.up ? "bg-green-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${(cow.milk / 25) * 100}%` }}
                  />
                </View>
              </View>

              <View className="items-end">
                <Text className="text-slate-900">
                  {cow.milk}L
                </Text>
                <Text
                  className={`text-xs ${
                    cow.up ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {cow.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View className="flex-row gap-3">
          <SummaryCard title="Avg per Cow" value="17.0L" subtitle="+1.5L" />
          <SummaryCard title="Best Day" value="53L" subtitle="Sunday" />
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------- COMPONENTS ---------- */

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
