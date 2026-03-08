import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTranslation from "../../../../hooks/useTranslation";
import { getPredictionHistory, PredictionRecord } from "../../../../services/diseaseService";

interface HealthHistoryScreenProps {
  onBack: () => void;
}

export default function HealthHistoryScreen({ onBack }: HealthHistoryScreenProps) {
  const { t } = useTranslation();
  const [healthRecords, setHealthRecords] = useState<PredictionRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    loadHealthRecords();
  }, []);

  const loadHealthRecords = async () => {
    try {
      setError(null);
      const records = await getPredictionHistory();
      setHealthRecords(records);
    } catch (error) {
      console.error("Error loading health records:", error);
      setError("Failed to load health records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setError(null);
      const records = await getPredictionHistory();
      setHealthRecords(records);
    } catch (error) {
      console.error("Error refreshing health records:", error);
      setError("Failed to refresh health records. Please try again.");
    } finally {
      setRefreshing(false);
    }
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

  const filterRecords = (records: PredictionRecord[]) => {
    if (selectedFilter === "all") return records;
    return records.filter(record => record.status === selectedFilter);
  };

  const filters = [
    { key: "all", label: t("disease", "all") || "All", count: healthRecords.length },
    { key: "healthy", label: t("disease", "healthy") || "Healthy", count: healthRecords.filter(r => r.status === "healthy").length },
    { key: "sick", label: "Needs Attention", count: healthRecords.filter(r => r.status === "sick").length },
    { key: "recovering", label: t("disease", "recovering") || "Recovering", count: healthRecords.filter(r => r.status === "recovering").length },
    { key: "critical", label: "Critical", count: healthRecords.filter(r => r.status === "critical").length }
  ];

  const filteredRecords = filterRecords(healthRecords);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-100">
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
        
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-slate-500 mt-4">Loading health records...</Text>
        </View>
      </View>
    );
  }

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

        {error ? (
          <View className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm items-center">
            <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
            <Text className="text-red-600 text-lg font-medium mt-3">
              Error Loading Records
            </Text>
            <Text className="text-red-500 text-sm mt-1 text-center">
              {error}
            </Text>
            <Pressable 
              onPress={loadHealthRecords}
              className="bg-red-600 rounded-full px-6 py-2 mt-4"
            >
              <Text className="text-white font-medium">Retry</Text>
            </Pressable>
          </View>
        ) : filteredRecords.length === 0 ? (
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
                      {record.cowName ? `${record.cowName} (ID: ${record.cowId})` : `Cow ID: ${record.cowId}`}
                    </Text>
                    <Text className="text-slate-500 text-sm">{formatDate(record.date)}</Text>
                    {record.predictionType && (
                      <Text className="text-blue-600 text-xs mt-1">
                        Method: {record.predictionType.charAt(0).toUpperCase() + record.predictionType.slice(1)}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
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
                        {record.status === 'healthy' ? 'Healthy' : 
                         record.status === 'sick' ? 'Needs Attention' :
                         record.status === 'recovering' ? 'Recovering' :
                         record.status === 'critical' ? 'Critical' : 
                         record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Text>
                    </View>
                    {record.confidence && (
                      <Text className="text-xs text-slate-500 mt-1">
                        Confidence: {Math.round(record.confidence)}%
                      </Text>
                    )}
                  </View>
                </View>

                <View className="border-t border-slate-200 pt-3">
                  <Text className="font-medium text-slate-800 mb-1">Prediction:</Text>
                  <Text className="text-slate-600 mb-3">{record.diagnosis}</Text>

                  {record.symptoms && record.symptoms.length > 0 && (
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

                  {record.careInstructions && (
                    <>
                      <Text className="font-medium text-slate-800 mb-1">Care Instructions:</Text>
                      <Text className="text-slate-600 mb-3">{record.careInstructions}</Text>
                    </>
                  )}

                  {record.severity && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons 
                        name="warning" 
                        size={16} 
                        color={record.severity === 'high' ? '#dc2626' : record.severity === 'medium' ? '#d97706' : '#059669'} 
                      />
                      <Text 
                        className="text-sm ml-1 font-medium"
                        style={{ 
                          color: record.severity === 'high' ? '#dc2626' : record.severity === 'medium' ? '#d97706' : '#059669'
                        }}
                      >
                        Severity: {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
                      </Text>
                    </View>
                  )}

                  {record.veterinarianConsulted !== undefined && (
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={record.veterinarianConsulted ? "checkmark-circle" : "time"} 
                        size={16} 
                        color={record.veterinarianConsulted ? "#059669" : "#d97706"} 
                      />
                      <Text className="text-slate-500 text-sm ml-1">
                        {record.veterinarianConsulted ? "Veterinarian consulted" : "Veterinarian consultation recommended"}
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