import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react-native";

interface CowListScreenProps {
  onCowSelect: (cowId: string) => void;
  onBack: () => void;
}

const mockCows = [
  {
    id: "1",
    name: "Lassie",
    breed: "Jersey",
    age: "4y 3m",
    lactationNumber: 3,
    lactationDay: 142,
    status: "healthy",
    avgMilk: 18.5,
  },
  {
    id: "2",
    name: "Bella",
    breed: "Holstein Friesian",
    age: "3y 1m",
    lactationNumber: 2,
    lactationDay: 89,
    status: "warning",
    avgMilk: 12.3,
  },
  {
    id: "3",
    name: "Daisy",
    breed: "Jersey Cross",
    age: "5y 8m",
    lactationNumber: 4,
    lactationDay: 201,
    status: "healthy",
    avgMilk: 20.1,
  },
];

export function CowListScreen({
  onCowSelect,
  onBack,
}: CowListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCows = mockCows.filter(
    (cow) =>
      cow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cow.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const healthyCount = mockCows.filter(
    (c) => c.status === "healthy"
  ).length;
  const warningCount = mockCows.filter(
    (c) => c.status === "warning"
  ).length;

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-6">
        <Pressable
          onPress={onBack}
          className="mb-4 flex-row items-center gap-2"
        >
          <ArrowLeft size={20} color="#dcfce7" />
          <Text className="text-green-100">
            Back to Dashboard
          </Text>
        </Pressable>

        <Text className="text-2xl text-white mb-1">
          Manage Cows
        </Text>
        <Text className="text-green-100">
          {mockCows.length} cows registered
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
            placeholder="Search by name or breed..."
            className="pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl"
          />
        </View>

        {/* Filter Summary */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-slate-600">
            {filteredCows.length}{" "}
            {filteredCows.length === 1 ? "cow" : "cows"} found
          </Text>

          <View className="flex-row gap-2">
            <View className="px-3 py-1 bg-green-100 rounded-full">
              <Text className="text-xs text-green-700">
                {healthyCount} Healthy
              </Text>
            </View>
            <View className="px-3 py-1 bg-orange-100 rounded-full">
              <Text className="text-xs text-orange-700">
                {warningCount} Monitor
              </Text>
            </View>
          </View>
        </View>

        {/* Cow Cards */}
        <View className="space-y-3">
          {filteredCows.map((cow) => (
            <View
              key={cow.id}
              className="bg-white rounded-2xl p-5 border border-slate-100"
            >
              {/* Main Info */}
              <View className="flex-row gap-4 mb-4">
                <View className="w-16 h-16 bg-amber-200 rounded-xl items-center justify-center">
                  <Text className="text-2xl">🐄</Text>
                </View>

                <View className="flex-1">
                  <View className="flex-row justify-between mb-2">
                    <View>
                      <Text className="text-slate-900 mb-1">
                        {cow.name}
                      </Text>
                      <Text className="text-sm text-slate-600">
                        {cow.breed}
                      </Text>
                    </View>

                    <View
                      className={`px-3 py-1 rounded-full ${
                        cow.status === "healthy"
                          ? "bg-green-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          cow.status === "healthy"
                            ? "text-green-700"
                            : "text-orange-700"
                        }`}
                      >
                        {cow.status === "healthy"
                          ? "✓ Healthy"
                          : "⚠ Monitor"}
                      </Text>
                    </View>
                  </View>

                  {/* Stats */}
                  <View className="flex-row flex-wrap gap-y-2">
                    <Text className="w-1/2 text-sm text-slate-600">
                      Age:{" "}
                      <Text className="text-slate-900">
                        {cow.age}
                      </Text>
                    </Text>
                    <Text className="w-1/2 text-sm text-slate-600">
                      Lactation:{" "}
                      <Text className="text-slate-900">
                        #{cow.lactationNumber}
                      </Text>
                    </Text>
                    <Text className="w-1/2 text-sm text-slate-600">
                      Day:{" "}
                      <Text className="text-slate-900">
                        {cow.lactationDay}
                      </Text>
                    </Text>
                    <Text className="w-1/2 text-sm text-slate-600">
                      Avg Milk:{" "}
                      <Text className="text-slate-900">
                        {cow.avgMilk}L
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => onCowSelect(cow.id)}
                  className="flex-1 bg-green-600 rounded-xl py-2.5 flex-row items-center justify-center gap-2"
                >
                  <Eye size={16} color="white" />
                  <Text className="text-white text-sm">
                    View Profile
                  </Text>
                </Pressable>

                <Pressable className="px-4 bg-slate-100 rounded-xl py-2.5">
                  <Edit size={16} color="#334155" />
                </Pressable>

                <Pressable className="px-4 bg-red-50 rounded-xl py-2.5">
                  <Trash2 size={16} color="#dc2626" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {filteredCows.length === 0 && (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-slate-900 mb-2">
              No cows found
            </Text>
            <Text className="text-sm text-slate-600">
              Try adjusting your search
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
