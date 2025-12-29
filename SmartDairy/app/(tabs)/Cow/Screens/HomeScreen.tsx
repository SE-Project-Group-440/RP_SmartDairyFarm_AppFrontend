import { ScrollView, View, Text, Pressable } from "react-native";
import {
  Sun,
  Droplet,
  Activity,
  AlertTriangle,
  ChevronRight,
  Eye,
} from "lucide-react-native";

type Screen =
  | "home"
  | "alerts"
  | "cow-profile"
  | "cow-list";

interface HomeScreenProps {
  onCowSelect: (cowId: string) => void;
  onNavigate: (screen: Screen) => void;
}

const mockCows = [
  { id: "1", name: "Lassie", status: "healthy", milk: 18.5, lactationDay: 142 },
  { id: "2", name: "Bella", status: "warning", milk: 12.3, lactationDay: 89 },
  { id: "3", name: "Daisy", status: "healthy", milk: 20.1, lactationDay: 201 },
];

export function HomeScreen({ onCowSelect, onNavigate }: HomeScreenProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const weatherIcon = currentHour < 18 ? "🌤️" : "🌙";

  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <Text className="text-2xl text-white mb-1">
          {greeting} {weatherIcon} Manujaya
        </Text>
        <Text className="text-green-100">
          Your farm looks healthy today
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="px-6 -mt-6 space-y-4 mb-6">
        {/* Milk Yield */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between">
            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center">
                  <Droplet size={20} color="#2563eb" />
                </View>
                <Text className="text-slate-600">
                  Today’s Milk Yield
                </Text>
              </View>

              <Text className="text-3xl text-slate-900 mb-1">
                50.9 L
              </Text>

              <View className="flex-row items-center gap-2">
                <Text className="text-green-600 text-sm">
                  ↗ +5.2%
                </Text>
                <Text className="text-slate-400 text-sm">
                  vs yesterday
                </Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-xs text-slate-500 mb-1">
                3 cows milked
              </Text>

              <View className="flex-row gap-1">
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="w-2 bg-green-500 rounded-full"
                    style={{ height: 20 + i * 8 }}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Cow Health */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center">
              <Activity size={20} color="#16a34a" />
            </View>
            <Text className="text-slate-600">
              Cow Health Status
            </Text>
          </View>

          <View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-slate-600">
                Overall Health
              </Text>
              <Text className="text-sm text-green-600">
                92%
              </Text>
            </View>

            <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-green-500 w-[92%]" />
            </View>
          </View>

          <View className="flex-row justify-between mt-4">
            <View className="items-center flex-1">
              <Text className="text-xl text-green-600">2</Text>
              <Text className="text-xs text-slate-500">Healthy</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-xl text-orange-500">1</Text>
              <Text className="text-xs text-slate-500">Monitor</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-xl text-slate-400">0</Text>
              <Text className="text-xs text-slate-500">Critical</Text>
            </View>
          </View>
        </View>

        {/* Alerts */}
        <Pressable
          onPress={() => onNavigate("alerts")}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-5"
        >
          <View className="flex-row justify-between">
            <View className="flex-row gap-3">
              <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center">
                <AlertTriangle size={20} color="#ea580c" />
              </View>
              <View>
                <Text className="text-slate-900 mb-1">
                  1 Alert Needs Attention
                </Text>
                <Text className="text-sm text-slate-600">
                  Bella showing milk yield drop
                </Text>
              </View>
            </View>

            <ChevronRight size={20} color="#94a3b8" />
          </View>
        </Pressable>
      </View>

      {/* Cow List */}
      <View className="px-6 pb-6">
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg text-slate-900">
            Your Cows
          </Text>
          <Text className="text-sm text-green-600">
            View All
          </Text>
        </View>

        {mockCows.map((cow) => (
          <Pressable
            key={cow.id}
            onPress={() => onCowSelect(cow.id)}
            className="bg-white rounded-2xl p-4 border border-slate-100 mb-3"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 bg-amber-200 rounded-xl items-center justify-center">
                <Text className="text-2xl">🐄</Text>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-slate-900">
                    {cow.name}
                  </Text>
                  {cow.status === "healthy" ? (
                    <Text className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      ✓ Healthy
                    </Text>
                  ) : (
                    <Text className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                      ⚠ Monitor
                    </Text>
                  )}
                </View>

                <Text className="text-sm text-slate-600">
                  Day {cow.lactationDay} • {cow.milk}L today
                </Text>
              </View>

              <Eye size={20} color="#94a3b8" />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
