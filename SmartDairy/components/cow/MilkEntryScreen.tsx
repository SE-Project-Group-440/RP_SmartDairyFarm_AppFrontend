import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { ArrowLeft, Check, Droplet, Calendar } from "lucide-react-native";
import CustomDatePicker from "../ui/CustomDatePicker";

import { useCowListStore } from "../../Store/cowStore";
import { api } from "../../hooks/api";
import { useTranslations } from "@/hooks/useTranslations";

type MilkSlot = "morning" | "evening";

interface MilkEntryScreenProps {
  onBack: () => void;
}

export function MilkEntryScreen({ onBack }: MilkEntryScreenProps) {
  const { t } = useTranslations();
  const { cows, fetchCows } = useCowListStore();

  const [cowId, setCowId] = useState<string | null>(null);
  const [cowName, setCowName] = useState("");

  const [search, setSearch] = useState("");
  const [showCowModal, setShowCowModal] = useState(false);

  const [milkSlot, setMilkSlot] = useState<MilkSlot>("morning");
  const [milkValue, setMilkValue] = useState("");
  const [morningMilk, setMorningMilk] = useState<number | null>(null);
  const [eveningMilk, setEveningMilk] = useState<number | null>(null);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  const [notes, setNotes] = useState("");

  const [showCalvingModal, setShowCalvingModal] = useState(false);
  const [calvingDate, setCalvingDate] = useState("");



  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const [showRecommendation, setShowRecommendation] = useState(false);
  const [activeCycle, setActiveCycle] = useState<any>(null); // NEW

  useEffect(() => {
    fetchCows();
  }, []);

  const filteredCows = useMemo(() => {
    return cows.filter((c) =>
      `${c.name} ${c.breed}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, cows]);

  const checkActiveCycle = async (id: string) => {
    try {
      const res = await api.get(`/lact/cow/${id}`);
      const active = res.data.find((c: any) => c.LactationStatus === "Active");
      setActiveCycle(active || null);
    } catch (error) {
      console.log("Error checking active cycle");
      setActiveCycle(null);
    }
  };

  const syncTodayMilk = async (cowId: string) => {
    try {
      const res = await api.get(`/milk/today/${cowId}`);

      const todayMilk = res.data;

      if (todayMilk?.morning && !todayMilk?.evening) {
        // Morning exists, evening not yet entered
        setMilkSlot("evening");
        setMorningMilk(todayMilk.morning);
        setEveningMilk(null);
        setIsCompletedToday(false);
      }
      else if (todayMilk?.morning && todayMilk?.evening) {
        // Both already entered → reset to morning for next day
        setMilkSlot("morning");
        setMorningMilk(todayMilk.morning);
        setEveningMilk(todayMilk.evening);
        setIsCompletedToday(true);
      }
      else {
        // Nothing entered yet
        setMilkSlot("morning");
        setMorningMilk(null);
        setEveningMilk(null);
        setIsCompletedToday(false);
      }
    } catch (error) {
      console.log("No milk data for today");
      setMilkSlot("morning");
      setMorningMilk(null);
      setEveningMilk(null);
      setIsCompletedToday(false);
    }
  };

  const handleSubmit = async () => {
    if (!cowId || !milkValue) return;
    if (milkSlot === "evening" && morningMilk === null) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload: any = {
        cowId,
        notes,
      };

      if (milkSlot === "morning") {
        payload.morning = Number(milkValue);
      } else {
        payload.evening = Number(milkValue);
      }

      const res = await api.post("/milk/milktoml", payload);
      setResult(res.data);

      if (milkSlot === "morning") {
        setMorningMilk(Number(milkValue));
        setMilkSlot("evening");
        setMilkValue("");
      } else {
        // Evening entry - show recommendation or success, and block further entries
        setEveningMilk(Number(milkValue));
        setIsCompletedToday(true);
        if (res.data?.recommendation) {
          setShowRecommendation(true);
        } else {
          setSuccess(true);
        }
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to save milk entry";
      setErrorMessage(errorMsg);
      setShowError(true);

      resetForm();
      setCowId(null);
      setCowName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartCycle = async () => {
    if (!cowId || !calvingDate) return;
    try {
      setIsSubmitting(true);
      await api.post("/lact/", {
        cowId,
        calvingDate,
        healthStatus: "Healthy",
      });
      setCalvingDate("");
      await checkActiveCycle(cowId);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to start lactation cycle";
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStopCycle = async () => {
    if (!activeCycle) return;
    try {
      setIsSubmitting(true);
      await api.put(`/lact/${activeCycle._id}`, {
        LactationStatus: "Completed",
        actualDryDate: new Date().toISOString(),
      });
      await checkActiveCycle(cowId!);
      resetForm();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to stop lactation cycle";
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMilkSlot("morning");
    setMilkValue("");
    setMorningMilk(null);
    setEveningMilk(null);
    setIsCompletedToday(false);
    setNotes("");
    setCalvingDate("");
  };

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50 px-6 pt-12">
        <Pressable
          onPress={onBack}
          className="flex-row items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} color="#334155" />
          <Text className="text-slate-700">{t('common', 'back')}</Text>
        </Pressable>

        <Text className="text-2xl mb-6">{t('milkEntry', 'milkEntry')}</Text>

        <Text className="text-sm text-slate-600 mb-2">{t('milkEntry', 'selectCow')}</Text>
        <Pressable
          onPress={() => setShowCowModal(true)}
          className="bg-white border rounded-xl p-4 mb-6"
        >
          <Text>{cowName || t('milkEntry', 'tapToSelectCow')}</Text>
        </Pressable>

        {cowId && !activeCycle ? (
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-6 items-center mb-6">
            <Text className="text-amber-800 font-bold mb-2 text-lg">{t('milkEntry', 'noActiveLactation')}</Text>
            <Text className="text-amber-700 text-center mb-6">{t('milkEntry', 'cowCurrentlyDry')}</Text>


            <View className="w-full mb-6">
              <Text className="text-sm text-amber-900 mb-2">
                {t('milkEntry', 'calvingDate')} *
              </Text>

              <CustomDatePicker
                value={calvingDate}
                onChange={(date) => setCalvingDate(date)}
              />
            </View>


            <Pressable
              onPress={handleStartCycle}
              disabled={isSubmitting || !calvingDate}
              className={`py-4 px-6 rounded-xl w-full items-center ${isSubmitting || !calvingDate ? 'bg-amber-400' : 'bg-amber-600'}`}
            >
              <Text className="text-white font-bold text-lg">{t('milkEntry', 'startLactationCycle')}</Text>
            </Pressable>
          </View>
        ) : isCompletedToday ? (
          <View className="bg-green-100/50 border border-green-200 rounded-2xl p-6 items-center mb-6">
            <View className="bg-green-100 p-3 rounded-full mb-3">
              <Check size={28} color="#16a34a" />
            </View>
            <Text className="text-green-800 font-bold text-lg mb-4 text-center">
              {t('milkEntry', 'completedForToday')}
            </Text>

            <View className="w-full bg-white rounded-xl p-4 shadow-sm border border-green-50">
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-500">{t('milkEntry', 'morningMilk')}</Text>
                <Text className="text-slate-800 font-semibold">{morningMilk} L</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-500">{t('milkEntry', 'eveningMilk')}</Text>
                <Text className="text-slate-800 font-semibold">{eveningMilk} L</Text>
              </View>
            </View>

            <Text className="text-slate-500 mt-5 text-center text-sm">
              {t('milkEntry', 'cannotAddMoreRecords')}
            </Text>

            <Pressable
              onPress={handleStopCycle}
              disabled={isSubmitting}
              className="mt-6 border border-red-300 bg-red-50 py-3 px-6 rounded-xl w-full items-center"
            >
              <Text className="text-red-700 font-semibold">{t('milkEntry', 'stopCurrentLactation')}</Text>
            </Pressable>
          </View>
        ) : cowId ? (
          <>
            {milkSlot === "evening" && morningMilk !== null && (
              <View className="bg-blue-100 rounded-xl p-3 mb-4">
                <Text className="text-blue-700">
                  {t('milkEntry', 'morningMilk')}: {" "}
                  <Text className="font-semibold">{morningMilk} L</Text>
                </Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="text-sm text-slate-600 mb-1">
                {milkSlot === "morning"
                  ? t('milkEntry', 'morningMilk')
                  : t('milkEntry', 'eveningMilk')} {t('milkEntry', 'milkUnit')}
              </Text>

              <TextInput
                keyboardType="decimal-pad"
                value={milkValue}
                onChangeText={setMilkValue}
                placeholder="0.0"
                className="bg-white border rounded-xl p-4"
              />
            </View>

            <TextInput
              placeholder={`${t('milkEntry', 'notes')} ${t('milkEntry', 'optional')}`}
              value={notes}
              onChangeText={setNotes}
              className="bg-white border rounded-xl p-4 mb-6"
              multiline
            />

            <Pressable
              disabled={isSubmitting || !milkValue || Number(milkValue) <= 0}
              onPress={handleSubmit}
              className="bg-green-600 py-5 rounded-2xl items-center flex-row justify-center gap-2 mb-4"
            >
              <Droplet color="white" />
              <Text className="text-white text-lg">
                {milkSlot === "morning"
                  ? t('milkEntry', 'saveMorningMilk')
                  : t('milkEntry', 'saveEveningMilk')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleStopCycle}
              disabled={isSubmitting}
              className="border border-red-300 bg-red-50 py-3 px-6 rounded-xl w-full items-center"
            >
              <Text className="text-red-700 font-semibold">{t('milkEntry', 'stopCurrentLactation')}</Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>

      {/* Cow Modal */}
      <Modal visible={showCowModal} animationType="slide">
        <View className="flex-1 bg-white px-6 pt-12">
          <TextInput
            placeholder={t('milkEntry', 'searchCow')}
            value={search}
            onChangeText={setSearch}
            className="border rounded-xl px-4 py-2 mb-4"
          />

          <ScrollView>
            {filteredCows.map((cow) => (
              <Pressable
                key={cow._id}
                onPress={async () => {
                  setCowId(cow._id);
                  setCowName(`${cow.name} (${cow.breed})`);
                  setShowCowModal(false);
                  setSearch("");
                  resetForm();
                  await checkActiveCycle(cow._id);
                  await syncTodayMilk(cow._id);
                }}
                className="p-4 border-b"
              >
                <Text>{cow.name}</Text>
                <Text className="text-slate-500 text-sm">
                  {cow.breed}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={showError} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="bg-white p-6 rounded-3xl w-full">
            <View className="items-center mb-4">
              <Text className="text-5xl mb-3">⚠️</Text>
              <Text className="text-2xl font-bold text-red-600 text-center">{t('common', 'error')}</Text>
            </View>

            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <Text className="text-base text-red-900 text-center font-semibold">
                {errorMessage}
              </Text>
            </View>

            {errorMessage.includes("Calving date") && (
              <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                <Text className="text-sm text-blue-900">
                  <Text className="font-bold">💡 Tip: </Text>
                  {t('milkEntry', 'calvingDate')} {t('milkEntry', 'ifNewCycle')}
                </Text>
              </View>
            )}

            <Pressable
              onPress={() => setShowError(false)}
              className="bg-red-600 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">{t('common', 'dismiss')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={success} transparent animationType="fade">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-white p-6 rounded-3xl w-[90%]">
            <View className="items-center mb-4">
              <Check size={48} color="#16a34a" />
              <Text className="text-xl font-semibold text-slate-900">
                {t('milkEntry', 'milkEntrySaved')}
              </Text>
            </View>
            <Text className="text-sm text-slate-600 text-center mb-6">
              {t('milkEntry', 'milkDataRecorded')}
            </Text>

            <Pressable
              onPress={() => setSuccess(false)}
              className="bg-green-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">{t('common', 'done')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Recommendation Modal */}
      <Modal visible={showRecommendation} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className={`bg-white p-6 rounded-3xl w-[90%] ${result?.recommendation?.key === 'below_expected' ? 'border-red-500 border-2' : 'border-green-500 border-2'}`}>
            <Text className="text-xl font-semibold mb-2 text-center">
              {t('milkEntry', 'recommendation')}
            </Text>

            {/* translate title and message using the key returned from the backend */}
            <Text className={`text-base font-medium mb-2 ${result?.recommendation?.key === 'below_expected' ? 'text-red-600' : 'text-green-600'}`}>
              {t('milkEntry', `recommendation_${result?.recommendation?.key}_title`)}
            </Text>

            <Text className="text-slate-600 mb-3">
              {t('milkEntry', `recommendation_${result?.recommendation?.key}_message`)}
            </Text>

            {/* Detailed Metrics */}
            <View className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-500">{t('milkEntry', 'morningMilk')}</Text>
                <Text className="text-slate-900 font-semibold">{result?.recommendation?.morningMilk} L</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-500">{t('milkEntry', 'eveningMilk')}</Text>
                <Text className="text-slate-900 font-semibold">{result?.recommendation?.eveningMilk} L</Text>
              </View>
              <View className="h-[1px] bg-slate-200 my-2" />
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-600 font-medium">Total Daily</Text>
                <Text className="text-slate-900 font-bold">{result?.recommendation?.actualMilk} L</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-600 font-medium">Predicted Daily</Text>
                <Text className="text-indigo-600 font-bold">{result?.recommendation?.predictedMilk} L</Text>
              </View>
            </View>

            {result?.recommendation?.actions?.length > 0 && (
              <View className="mt-2">
                {result.recommendation.actions.map(
                  (actionKey: string, index: number) => (
                    <Text
                      key={index}
                      className="text-slate-600 mb-1"
                    >
                      • {t('milkEntry', actionKey)}
                    </Text>
                  )
                )}
              </View>
            )}

            <Pressable
              onPress={() => {
                setShowRecommendation(false);
              }}
              className="bg-green-600 py-3 rounded-xl items-center mt-4"
            >
              <Text className="text-white font-semibold">{t('milkEntry', 'gotIt')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </>
  );
}
