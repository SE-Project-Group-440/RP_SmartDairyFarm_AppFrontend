import { useMemo } from "react";
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

const screenWidth = Dimensions.get("window").width;

interface CowProfileScreenProps {
  cowId: string | null;
  onBack: () => void;
}

const cowData: Record<string, any> = {
  "1": {
    name: "Lassie",
    breed: "Jersey",
    age: "4 years 3 months",
    lactationNumber: 3,
    currentDay: 142,
    status: "healthy",
    avgMilk: 18.5,
  },
  "2": {
    name: "Bella",
    breed: "Holstein Friesian",
    age: "3 years 1 month",
    lactationNumber: 2,
    currentDay: 89,
    status: "warning",
    avgMilk: 12.3,
  },
  "3": {
    name: "Daisy",
    breed: "Jersey Cross",
    age: "5 years 8 months",
    lactationNumber: 4,
    currentDay: 201,
    status: "healthy",
    avgMilk: 20.1,
  },
};

/* ---------- LACTATION DATA ---------- */

const generateLactationData = (
  currentDay: number,
  status: string
) => {
  const labels: string[] = [];
  const expected: number[] = [];
  const actual: number[] = [];

  for (let day = 0; day <= Math.min(currentDay + 30, 305); day += 10) {
    const exp = 25 * Math.exp(-0.003 * day);
    const act =
      status === "warning" && day > currentDay - 20
        ? exp * 0.75
        : exp + (Math.random() - 0.5) * 2;

    labels.push(day.toString());
    expected.push(Number(exp.toFixed(1)));
    actual.push(day <= currentDay ? Number(act.toFixed(1)) : 0);
  }

  return { labels, expected, actual };
};

/* ---------- SCREEN ---------- */

export default function CowProfileScreen({
  cowId,
  onBack,
}: CowProfileScreenProps) {
  const cow = cowId ? cowData[cowId] : null;

  if (!cow) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-slate-600">Cow not found</Text>
      </View>
    );
  }

  const chart = useMemo(
    () => generateLactationData(cow.currentDay, cow.status),
    [cow]
  );

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) =>
      cow.status === "healthy"
        ? `rgba(16, 185, 129, ${opacity})`
        : `rgba(245, 158, 11, ${opacity})`,
    labelColor: () => "#64748b",
    strokeWidth: 3,
    propsForDots: { r: "3" },
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="flex-row items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} color="#dcfce7" />
          <Text className="text-green-100">Back to Home</Text>
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

      {/* Status */}
      <View className="px-6 mt-4 mb-4">
        {cow.status === "healthy" ? (
          <View className="flex-row items-center gap-2 bg-green-100 px-4 py-2 rounded-full self-start">
            <Activity size={16} color="#16a34a" />
            <Text className="text-green-700">Healthy</Text>
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

      {/* Info */}
      <View className="px-6 space-y-4">
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-900 mb-4">
            Basic Information
          </Text>

          <View className="flex-row flex-wrap gap-y-4">
            <InfoItem label="Age" value={cow.age} />
            <InfoItem
              label="Lactation #"
              value={`#${cow.lactationNumber}`}
            />
            <InfoItem
              label="Current Day"
              value={`Day ${cow.currentDay}`}
            />
            <InfoItem
              label="Avg Milk"
              value={`${cow.avgMilk}L`}
            />
          </View>
        </View>

        {/* Chart */}
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
                    cow.status === "healthy"
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

        {/* Insights */}
        {cow.status === "warning" ? (
          <Insight
            icon={<TrendingDown size={20} color="#ea580c" />}
            title="Milk Yield Drop Detected"
            text={`Production dropped below expected for day ${cow.currentDay}.`}
            bg="bg-orange-50"
            border="border-orange-200"
          />
        ) : (
          <Insight
            icon={<Activity size={20} color="#16a34a" />}
            title="Performing Well"
            text={`${cow.name} is above average for this lactation stage.`}
            bg="bg-green-50"
            border="border-green-200"
          />
        )}

        {/* Actions */}
        <View className="flex-row gap-3">
          <Pressable className="flex-1 bg-green-600 py-3 rounded-xl items-center">
            <Calendar size={20} color="#fff" />
            <Text className="text-white text-sm mt-1">
              Schedule
            </Text>
          </Pressable>

          <Pressable className="flex-1 bg-white border border-slate-200 py-3 rounded-xl items-center">
            <Activity size={20} color="#334155" />
            <Text className="text-slate-700 text-sm mt-1">
              Health Log
            </Text>
          </Pressable>
        </View>
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
