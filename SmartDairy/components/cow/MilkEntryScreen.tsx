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

type MilkSlot = "morning" | "evening";

interface MilkEntryScreenProps {
  onBack: () => void;
}

export function MilkEntryScreen({ onBack }: MilkEntryScreenProps) {
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

      if (res.data?.morning && !res.data?.evening) {
        setMilkSlot("evening");
        setMorningMilk(res.data.morning);
      }
    } catch {}
  };

  const handleSubmit = async () => {
    if (!cowId || !milkValue) return;
    if (milkSlot === "evening" && morningMilk === null) return;

    try {
      setIsSubmitting(true);

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
      if (err?.response?.data?.message?.includes("Calving date")) {
        setShowCalvingModal(true);
      }
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
          <Text className="text-slate-700">Back</Text>
        </Pressable>

        <Text className="text-2xl mb-6">Milk Entry</Text>

        <Text className="text-sm text-slate-600 mb-2">Select Cow</Text>
        <Pressable
          onPress={() => setShowCowModal(true)}
          className="bg-white border rounded-xl p-4 mb-6"
        >
          <Text>{cowName || "Tap to select cow"}</Text>
        </Pressable>

        {milkSlot === "evening" && morningMilk !== null && (
          <View className="bg-blue-100 rounded-xl p-3 mb-4">
            <Text className="text-blue-700">
              Morning Milk:{" "}
              <Text className="font-semibold">{morningMilk} L</Text>
            </Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-sm text-slate-600 mb-1">
            {milkSlot === "morning"
              ? "Morning Milk (L)"
              : "Evening Milk (L)"}
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
          placeholder="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          className="bg-white border rounded-xl p-4 mb-6"
          multiline
        />

        <Pressable
          disabled={isSubmitting || !milkValue || Number(milkValue) <= 0}
          onPress={handleSubmit}
          className="bg-green-600 py-5 rounded-2xl items-center flex-row justify-center gap-2"
        >
          <Droplet color="white" />
          <Text className="text-white text-lg">
            {milkSlot === "morning"
              ? "Save Morning Milk"
              : "Save Evening Milk"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Cow Modal */}
      <Modal visible={showCowModal} animationType="slide">
        <View className="flex-1 bg-white px-6 pt-12">
          <TextInput
            placeholder="Search cow..."
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

      {/* Calving Modal */}
      <Modal visible={showCalvingModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white p-6 rounded-3xl w-[90%]">
            <Text className="text-lg mb-3">Enter Calving Date</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={calvingDate}
              onChangeText={setCalvingDate}
              className="border rounded-xl p-4 mb-4"
            />
            <Pressable
              onPress={() => {
                setShowCalvingModal(false);
                handleSubmit();
              }}
              className="bg-green-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white">Confirm</Text>
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
              <Text className="text-xl font-semibold">
                Saved Successfully
              </Text>
            </View>

            <Pressable
              onPress={() => setSuccess(false)}
              className="bg-green-600 py-3 rounded-xl items-center mt-4"
            >
              <Text className="text-white font-semibold">Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Recommendation Modal */}
<Modal visible={showRecommendation} transparent animationType="fade">
  <View className="flex-1 bg-black/40 justify-center items-center">
    <View className="bg-white p-6 rounded-3xl w-[90%]">
      <Text className="text-xl font-semibold mb-2 text-center">
        Recommendation
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
        <Text className="text-white font-semibold">Got it</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </>
  );
}
