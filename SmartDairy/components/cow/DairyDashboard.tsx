import { useEffect, useState } from "react";
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
import { api } from "../../hooks/api";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuthStore } from "@/Store/auth.store";

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



export function DairyDashboard({
  onNavigate,
  onCowSelect,
}: DairyDashboardProps) {
  const { t } = useTranslations();
  const user = useAuthStore((s) => s.user);

  const [dashboardData, setDashboardData] = useState({
    todaysMilk: 0,
    totalCows: 0,
    activeAlerts: 0,
  });
  const [cowsRecordedToday, setCowsRecordedToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchCowsRecordedToday();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/summary");
      if (res.data?.success && res.data?.summary) {
        setDashboardData(res.data.summary);
      }
    } catch (error) {
      console.warn("Failed to fetch dashboard data", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCowsRecordedToday = async () => {
    try {
      // endpoint should return list of milk entries for today
      const res = await api.get("/milk/today");
      if (Array.isArray(res.data)) {
        setCowsRecordedToday(res.data.length);
      } else if (res.data?.success && Array.isArray(res.data.data)) {
        setCowsRecordedToday(res.data.data.length);
      }
    } catch (err) {
      console.warn("Failed to fetch todays milk records", err);
    }
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboard', 'goodMorning')
      : hour < 18
        ? t('dashboard', 'goodAfternoon')
        : t('dashboard', 'goodEvening');

  const weatherIcon = hour < 18 ? "🌤️" : "🌙";

  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <Text className="text-2xl text-white mb-1">
          {greeting} {weatherIcon} {user?.name || user?.email || "Farmer"}
        </Text>
        <Text className="text-green-100">
          {t('dashboard', 'dairyFarmManagement')}
        </Text>
      </View>

      {/* Quick Stats */}
      <View className="px-6 -mt-6 mb-6">
        <View className="bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text className="text-2xl text-green-600 mb-1">
                {dashboardData.todaysMilk}L
              </Text>
              <Text className="text-xs text-slate-600">
                {t('dashboard', 'todaysMilk')}
              </Text>
            </View>

            <View className="flex-1 items-center border-x border-slate-200">
              <Text className="text-2xl text-slate-900 mb-1">
                {dashboardData.totalCows}
              </Text>
              <Text className="text-xs text-slate-600">
                {t('dashboard', 'totalCows')}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-2xl text-orange-600 mb-1">
                {dashboardData.activeAlerts}
              </Text>
              <Text className="text-xs text-slate-600">
                {t('dashboard', 'alerts')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-6 space-y-4 pb-6">
        {/* Cow Management */}
        <View>
          <Text className="text-slate-900 mb-3">
            {t('dashboard', 'cowManagement')}
          </Text>

          <View className="space-y-3 gap-2">
            <Pressable
              onPress={() => onNavigate("add-cow")}
              className="bg-green-600 rounded-2xl p-5 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center">
                <Plus size={24} color="white" />
              </View>

              <View className="flex-1">
                <Text className="text-white mb-1">
                  {t('dashboard', 'addNewCow')}
                </Text>
                <Text className="text-green-100 text-sm">
                  {t('dashboard', 'registerNewCow')}
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
                  {t('dashboard', 'manageCows')}
                </Text>
                <Text className="text-sm text-slate-600">
                  {dashboardData.totalCows} {t('dashboard', 'cowsRegistered')}
                </Text>
              </View>

              <ChevronRight size={20} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        {/* Daily Operations */}
        <View>
          <Text className="text-slate-900 mb-3">
            {t('dashboard', 'dailyOperations')}
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
                {t('dashboard', 'recordMilkData')}
              </Text>
              <Text className="text-sm text-slate-600">
                {cowsRecordedToday} of {dashboardData.totalCows} {t('dashboard', 'cowsRecordedToday')}
              </Text>
            </View>

            <ChevronRight size={20} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Analytics */}
        {/* Analytics */}
        <View>
          <Text className="text-slate-900 mb-3">
            {t('dashboard', 'analyticsInsights')}
          </Text>

          <Pressable
            onPress={() => onNavigate("analytics")}
            className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex-row items-center gap-4"
          >
            <View className="w-12 h-12 bg-purple-50 rounded-xl items-center justify-center">
              <TrendingUp size={24} color="#7c3aed" />
            </View>

            <View className="flex-1">
              <Text className="text-slate-900 mb-1">
                {t('dashboard', 'analytics')}
              </Text>
              <Text className="text-sm text-slate-600">
                {t('analytics', 'analyticsDetail')}
              </Text>
            </View>

            <ChevronRight size={20} color="#94a3b8" />
          </Pressable>
        </View>
        {/* Smart Features */}
        <View>
          <Text className="text-slate-900 mb-3">
            {t('dashboard', 'smartFeatures')}
          </Text>

          <View className="space-y-3 mb-2">
            <Pressable
              onPress={() => onNavigate("alerts")}
              className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center">
                <Bell size={24} color="#ea580c" />
              </View>

              <View className="flex-1">
                <Text className="text-slate-900 mb-1">
                  {t('dashboard', 'alertsNotifications')}
                </Text>
                <Text className="text-sm text-slate-600">
                  {dashboardData.activeAlerts} {dashboardData.activeAlerts === 1 ? t('dashboard', 'alert') : t('dashboard', 'alerts')} {t('dashboard', 'needsAttention')}
                </Text>
              </View>

              {dashboardData.activeAlerts > 0 && (
                <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs">{dashboardData.activeAlerts}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* History */}
        <Pressable
          onPress={() => onNavigate("history")}
          className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex-row items-center gap-4 mb-12"
        >
          <View className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center">
            <History size={24} color="#334155" />
          </View>

          <View className="flex-1">
            <Text className="text-slate-900 mb-1">
              {t('dashboard', 'viewHistory')}
            </Text>
            <Text className="text-sm text-slate-600">
              {t('dashboard', 'accessPastRecords')}
            </Text>
          </View>

          <ChevronRight size={20} color="#94a3b8" />
        </Pressable>


      </View>
    </ScrollView>
  );
}
