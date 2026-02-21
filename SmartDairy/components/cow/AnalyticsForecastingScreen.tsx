import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, X, ChevronDown } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { api } from "../../hooks/api";
import { useCowListStore } from "../../Store/cowStore";

const screenWidth = Dimensions.get("window").width;

interface AnalyticsForecastingScreenProps {
  onBack?: () => void;
}

interface Cow {
  _id: string;
  name: string;
  breed?: string;
}

export default function AnalyticsForecastingScreen({ onBack }: AnalyticsForecastingScreenProps) {
  const { cows: storeCows, fetchCows: fetchStoreCows } = useCowListStore();

  const [cows, setCows] = useState<Cow[]>([]);
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<any | null>(null);
  const [showCowModal, setShowCowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: () => "#0f172a",
    labelColor: () => "#64748b",
    propsForDots: { r: "2" },
  };

  useEffect(() => {
    // Fetch cows on mount and from store
    fetchStoreCows().catch((err) => {
      console.warn("Store fetch failed, falling back to API", err);
      // Fallback: fetch directly if store fails
      api
        .get("/cows")
        .then((res) => setCows(res.data || []))
        .catch((e) => console.warn("Direct API fetch also failed", e));
    });
  }, []);

  useEffect(() => {
    // Sync store cows to local state
    if (storeCows && storeCows.length > 0) {
      setCows(storeCows);
    }
  }, [storeCows]);

  useEffect(() => {
    if (selectedCow) {
      fetchLatestLactationPredictions(selectedCow._id);
    }
  }, [selectedCow]);

  const filteredCows = cows.filter((c) =>
    `${c.name} ${c.breed || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  async function fetchLatestLactationPredictions(cowId: string) {
    try {
      setLoading(true);
      const res = await api.get(`/analytics/cow/${cowId}/latest-lactation`);
      
      if (!res.data?.success) {
        setPredictions([]);
        setSelectedCycle(null);
        return;
      }

      setSelectedCycle(res.data.lactationCycle || null);

      // Normalize predictions to objects with milkingDay, predictedMilk, actualMilk
      const data = res.data?.predictions || [];
      const normalized = data.map((d: any) => ({
        milkingDay: d.milkingDay || 0,
        predictedMilk: d.predictedMilk || 0,
        actualMilk: d.actualMilk || 0,
        datePred: d.datePred,
        completed: d.completed,
      }));
      
      // sort by milkingDay
      normalized.sort((a: any, b: any) => a.milkingDay - b.milkingDay);
      setPredictions(normalized);
    } catch (err) {
      console.warn("Failed to load latest lactation predictions", err);
      setPredictions([]);
      setSelectedCycle(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="bg-indigo-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center gap-3 mb-3">
          <Pressable onPress={() => onBack && onBack()} className="p-2">
            <ArrowLeft size={20} color="#e0e7ff" />
          </Pressable>
          <Text className="text-2xl text-white">Analytics & Forecasting</Text>
        </View>
        <Text className="text-indigo-100">Data insights and predictions</Text>
      </View>

      <View className="px-6 py-6 space-y-6">
        <Pressable
          onPress={() => setShowCowModal(true)}
          className="bg-white border border-slate-300 rounded-2xl p-4 flex-row items-center justify-between"
        >
          <Text className="text-slate-700">
            {selectedCow ? `${selectedCow.name} ${selectedCow.breed ? `(${selectedCow.breed})` : ""}` : "Select a Cow"}
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </Pressable>

        {selectedCycle && !loading && (
          <View className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
            <Text className="text-indigo-900 font-semibold mb-2">
              Lactation Cycle #{selectedCycle.lactationRound}
            </Text>
            <View className="space-y-1">
              {selectedCycle.startDate && (
                <Text className="text-sm text-indigo-700">
                  Started: {new Date(selectedCycle.startDate).toLocaleDateString()}
                </Text>
              )}
              {selectedCycle.calvingDate && (
                <Text className="text-sm text-indigo-700">
                  Calving: {new Date(selectedCycle.calvingDate).toLocaleDateString()}
                </Text>
              )}
              <Text className="text-sm text-indigo-700">
                Status: {selectedCycle.LactationStatus || "Active"}
              </Text>
              {selectedCycle.healthStatus && (
                <Text className="text-sm text-indigo-700">
                  Health: {selectedCycle.healthStatus}
                </Text>
              )}
            </View>
          </View>
        )}

        {loading && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="text-slate-600 mt-2">Loading forecast...</Text>
          </View>
        )}

        {!loading && predictions.length > 0 && (
          <View className="bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-slate-900 font-semibold mb-2">Full Lactation Forecast</Text>
            <Text className="text-xs text-slate-500 mb-4">
              Days predicted: {predictions.length} | Actual recorded: {predictions.filter(p => p.actualMilk > 0).length}
            </Text>

            <LineChart
              data={{
                labels: predictions.slice(0, Math.min(predictions.length, 60)).map((p) => `${p.milkingDay}`),
                datasets: [
                  { 
                    data: predictions.slice(0, Math.min(predictions.length, 60)).map((p) => p.actualMilk || 0), 
                    color: () => "#10b981",
                    strokeWidth: 2,
                  },
                  { 
                    data: predictions.slice(0, Math.min(predictions.length, 60)).map((p) => p.predictedMilk || 0), 
                    color: () => "#94a3b8",
                    strokeWidth: 2,
                  },
                ],
                legend: ["Actual", "Predicted"],
              }}
              width={Math.max(screenWidth - 48, Math.min(predictions.length, 60) * 6)}
              height={300}
              chartConfig={chartConfig}
              withDots={false}
              bezier
              style={{ borderRadius: 16 }}
            />
          </View>
        )}

        {!loading && predictions.length === 0 && (
          <View className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <Text className="text-slate-700 text-center">No prediction data available. Create a lactation cycle first.</Text>
          </View>
        )}
      </View>

      {/* Cow Selection Modal */}
      <Modal visible={showCowModal} transparent animationType="slide">
        <View className="flex-1 bg-white px-6 pt-12">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl text-slate-900">Select Cow</Text>
            <Pressable onPress={() => setShowCowModal(false)}>
              <X size={24} color="#334155" />
            </Pressable>
          </View>

          <TextInput
            placeholder="Search cow..."
            value={search}
            onChangeText={setSearch}
            className="border rounded-xl px-4 py-2 mb-4"
          />

          {cows.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-slate-500">No cows available</Text>
              <Text className="text-slate-400 text-sm mt-2">
                Make sure cows are created first
              </Text>
            </View>
          ) : (
            <ScrollView>
              {filteredCows.map((cow) => (
                <Pressable
                  key={cow._id}
                  onPress={() => {
                    setSelectedCow(cow);
                    setShowCowModal(false);
                    setSearch("");
                  }}
                  className="p-4 border-b"
                >
                  <Text className="text-slate-900">{cow.name}</Text>
                  <Text className="text-slate-500 text-sm">
                    {cow.breed || "No breed"}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
