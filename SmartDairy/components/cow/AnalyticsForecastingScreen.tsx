import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
} from "lucide-react-native";
import {
  LineChart,
  BarChart,
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface AnalyticsForecastingScreenProps {
  onBack: () => void;
}

const dailyData = {
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

const weeklyForecast = {
  labels: ["This", "Next", "Wk 3", "Wk 4"],
  datasets: [
    {
      data: [350, 355, 360, 358],
    },
  ],
};

const monthlyForecast = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [1420, 1380, 1510, 1480, 1550, 1590],
      strokeWidth: 3,
    },
  ],
};

export function AnalyticsForecastingScreen({
  onBack,
}: AnalyticsForecastingScreenProps) {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

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
      <View className="bg-indigo-600 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="mb-4 flex-row items-center gap-2"
        >
          <ArrowLeft size={20} color="#e0e7ff" />
          <Text className="text-indigo-100">
            Back to Dashboard
          </Text>
        </Pressable>

        <Text className="text-2xl text-white mb-1">
          Analytics & Forecasting
        </Text>
        <Text className="text-indigo-100">
          Data insights and predictions
        </Text>
      </View>

      <View className="px-6 py-6 space-y-6">
        {/* View Selector */}
        <View className="flex-row gap-2">
          {["daily", "weekly", "monthly"].map((v) => (
            <Pressable
              key={v}
              onPress={() => setView(v as any)}
              className={`flex-1 py-3 rounded-xl items-center ${
                view === v
                  ? "bg-indigo-600"
                  : "bg-white border-2 border-slate-200"
              }`}
            >
              <Text
                className={
                  view === v
                    ? "text-white"
                    : "text-slate-700"
                }
              >
                {v[0].toUpperCase() + v.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* DAILY */}
        {view === "daily" && (
          <View className="bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-slate-900 mb-2">
              Daily Milk Production
            </Text>

            <LineChart
              data={dailyData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 16 }}
            />

            <View className="mt-4 flex-row items-center gap-3">
              <TrendingUp size={20} color="#16a34a" />
              <Text className="text-green-600">
                +3.2% vs last week
              </Text>
            </View>
          </View>
        )}

        {/* WEEKLY */}
        {view === "weekly" && (
          <View className="bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-slate-900 mb-2">
              4-Week Forecast
            </Text>

           <BarChart
  data={weeklyForecast}
  width={screenWidth - 48}
  height={220}
  chartConfig={chartConfig}
  yAxisLabel=""
  yAxisSuffix=""
  style={{ borderRadius: 16 }}
/>

            <Text className="mt-3 text-sm text-slate-600">
              Expected upward trend over next month
            </Text>
          </View>
        )}

        {/* MONTHLY */}
        {view === "monthly" && (
          <>
            <View className="bg-white rounded-2xl p-5 border border-slate-100">
              <Text className="text-slate-900 mb-2">
                Monthly Production
              </Text>

              <LineChart
                data={monthlyForecast}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                style={{ borderRadius: 16 }}
              />
            </View>

            <View className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <View className="flex-row gap-3">
                <View className="w-10 h-10 bg-indigo-100 rounded-xl items-center justify-center">
                  <Calendar size={20} color="#4f46e5" />
                </View>
                <View>
                  <Text className="text-slate-900 mb-1">
                    Growing Production
                  </Text>
                  <Text className="text-sm text-slate-700">
                    +12% growth over last 5 months
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
