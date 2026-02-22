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
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
  labelColor: () => "#475569",
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#fff",
  },
  propsForBackgroundLines: {
    strokeDasharray: "", 
    stroke: "#e2e8f0",
  },
};

  useEffect(() => {
    
    fetchStoreCows().catch((err) => {
      console.warn("Store fetch failed, falling back to API", err);
      
      api
        .get("/cows")
        .then((res) => setCows(res.data || []))
        .catch((e) => console.warn("Direct API fetch also failed", e));
    });
  }, []);

  useEffect(() => {
    
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

      
      const data = res.data?.predictions || [];
      const normalized = data.map((d: any) => ({
        milkingDay: d.milkingDay || 0,
        predictedMilk: d.predictedMilk || 0,
        actualMilk: d.actualMilk || 0,
        datePred: d.datePred,
        completed: d.completed,
      }));
      
     
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
          <>
            <View className="bg-white rounded-2xl p-5 border border-slate-100">
              <Text className="text-slate-900 font-semibold mb-2">Full Lactation Forecast</Text>
              <Text className="text-xs text-slate-500 mb-4">
                Days predicted: {predictions.length} | Actual recorded: {predictions.filter(p => p.actualMilk > 0).length}
              </Text>

              {(() => {
 const displayData = predictions.slice(0, Math.min(predictions.length, 280));

const totalDays = displayData.length;
const interval = Math.floor(totalDays / 6);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <LineChart
        data={{
          labels: displayData.map((p, index) => {
  if (index === 0) return "D1";
  if (index === totalDays - 1) return `D${p.milkingDay}`;
  if (index % interval === 0) return `D${p.milkingDay}`;
  return "";
}),
          datasets: [
            {
              data: displayData.map((p) => p.actualMilk || 0),
              color: () => "#10b981",
              strokeWidth: 3,
            },
            {
              data: displayData.map((p) => p.predictedMilk || 0),
              color: () => "#6366f1",
              strokeWidth: 2,
            },
          ],
          legend: ["Actual (L)", "Predicted (L)"],
        }}
       width={Math.max(screenWidth - 48, displayData.length * 6)}
        height={300}
        fromZero
        yAxisSuffix="L"
        chartConfig={chartConfig}
        withDots={false}
        withVerticalLines={false}
        withOuterLines={false}
        withInnerLines={true}
        style={{ borderRadius: 16 }}
      />
    </ScrollView>
  );
})()}
            </View>

            {/* Summary Statistics */}
            <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 space-y-3">
              <Text className="text-lg font-bold text-green-900">📊 Performance Summary</Text>
              
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-700">Total Predicted</Text>
                  <Text className="text-xl font-bold text-slate-900">{predictions.reduce((sum, p) => sum + (p.predictedMilk || 0), 0).toFixed(1)} L</Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-700">Total Actual</Text>
                  <Text className="text-xl font-bold text-green-600">{predictions.reduce((sum, p) => sum + (p.actualMilk || 0), 0).toFixed(1)} L</Text>
                </View>

                <View className="border-b border-green-200 mb-2" />

                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-700">Days Recorded</Text>
                  <Text className="font-semibold text-slate-900">{predictions.filter(p => p.actualMilk > 0).length} / {predictions.length}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-700">Avg Daily (Actual)</Text>
                  <Text className="font-semibold text-slate-900">
                    {predictions.length > 0 ? (predictions.reduce((sum, p) => sum + (p.actualMilk || 0), 0) / predictions.filter(p => p.actualMilk > 0).length || 0).toFixed(2) : 0} L
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-700">Avg Daily (Predicted)</Text>
                  <Text className="font-semibold text-slate-600">
                    {(predictions.reduce((sum, p) => sum + (p.predictedMilk || 0), 0) / predictions.length).toFixed(2)} L
                  </Text>
                </View>
              </View>

              {/* Performance badge */}
              {(() => {
                const actualSum = predictions.reduce((sum, p) => sum + (p.actualMilk || 0), 0);
                const predictedSum = predictions.reduce((sum, p) => sum + (p.predictedMilk || 0), 0);
                const variance = ((actualSum - predictedSum) / predictedSum * 100);
                
                return (
                  <View className={`p-3 rounded-xl ${variance > 5 ? 'bg-blue-100' : variance < -5 ? 'bg-orange-100' : 'bg-green-100'}`}>
                    <Text className={`text-sm font-semibold text-center ${variance > 5 ? 'text-blue-900' : variance < -5 ? 'text-orange-900' : 'text-green-900'}`}>
                      {variance > 5 ? `✅ Performing ${variance.toFixed(1)}% above prediction` : variance < -5 ? `⚠️ ${Math.abs(variance).toFixed(1)}% below prediction` : `✓ On track with prediction`}
                    </Text>
                  </View>
                );
              })()}
            </View>

            {/* Daily breakdown for first 14 days */}
            {predictions.length > 0 && (
              <View className="bg-white rounded-2xl p-5 border border-slate-100">
                <Text className="text-slate-900 font-semibold mb-3">📅 Recent Activity</Text>
                <View className="space-y-2">
                  {predictions.slice(0, 14).map((pred, idx) => (
                    <View key={idx} className="flex-row items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <View className="flex-1">
                        <Text className="font-semibold text-slate-900">Day {pred.milkingDay}</Text>
                        <Text className="text-xs text-slate-500">
                          {pred.datePred ? new Date(pred.datePred).toLocaleDateString() : ""}
                        </Text>
                      </View>
                      
                      <View className="flex-row gap-3 items-center">
                        {pred.actualMilk > 0 ? (
                          <>
                            <View className="items-end">
                              <Text className="text-sm font-semibold text-green-600">{pred.actualMilk.toFixed(1)}L</Text>
                              <Text className="text-xs text-slate-500">recorded</Text>
                            </View>
                            <View className="bg-green-100 px-2 py-1 rounded-full">
                              <Text className="text-xs font-semibold text-green-700">✓</Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <View className="items-end">
                              <Text className="text-sm font-semibold text-slate-600">{pred.predictedMilk.toFixed(1)}L</Text>
                              <Text className="text-xs text-slate-500">predicted</Text>
                            </View>
                            <View className="bg-slate-200 px-2 py-1 rounded-full">
                              <Text className="text-xs text-slate-600">-</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
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
