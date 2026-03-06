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
import { useLanguageStore, type Language } from '@/Store/language.store';
import { useTranslations } from '@/hooks/useTranslations';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const currentLanguage = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslations();
  

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
              {user?.name || user?.email || "Farmer"}
            </Text>
            <Text className="text-slate-300">
              {t('profile', 'farmer')}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 py-6 space-y-6">
        {/* Language */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Globe size={20} color="#0f172a" />
            <Text className="text-slate-900 text-base">
              {t('profile', 'language')}
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
                onPress={() => setLanguage(lang.id as Language)}
                className={`flex-row justify-between items-center p-4 ${
                  index !== 2 ? "border-b border-slate-100" : ""
                } ${
                  currentLanguage === lang.id
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

                {currentLanguage === lang.id && (
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
              {t('profile', 'appearance')}
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
                    {t('profile', 'darkMode')}
                  </Text>
                  <Text className="text-sm text-slate-500">
                    {t('profile', 'betterForNight')}
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
              {t('profile', 'dataSync')}
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
                      {t('profile', 'syncStatus')}
                    </Text>
                    <Text className="text-sm text-slate-500">
                      {t('profile', 'allDataSynced')}
                    </Text>
                  </View>
                </View>

                <Text className="text-green-600 text-sm">
                  {t('profile', 'syncNow')}
                </Text>
              </View>

              <Text className="text-xs text-slate-500">
                {t('profile', 'lastSynced')}: 5 minutes ago
              </Text>
            </View>

            <Pressable className="flex-row justify-between items-center p-4">
              <Text className="text-slate-700">
                {t('profile', 'backupData')}
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
              {t('profile', 'help')}
            </Text>
          </View>

          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {[
              t('profile', 'userGuide'),
              t('profile', 'videoTutorials'),
              t('profile', 'contactSupport'),
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
            {t('profile', 'appInfo')}
          </Text>
          <Text className="text-xs text-slate-500">
            {t('profile', 'version')} 1.0.2 • {t('profile', 'builtWith')}
          </Text>
        </View>

        {/* Logout */}
        <Pressable
  onPress={logout}
  className="bg-white border-2 border-red-200 rounded-2xl py-4 flex-row items-center justify-center gap-2"
>
  <LogOut size={20} color="#dc2626" />
  <Text className="text-red-600 font-medium">
    {t('profile', 'logout')}
  </Text>
</Pressable>

      </View>
    </ScrollView>
  );
}
