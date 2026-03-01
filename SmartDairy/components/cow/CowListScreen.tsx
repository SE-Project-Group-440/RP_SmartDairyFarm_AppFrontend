import { useEffect, useMemo, useState } from "react";
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

import { useCowManageStore } from "../../Store/cowManageStore";
import { useTranslations } from "@/hooks/useTranslations";

interface CowListScreenProps {
  onCowSelect: (cowId: string) => void;
  onBack: () => void;
}

export function CowListScreen({
  onCowSelect,
  onBack,
}: CowListScreenProps) {
  const { t } = useTranslations();
  const { cows, fetchCows, isLoading } = useCowManageStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCows();
  }, []);

  const filteredCows = useMemo(() => {
    return cows.filter(
      (cow) =>
        cow.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        cow.breed
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [cows, searchQuery]);

  const healthyCount = filteredCows.filter(
    (c) => c.status === "Active"
  ).length;
  const warningCount =
    filteredCows.length - healthyCount;

    function calculateAgeInMonths(birthDate?: string): number {
  if (!birthDate) return 0;

  const dob = new Date(birthDate);
  const today = new Date();

  let months =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    (today.getMonth() - dob.getMonth());

  if (today.getDate() < dob.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
}


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
            {t('cowList', 'backToDashboard')}
          </Text>
        </Pressable>

        <Text className="text-2xl text-white mb-1">
          {t('cowList', 'manageCows')}
        </Text>
        <Text className="text-green-100">
          {cows.length} {t('cowList', 'cowsRegistered')}
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
            placeholder={t('cowList', 'search')}
            className="pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl"
          />
        </View>

        {/* Filter Summary */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-slate-600">
            {filteredCows.length}{" "}
            {filteredCows.length === 1 ? t('cowList', 'cow') : t('cowList', 'cows')} {t('cowList', 'found')}
          </Text>

          <View className="flex-row gap-2">
            <View className="px-3 py-1 bg-green-100 rounded-full">
              <Text className="text-xs text-green-700">
                {healthyCount} {t('cowList', 'healthy')}
              </Text>
            </View>
            <View className="px-3 py-1 bg-orange-100 rounded-full">
              <Text className="text-xs text-orange-700">
                {warningCount} {t('cowList', 'monitor')}
              </Text>
            </View>
          </View>
        </View>

        {/* Cow Cards */}
        <View className="space-y-3">
          {filteredCows.map((cow) => (
            <View
              key={cow._id}
              className="bg-white rounded-2xl p-5 border border-slate-100"
            >
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
                        cow.status === "Active"
                          ? "bg-green-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          cow.status === "Active"
                            ? "text-green-700"
                            : "text-orange-700"
                        }`}
                      >
                        {cow.status === "Active"
                          ? `✓ ${t('cowList', 'healthy')}`
                          : `⚠ ${t('cowList', 'monitor')}`}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-y-2">
                    <Text className="w-1/2 text-sm text-slate-600">
                      {t('cowList', 'age')}: {" "}
                      <Text className="text-slate-900">
                        {calculateAgeInMonths(
                          cow.birthDate
                        )}{" "}
                        {t('cowList', 'months')}
                      </Text>
                    </Text>
                  <Text className="w-1/2 text-sm text-slate-600">
  {t('cowList', 'lactation')}: {" "}
  <Text className="text-slate-900">
    {cow.lactationRound ?? "—"}
  </Text>
</Text>

<Text className="w-1/2 text-sm text-slate-600">
  {t('cowList', 'day')}: {" "}
  <Text className="text-slate-900">
    {cow.lactationDay ?? "—"}
  </Text>
</Text>

<Text className="w-1/2 text-sm text-slate-600">
  {t('cowList', 'avgMilk')}: {" "}
  <Text className="text-slate-900">
    {cow.avgMilk ? `${cow.avgMilk} L` : "—"}
  </Text>
</Text>

                  </View>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => onCowSelect(cow._id)}
                  className="flex-1 bg-green-600 rounded-xl py-2.5 flex-row items-center justify-center gap-2"
                >
                  <Eye size={16} color="white" />
                  <Text className="text-white text-sm">
                    {t('cowList', 'viewProfile')}
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

        {!isLoading && filteredCows.length === 0 && (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-slate-900 mb-2">
              {t('cowList', 'noCowsFound')}
            </Text>
            <Text className="text-sm text-slate-600">
              {t('cowList', 'tryAdjustingSearch')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
