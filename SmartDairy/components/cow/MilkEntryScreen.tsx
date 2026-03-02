import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { ArrowLeft, Check, Droplet } from "lucide-react-native";

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

  const [notes, setNotes] = useState("");

  const [showCalvingModal, setShowCalvingModal] = useState(false);
  const [calvingDate, setCalvingDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ NEW
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    fetchCows();
  }, []);

  const filteredCows = useMemo(() => {
    return cows.filter((c) =>
      `${c.name} ${c.breed}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, cows]);

  const syncTodayMilk = async (cowId: string) => {
  try {
    const res = await api.get(`/milk/today/${cowId}`);

    const todayMilk = res.data;

    if (todayMilk?.morning && !todayMilk?.evening) {
      // Morning exists, evening not yet entered
      setMilkSlot("evening");
      setMorningMilk(todayMilk.morning);
    } 
    else if (todayMilk?.morning && todayMilk?.evening) {
      // Both already entered → reset to morning for next day
      resetForm();
    } 
    else {
      // Nothing entered yet
      setMilkSlot("morning");
      setMorningMilk(null);
    }
  } catch (error) {
    console.log("No milk data for today");
  }
};

  const handleSubmit = async () => {
    if (!cowId || !milkValue) return;
    if (milkSlot === "evening" && morningMilk === null) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      
       if (calvingDate) {
        try {
          await api.post("/lact/", {
            cowId,
            calvingDate,
            healthStatus: "Healthy",
            lactationRound: 1, 
          });
          console.log("New lactation cycle created and predictions generating...");
        } catch (cycleErr: any) {
          const cycleErrMsg = cycleErr?.response?.data?.error || "Failed to create lactation cycle";
          setErrorMessage(cycleErrMsg);
          setShowError(true);
          setIsSubmitting(false);
          return;
        }
      }

      const payload: any = {
        cowId,
        notes,
      };

      if (milkSlot === "morning") {
        payload.morning = Number(milkValue);
      } else {
        payload.evening = Number(milkValue);
      }

      if (calvingDate) {
        payload.calvingDate = calvingDate;
      }

      const res = await api.post("/milk/milktoml", payload);
      setResult(res.data);

      if (milkSlot === "morning") {
        setMorningMilk(Number(milkValue));
        setMilkSlot("evening");
        setMilkValue("");
      } else {
        
        if (res.data?.recommendation) {
          setShowRecommendation(true);
        } else {
          setSuccess(true);
        }


        resetForm();
      }
    } catch (err: any) {
      const errorMsg =  err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to save milk entry";
      setErrorMessage(errorMsg);
      setShowError(true);

      resetForm();
      setCowId(null);
      setCowName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMilkSlot("morning");
    setMilkValue("");
    setMorningMilk(null);
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

        <View className="mb-6">
          <Text className="text-sm text-slate-600 mb-2">{t('milkEntry', 'calvingDate')} {t('milkEntry', 'ifNewCycle')}</Text>
          <TextInput
            placeholder={t('milkEntry', 'dateFormat')}
            value={calvingDate}
            onChangeText={setCalvingDate}
            className="bg-white border rounded-xl p-4"
          />
        </View>

        <Pressable
          disabled={isSubmitting || !milkValue || Number(milkValue) <= 0}
          onPress={handleSubmit}
          className="bg-green-600 py-5 rounded-2xl items-center flex-row justify-center gap-2"
        >
          <Droplet color="white" />
          <Text className="text-white text-lg">
            {milkSlot === "morning"
              ? t('milkEntry', 'saveMorningMilk')
              : t('milkEntry', 'saveEveningMilk')}
          </Text>
        </Pressable>
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
    <View className="bg-white p-6 rounded-3xl w-[90%]">
      <Text className="text-xl font-semibold mb-2 text-center">
        {t('milkEntry', 'recommendation')}
      </Text>

      <Text className="text-base font-medium mb-2">
        {result?.recommendation?.title}
      </Text>

      <Text className="text-slate-600 mb-3">
        {result?.recommendation?.message}
      </Text>

      {result?.recommendation?.actions?.length > 0 && (
        <View className="mt-2">
          {result.recommendation.actions.map(
            (action: string, index: number) => (
              <Text
                key={index}
                className="text-slate-600 mb-1"
              >
                • {action}
              </Text>
            )
          )}
        </View>
      )}

      <Pressable
        onPress={() => setShowRecommendation(false)}
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
