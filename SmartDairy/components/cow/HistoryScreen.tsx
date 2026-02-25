import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import {
  ArrowLeft,
  Calendar,
  Search,
  Droplet,
  TrendingUp,
  FileText,
} from "lucide-react-native";

interface HistoryScreenProps {
  onBack: () => void;
}

import { api } from "../../hooks/api";

interface HistoryRecord {
  id: string;
  date: string; // YYYY-MM-DD
  type: "milk" | "cow" ;
  cowName: string;
  value: string;
  notes?: string | null;
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  const [filterType, setFilterType] = useState<"all" | "milk" | "cow" >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/cows/history/recent");
        if (mounted && res.data && res.data.success) {
          setRecords(res.data.data || []);
        }
      } catch (e) {
        console.warn("Failed to load history", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const filteredHistory = records.filter((record) => {
    const matchesType = filterType === "all" || (record.type === filterType) || (filterType === "milk" && record.type === "milk");
    const matchesSearch =
      record.cowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const groupByDate = (records: HistoryRecord[]) => {
    const grouped: Record<string, HistoryRecord[]> = {};
    records.forEach((r) => {
      if (!grouped[r.date]) grouped[r.date] = [];
      grouped[r.date].push(r);
    });
    return grouped;
  };

  const groupedHistory = groupByDate(filteredHistory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getIcon = (type: HistoryRecord["type"]) => {
    switch (type) {
      case "milk":
        return <Droplet size={20} color="#2563eb" />;
      case "cow":
        return <FileText size={20} color="#7c3aed" />;
    }
  };

  const getBadgeStyle = (type: HistoryRecord["type"]) => {
    switch (type) {
      case "milk":
        return "bg-blue-100 text-blue-700";
      case "cow":
        return "bg-purple-100 text-purple-700";
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-slate-800 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="mb-4 flex-row items-center gap-2"
        >
          <ArrowLeft size={20} color="#cbd5f5" />
          <Text className="text-slate-300">
            Back to Dashboard
          </Text>
        </Pressable>

        <Text className="text-2xl text-white mb-1">
          History
        </Text>
        <Text className="text-slate-300">
          View past records and activities
        </Text>
      </View>

      <View className="px-6 py-6 space-y-4">
        {/* Search */}
        <View className="relative">
          <View className="absolute left-4 top-3.5 z-10">
            <Search size={20} color="#94a3b8" />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search history..."
            className="pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl"
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {["all", "milk", "health", "feed"].map((type) => (
              <Pressable
                key={type}
                onPress={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-xl ${
                  filterType === type
                    ? type === "milk"
                      ? "bg-blue-600"
                      : type === "cow"
                      ? "bg-purple-600"
                      : "bg-slate-700"
                    : "bg-white border-2 border-slate-200"
                }`}
              >
                <Text
                  className={
                    filterType === type
                      ? "text-white"
                      : "text-slate-700"
                  }
                >
                  {type === "all"
                    ? "All Records"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* History List */}
        {Object.keys(groupedHistory).length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-4xl mb-4">📋</Text>
            <Text className="text-slate-900 mb-2">
              No records found
            </Text>
            <Text className="text-sm text-slate-600">
              Try adjusting your filters
            </Text>
          </View>
        ) : (
          Object.keys(groupedHistory)
            .sort()
            .reverse()
            .map((date) => (
              <View key={date} className="space-y-3">
                {/* Date Header */}
                <View className="flex-row items-center gap-3">
                  <Calendar size={16} color="#64748b" />
                  <Text className="text-slate-900">
                    {formatDate(date)}
                  </Text>
                  <View className="flex-1 h-px bg-slate-200" />
                </View>

                {/* Records */}
                {groupedHistory[date].map((record) => (
                  <View
                    key={record.id}
                    className="bg-white rounded-xl p-4 border border-slate-100"
                  >
                    <View className="flex-row gap-3">
                      <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center">
                        {getIcon(record.type)}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row justify-between mb-2">
                          <View>
                            <Text className="text-slate-900 mb-1">
                              {record.cowName}
                            </Text>
                            <Text className="text-sm text-slate-600">
                              {record.value}
                            </Text>
                          </View>

                          <View
                            className={`px-2 py-1 rounded-full ${getBadgeStyle(
                              record.type
                            )}`}
                          >
                            <Text className="text-xs">
                              {record.type}
                            </Text>
                          </View>
                        </View>

                        {record.notes && (
                          <View className="bg-slate-50 px-3 py-2 rounded-lg">
                            <Text className="text-xs text-slate-500">
                              {record.notes}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))
        )}

        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-900 mb-4">Summary</Text>

          <View className="flex-row justify-between text-center">
            <View className="flex-1">
              <Text className="text-2xl text-blue-600 mb-1">
                {records.filter((r) => r.type === "milk").length}
              </Text>
              <Text className="text-xs text-slate-600">Milk Records</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl text-purple-600 mb-1">
                {records.filter((r) => r.type === "cow").length}
              </Text>
              <Text className="text-xs text-slate-600">Cows Added</Text>
            </View>
           
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
