import { useState } from "react";
import { View } from "react-native";
import { CattleDetail } from "../../../../components/heatStress/CattleDetail";
import { CattleList } from "../../../../components/heatStress/CattleList";

export interface Cattle {
  id: number;
  name: string;
  bodyTemp: number;
  stressLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  envTemp: number;
  humidity: number;
  collarStatus: 'active' | 'inactive';
}

export default function CattleListScreen() {
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [cattleData, setCattleData] = useState<Cattle[]>([
    { id: 1, name: 'Cattle 1', bodyTemp: 38.5, stressLevel: 'Low', envTemp: 28, humidity: 65, collarStatus: 'active' },
    { id: 2, name: 'Cattle 2', bodyTemp: 39.8, stressLevel: 'Moderate', envTemp: 32, humidity: 75, collarStatus: 'active' },
    { id: 3, name: 'Cattle 3', bodyTemp: 41.2, stressLevel: 'High', envTemp: 35, humidity: 80, collarStatus: 'active' },
    { id: 4, name: 'Cattle 4', bodyTemp: 42.5, stressLevel: 'Critical', envTemp: 38, humidity: 85, collarStatus: 'active' },
    { id: 5, name: 'Cattle 5', bodyTemp: 38.2, stressLevel: 'Low', envTemp: 27, humidity: 60, collarStatus: 'active' },
    { id: 6, name: 'Cattle 6', bodyTemp: 40.1, stressLevel: 'Moderate', envTemp: 33, humidity: 78, collarStatus: 'active' }
  ]);

  const updateCattleStatus = (id: number, status: 'active' | 'inactive') => {
    setCattleData(prev => prev.map(c => c.id === id ? { ...c, collarStatus: status } : c));
    setSelectedCattle(prev => prev?.id === id ? { ...prev, collarStatus: status } : prev);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      {!selectedCattle ? (
        <CattleList cattleData={cattleData} onSelectCattle={setSelectedCattle} />
      ) : (
        <CattleDetail cattle={selectedCattle} onBack={() => setSelectedCattle(null)} onStatusChange={updateCattleStatus} />
      )}
    </View>
  );
}
