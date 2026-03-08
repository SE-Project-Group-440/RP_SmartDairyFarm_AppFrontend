import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTranslation from "../../../../hooks/useTranslation";

interface HealthRecord {
  id: string;
  cowId: string;
  cowName: string;
  date: string;
  diagnosis: string;
  status: 'healthy' | 'sick' | 'recovering' | 'critical';
  symptoms: string[];
  treatment?: string;
  veterinarian?: string;
}

interface HealthHistoryScreenProps {
  onBack: () => void;
}

export default function HealthHistoryScreen({ onBack }: HealthHistoryScreenProps) {
  const { t } = useTranslation();
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Mock data - replace with actual API call
  useEffect(() => {
    loadHealthRecords();
  }, []);

  const loadHealthRecords = () => {
    // TODO: Replace with actual API call
    const mockRecords: HealthRecord[] = [
      {
        id: "1",
        cowId: "12",
        cowName: "Bella",
        date: "2024-03-05",
        diagnosis: "Foot and Mouth Disease",
        status: "recovering",
        symptoms: ["Blisters", "Salivation", "Fever"],
        treatment: "Antiviral medication, Isolation",
        veterinarian: "Dr. Smith"
      },
      {
        id: "2",
        cowId: "18",
        cowName: "Daisy",
        date: "2024-03-03",
        diagnosis: "Lumpy Skin Disease",
        status: "sick",
        symptoms: ["Nodules", "Skin lesions", "Reduced appetite"],
        treatment: "Supportive care, Monitoring",
        veterinarian: "Dr. Johnson"
      },
      {
        id: "3",
        cowId: "7",
        cowName: "Luna",
        date: "2024-02-28",
        diagnosis: "Healthy",
        status: "healthy",
        symptoms: [],
        veterinarian: "Dr. Smith"
      },
      {
        id: "4",
        cowId: "15",
        cowName: "Rose",
        date: "2024-02-25",
        diagnosis: "Respiratory infection",
        status: "healthy",
        symptoms: ["Nasal discharge", "Cough"],
        treatment: "Antibiotics - Completed",
        veterinarian: "Dr. Johnson"
      }
    ];

    setHealthRecords(mockRecords);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    loadHealthRecords();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "#059669";
      case "sick": return "#dc2626";
      case "recovering": return "#d97706";
      case "critical": return "#7c2d12";
      default: return "#64748b";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return "checkmark-circle";
      case "sick": return "warning";
      case "recovering": return "time";
      case "critical": return "alert-circle";
      default: return "help-circle";
    }
  };

  const filterRecords = (records: HealthRecord[]) => {
    if (selectedFilter === "all") return records;
    return records.filter(record => record.status === selectedFilter);
  };

  const filters = [
    { key: "all", label: t("disease", "all") || "All", count: healthRecords.length },
    { key: "healthy", label: t("disease", "healthy") || "Healthy", count: healthRecords.filter(r => r.status === "healthy").length },
    { key: "sick", label: t("disease", "sick") || "Sick", count: healthRecords.filter(r => r.status === "sick").length },
    { key: "recovering", label: t("disease", "recovering") || "Recovering", count: healthRecords.filter(r => r.status === "recovering").length }
  ];

  const filteredRecords = filterRecords(healthRecords);

  return (
    <ScrollView 
      className="flex-1 bg-slate-100"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View className="bg-green-600 px-6 pt-12 pb-10 rounded-b-3xl">
        <View className="flex-row items-center mb-4">
          <Pressable onPress={onBack} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">
            {t("disease", "healthHistory")}
          </Text>
        </View>
        <Text className="text-green-100 text-sm">
          View past health records
        </Text>
      </View>

      <View className="px-6 -mt-6">
        {/* FILTER BUTTONS */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {filters.map((filter) => (
                <Pressable
                  key={filter.key}
                  onPress={() => setSelectedFilter(filter.key)}
                  className={`rounded-full px-4 py-2 mr-3 ${
                    selectedFilter === filter.key 
                      ? "bg-green-600" 
                      : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedFilter === filter.key 
                        ? "text-white" 
                        : "text-slate-600"
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* HEALTH RECORDS LIST */}
        <Text className="text-lg font-semibold text-slate-800 mb-4">
          Records ({filteredRecords.length})
        </Text>

        {filteredRecords.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm items-center">
            <Ionicons name="document-text-outline" size={48} color="#64748b" />
            <Text className="text-slate-500 text-lg font-medium mt-3">
              No records found
            </Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">
              Pull down to refresh or check a different filter
            </Text>
          </View>
        ) : (
          <View className="mb-6">
            {filteredRecords.map((record) => (
              <View key={record.id} className="bg-white rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-slate-800">
                      Cow #{record.cowId} - {record.cowName}
                    </Text>
                    <Text className="text-slate-500 text-sm">{record.date}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={getStatusIcon(record.status)} 
                      size={20} 
                      color={getStatusColor(record.status)} 
                    />
                    <Text 
                      className="text-sm font-medium ml-1"
                      style={{ color: getStatusColor(record.status) }}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-slate-200 pt-3">
                  <Text className="font-medium text-slate-800 mb-1">Diagnosis:</Text>
                  <Text className="text-slate-600 mb-3">{record.diagnosis}</Text>

                  {record.symptoms.length > 0 && (
                    <>
                      <Text className="font-medium text-slate-800 mb-1">Symptoms:</Text>
                      <View className="flex-row flex-wrap mb-3">
                        {record.symptoms.map((symptom, index) => (
                          <View key={index} className="bg-red-100 rounded-full px-3 py-1 mr-2 mb-2">
                            <Text className="text-red-700 text-xs">{symptom}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                  {record.treatment && (
                    <>
                      <Text className="font-medium text-slate-800 mb-1">Treatment:</Text>
                      <Text className="text-slate-600 mb-3">{record.treatment}</Text>
                    </>
                  )}

                  {record.veterinarian && (
                    <View className="flex-row items-center">
                      <Ionicons name="person" size={16} color="#64748b" />
                      <Text className="text-slate-500 text-sm ml-1">
                        Examined by: {record.veterinarian}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}