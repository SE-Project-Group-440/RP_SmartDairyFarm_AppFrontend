import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { CattleDetail } from "../../../../components/heatStress/CattleDetail";
import { CattleList } from "../../../../components/heatStress/CattleList";
import { fetchCattleHeatData } from "../../../../services/cattleHeatApi";

// 🔹 Cattle interface (matches backend response)
export interface Cattle {
  id: string; 
  bodyTemp: number;
  stressLevel: "Low" | "Moderate" | "High" | "Critical";
  envTemp: number;
  humidity: number;
  collarStatus: "active" | "inactive";
  thi: number;
}

export default function CattleListScreen() {
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [cattleData, setCattleData] = useState<Cattle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Fetch real data from backend
  useEffect(() => {
    loadCattleData();
  }, []);

  const loadCattleData = async () => {
    try {
      setLoading(true);
      const data = await fetchCattleHeatData();

        const formatted = data.map((item: any) => ({
          id: item.cattleId,                         
          bodyTemp: item.bodyTemp,
          envTemp: item.envTemp,
          humidity: item.humidity,
          stressLevel: item.stressLevel,
          collarStatus: "active",          
          thi: item.thi
        }));

setCattleData(formatted);
    } catch (err) {
      console.error("Error loading cattle heat data:", err);
      setError("Failed to load cattle data");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Update collar/sprinkler status locally (optional backend sync later)
  const updateCattleStatus = (id: string, status: "active" | "inactive") => {
    setCattleData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, collarStatus: status } : c
      )
    );

    setSelectedCattle((prev) =>
      prev && prev.id === id ? { ...prev, collarStatus: status } : prev
    );
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0fdf4",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={{ marginTop: 12, color: "#374151" }}>
          Loading cattle heat data...
        </Text>
      </View>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0fdf4",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#dc2626", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  // ✅ Main UI
  return (
    <View style={{ flex: 1, backgroundColor: "#f0fdf4" }}>
      {!selectedCattle ? (
        <CattleList
          cattleData={cattleData}
          onSelectCattle={setSelectedCattle}
        />
      ) : (
        <CattleDetail
          cattle={selectedCattle}
          onBack={() => setSelectedCattle(null)}
          onStatusChange={updateCattleStatus}
        />
      )}
    </View>
  );
}