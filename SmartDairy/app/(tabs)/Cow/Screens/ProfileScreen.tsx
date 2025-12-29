import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import {
  Globe,
  Moon,
  Sun,
  HelpCircle,
  Database,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react-native";
import { useAuthStore } from '@/Store/auth.store';

export function ProfileScreen() {
  const [language, setLanguage] = useState("english");
  const [darkMode, setDarkMode] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const [syncStatus, setSyncStatus] =
    useState<"synced" | "syncing" | "offline">("synced");
  

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-slate-800 px-6 pt-12 pb-8">
        <View className="flex-row gap-4 mb-4 items-center">
          <View className="w-20 h-20 bg-emerald-500 rounded-2xl items-center justify-center">
            <Text className="text-3xl">👨‍🌾</Text>
          </View>

          <View>
            <Text className="text-2xl text-white mb-1">
              Manujaya Perera
            </Text>
            <Text className="text-slate-300">
              Farmer • Since 2020
            </Text>
          </View>
        </View>

        <View className="flex-row bg-white/10 rounded-xl p-4">
          {[
            { label: "Cows", value: "3" },
            { label: "Records", value: "1,245" },
            { label: "Days Active", value: "156" },
          ].map((item, i) => (
            <View key={i} className="flex-1 items-center">
              <Text className="text-xl text-white mb-1">
                {item.value}
              </Text>
              <Text className="text-xs text-slate-300">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-6 py-6 space-y-6">
        {/* Language */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Globe size={20} color="#0f172a" />
            <Text className="text-slate-900 text-base">
              Language / භාෂාව / மொழி
            </Text>
          </View>

          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {[
              { id: "english", name: "English", flag: "🇬🇧" },
              { id: "sinhala", name: "සිංහල", flag: "🇱🇰" },
              { id: "tamil", name: "தமிழ்", flag: "🇱🇰" },
            ].map((lang, index) => (
              <Pressable
                key={lang.id}
                onPress={() => setLanguage(lang.id)}
                className={`flex-row justify-between items-center p-4 ${
                  index !== 2 ? "border-b border-slate-100" : ""
                } ${
                  language === lang.id
                    ? "bg-green-50"
                    : ""
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{lang.flag}</Text>
                  <Text className="text-slate-900">
                    {lang.name}
                  </Text>
                </View>

                {language === lang.id && (
                  <View className="w-6 h-6 bg-green-600 rounded-full items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Appearance */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Settings size={20} color="#0f172a" />
            <Text className="text-slate-900 text-base">
              Appearance
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center ${
                    darkMode
                      ? "bg-slate-800"
                      : "bg-amber-100"
                  }`}
                >
                  {darkMode ? (
                    <Moon size={20} color="#fff" />
                  ) : (
                    <Sun size={20} color="#d97706" />
                  )}
                </View>

                <View>
                  <Text className="text-slate-900">
                    Dark Mode
                  </Text>
                  <Text className="text-sm text-slate-500">
                    Better for night use
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setDarkMode(!darkMode)}
                className={`w-14 h-8 rounded-full justify-center ${
                  darkMode
                    ? "bg-green-600"
                    : "bg-slate-300"
                }`}
              >
                <View
                  className={`w-6 h-6 bg-white rounded-full ${
                    darkMode
                      ? "ml-7"
                      : "ml-1"
                  }`}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Data & Sync */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Database size={20} color="#0f172a" />
            <Text className="text-slate-900 text-base">
              Data & Sync
            </Text>
          </View>

          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <View className="p-4 border-b border-slate-100">
              <View className="flex-row justify-between mb-2">
                <View className="flex-row gap-3">
                  <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center">
                    <Database size={20} color="#16a34a" />
                  </View>

                  <View>
                    <Text className="text-slate-900">
                      Sync Status
                    </Text>
                    <Text className="text-sm text-slate-500">
                      ✅ All data synced
                    </Text>
                  </View>
                </View>

                <Text className="text-green-600 text-sm">
                  Sync Now
                </Text>
              </View>

              <Text className="text-xs text-slate-500">
                Last synced: 5 minutes ago
              </Text>
            </View>

            <Pressable className="flex-row justify-between items-center p-4">
              <Text className="text-slate-700">
                Backup Data
              </Text>
              <ChevronRight size={20} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        {/* Help */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <HelpCircle size={20} color="#0f172a" />
            <Text className="text-slate-900 text-base">
              Help & Support
            </Text>
          </View>

          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {[
              "User Guide 📚",
              "Video Tutorials 🎥",
              "Contact Support 💬",
            ].map((item, i) => (
              <Pressable
                key={i}
                className={`flex-row justify-between items-center p-4 ${
                  i !== 2 ? "border-b border-slate-100" : ""
                }`}
              >
                <Text className="text-slate-700">
                  {item}
                </Text>
                <ChevronRight size={20} color="#94a3b8" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View className="bg-slate-100 rounded-2xl p-4 items-center">
          <Text className="text-sm text-slate-600">
            Smart Farm App
          </Text>
          <Text className="text-xs text-slate-500">
            Version 1.0.2 • Built with ❤️ for farmers
          </Text>
        </View>

        {/* Logout */}
        <Pressable
  onPress={logout}
  className="bg-white border-2 border-red-200 rounded-2xl py-4 flex-row items-center justify-center gap-2"
>
  <LogOut size={20} color="#dc2626" />
  <Text className="text-red-600 font-medium">
    Log Out
  </Text>
</Pressable>

      </View>
    </ScrollView>
  );
}
