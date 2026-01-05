import { View, Text, Pressable, ScrollView } from "react-native";
import {
  Plus,
  List,
  Droplet,
  TrendingUp,
  Bell,
  Lightbulb,
  History,
  ChevronRight,
} from "lucide-react-native";

export type DairyScreen =
  | "add-cow"
  | "cow-list"
  | "milk-entry"
  | "analytics"
  | "forecasting"
  | "alerts"
  | "recommendations"
  | "history";

interface DairyDashboardProps {
  onNavigate: (screen: DairyScreen) => void;
  onCowSelect: (cowId: string) => void;
}

const mockCows = [
  { id: "1", name: "Lassie", status: "healthy", milk: 18.5 },
  { id: "2", name: "Bella", status: "warning", milk: 12.3 },
  { id: "3", name: "Daisy", status: "healthy", milk: 20.1 },
];

export function DairyDashboard({
  onNavigate,
  onCowSelect,
}: DairyDashboardProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const weatherIcon = hour < 18 ? "🌤️" : "🌙";

  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <Text className="text-2xl text-white mb-1">
          {greeting} {weatherIcon} Manujaya
        </Text>
        <Text className="text-green-100">
          Dairy Farm Management
        </Text>
      </View>

      {/* Quick Stats */}
      <View className="px-6 -mt-6 mb-6">
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text className="text-2xl text-green-600 mb-1">
                50.9L
              </Text>
              <Text className="text-xs text-slate-600">
                Today's Milk
              </Text>
            </View>

            <View className="flex-1 items-center border-x border-slate-200">
              <Text className="text-2xl text-slate-900 mb-1">
                {mockCows.length}
              </Text>
              <Text className="text-xs text-slate-600">
                Total Cows
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-2xl text-orange-600 mb-1">
                1
              </Text>
              <Text className="text-xs text-slate-600">
                Alerts
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-6 space-y-4 pb-6">
        {/* Cow Management */}
        <View>
          <Text className="text-slate-900 mb-3">
            Cow Management
          </Text>

          <View className="space-y-3">
            <Pressable
              onPress={() => onNavigate("add-cow")}
              className="bg-green-600 rounded-2xl p-5 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center">
                <Plus size={24} color="white" />
              </View>

              <View className="flex-1">
                <Text className="text-white mb-1">
                  Add New Cow
                </Text>
                <Text className="text-green-100 text-sm">
                  Register a new cow
                </Text>
              </View>

              <ChevronRight size={20} color="white" />
            </Pressable>

            <Pressable
              onPress={() => onNavigate("cow-list")}
              className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center">
                <List size={24} color="#334155" />
              </View>

              <View className="flex-1">
                <Text className="text-slate-900 mb-1">
                  Manage Cows
                </Text>
                <Text className="text-sm text-slate-600">
                  {mockCows.length} cows registered
                </Text>
              </View>

              <ChevronRight size={20} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        {/* Daily Operations */}
        <View>
          <Text className="text-slate-900 mb-3">
            Daily Operations
          </Text>

          <Pressable
            onPress={() => onNavigate("milk-entry")}
            className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex-row items-center gap-4"
          >
            <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
              <Droplet size={24} color="#2563eb" />
            </View>

            <View className="flex-1">
              <Text className="text-slate-900 mb-1">
                Record Milk Data
              </Text>
              <Text className="text-sm text-slate-600">
                2 of 3 cows recorded today
              </Text>
            </View>

            <ChevronRight size={20} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Analytics */}
        <View>
          <Text className="text-slate-900 mb-3">
            Analytics & Insights
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => onNavigate("analytics")}
              className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-4"
            >
              <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center mb-3">
                <TrendingUp size={20} color="#7c3aed" />
              </View>
              <Text className="text-slate-900 mb-1">
                Analytics
              </Text>
              <Text className="text-xs text-slate-600">
                Daily & weekly
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onNavigate("forecasting")}
              className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-4"
            >
              <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mb-3">
                <TrendingUp size={20} color="#4f46e5" />
              </View>
              <Text className="text-slate-900 mb-1">
                Forecasting
              </Text>
              <Text className="text-xs text-slate-600">
                Weekly & monthly
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Smart Features */}
        <View>
          <Text className="text-slate-900 mb-3">
            Smart Features
          </Text>

          <View className="space-y-3">
            <Pressable
              onPress={() => onNavigate("alerts")}
              className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center">
                <Bell size={24} color="#ea580c" />
              </View>

              <View className="flex-1">
                <Text className="text-slate-900 mb-1">
                  Alerts & Notifications
                </Text>
                <Text className="text-sm text-slate-600">
                  1 alert needs attention
                </Text>
              </View>

              <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs">1</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* History */}
        <Pressable
          onPress={() => onNavigate("history")}
          className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex-row items-center gap-4"
        >
          <View className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center">
            <History size={24} color="#334155" />
          </View>

          <View className="flex-1">
            <Text className="text-slate-900 mb-1">
              View History
            </Text>
            <Text className="text-sm text-slate-600">
              Access past records
            </Text>
          </View>

          <ChevronRight size={20} color="#94a3b8" />
        </Pressable>

        {/* Recent Activity */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-900 mb-4">
            Recent Activity
          </Text>

          <View className="space-y-3">
            {mockCows.slice(0, 2).map((cow) => (
              <Pressable
                key={cow.id}
                onPress={() => onCowSelect(cow.id)}
                className="flex-row items-center gap-3 p-3 rounded-xl"
              >
                <View className="w-10 h-10 bg-amber-200 rounded-lg items-center justify-center">
                  <Text className="text-lg">🐄</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-sm text-slate-900">
                    {cow.name}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {cow.milk}L today
                  </Text>
                </View>

                <View
                  className={`px-2 py-1 rounded-full ${
                    cow.status === "healthy"
                      ? "bg-green-100"
                      : "bg-orange-100"
                  }`}
                >
                  <Text className="text-xs">
                    {cow.status === "healthy" ? "✓" : "⚠"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
