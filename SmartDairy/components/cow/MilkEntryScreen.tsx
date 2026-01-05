import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import {
  ArrowLeft,
  Check,
  Droplet,
  Search,
} from "lucide-react-native";

import { useCowListStore } from "../../Store/cowStore";
import { useMilkStore } from "../../Store/milkStore";

interface MilkEntryScreenProps {
  onBack: () => void;
}

export function MilkEntryScreen({ onBack }: MilkEntryScreenProps) {
  const { cows, fetchCows } = useCowListStore();
  const { submitMilk, isSubmitting } = useMilkStore();

  const [cowId, setCowId] = useState<string | null>(null);
  const [cowName, setCowName] = useState<string>("");

  const [search, setSearch] = useState("");
  const [showCowModal, setShowCowModal] = useState(false);

  const [morning, setMorning] = useState("");
  const [evening, setEvening] = useState("");
  const [notes, setNotes] = useState("");

  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null); 

  useEffect(() => {
    fetchCows();
  }, []);

  const dailyMilk =
    Number(morning || 0) +
    Number(evening || 0);

  const filteredCows = useMemo(() => {
    return cows.filter((c) =>
      `${c.name} ${c.breed}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, cows]);

  const handleSubmit = async () => {
    if (!cowId) return;

    const response = await submitMilk({
      cowId,
      morning: Number(morning || 0),
      evening: Number(evening || 0),
      dailyMilk,
      notes,
    });

    setResult(response); 
    setSuccess(true);

    

    setMorning("");
    setEvening("");
    setNotes("");

  };

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50 px-6 pt-12">
        {/* Header */}
        <Pressable
          onPress={onBack}
          className="flex-row items-center gap-2 mb-6"
        >
          <ArrowLeft size={20} color="#334155" />
          <Text className="text-slate-700">Back</Text>
        </Pressable>

        <Text className="text-2xl text-slate-900 mb-6">
          Milk Entry
        </Text>

        {/* Cow selector */}
        <Text className="text-sm text-slate-600 mb-2">
          Select Cow
        </Text>

        <Pressable
          onPress={() => setShowCowModal(true)}
          className="bg-white border rounded-xl p-4 mb-6"
        >
          <Text className="text-slate-800">
            {cowName || "Tap to select cow"}
          </Text>
        </Pressable>

        {/* Milk Inputs */}
        {[
          { label: "Morning (L)", value: morning, set: setMorning },
          { label: "Evening (L)", value: evening, set: setEvening },
        ].map((f) => (
          <View key={f.label} className="mb-4">
            <Text className="text-sm text-slate-600 mb-1">
              {f.label}
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              value={f.value}
              onChangeText={f.set}
              placeholder="0.0"
              className="bg-white border rounded-xl p-4"
            />
          </View>
        ))}

        {/* Daily total */}
        <View className="bg-green-100 rounded-xl p-4 items-center mb-6">
          <Text className="text-sm text-green-700">
            Daily Milk Total
          </Text>
          <Text className="text-3xl text-green-800">
            {dailyMilk.toFixed(1)} L
          </Text>
        </View>


        {/* Notes */}
        <TextInput
          placeholder="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          className="bg-white border rounded-xl p-4 mb-6"
          multiline
        />

        {/* Submit */}
        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit}
          className="bg-green-600 py-5 rounded-2xl items-center flex-row justify-center gap-2"
        >
          <Droplet color="white" />
          <Text className="text-white text-lg">
            Save Milk Data
          </Text>
        </Pressable>
      </ScrollView>

      {/* Cow Search Modal */}
      <Modal visible={showCowModal} animationType="slide">
        <View className="flex-1 bg-white px-6 pt-12">
          <View className="flex-row items-center gap-2 mb-4">
            <Search size={18} color="#64748b" />
            <TextInput
              placeholder="Search cow..."
              value={search}
              onChangeText={setSearch}
              className="flex-1 border rounded-xl px-4 py-2"
            />
          </View>

          <ScrollView>
            {filteredCows.map((cow) => (
              <Pressable
                key={cow._id}
                onPress={() => {
                  setCowId(cow._id);
                  setCowName(`${cow.name} (${cow.breed})`);
                  setShowCowModal(false);
                  setSearch("");
                }}
                className="p-4 border-b"
              >
                <Text className="text-slate-800 text-lg">
                  {cow.name}
                </Text>
                <Text className="text-slate-500 text-sm">
                  {cow.breed}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={() => setShowCowModal(false)}
            className="py-4 items-center"
          >
            <Text className="text-red-500">Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={success} transparent animationType="fade">
  <View className="flex-1 bg-black/30 items-center justify-center">
    <View className="bg-white p-6 rounded-3xl w-[90%]">
      {/* Success Icon */}
      <View className="items-center mb-4">
        <Check size={48} color="#16a34a" />
        <Text className="text-xl mt-2 font-semibold">
          Saved Successfully
        </Text>
      </View>

      {/* Recommendation */}
      {result?.recommendation && (
        <View
          className={`rounded-2xl p-4 border mb-4 ${
            result.recommendation.color === "green"
              ? "bg-green-100 border-green-300"
              : result.recommendation.color === "orange"
              ? "bg-orange-100 border-orange-300"
              : "bg-blue-100 border-blue-300"
          }`}
        >
          <Text className="text-xs text-slate-600 mb-1">
            AI Milk Yield Insight
          </Text>

          <Text className="text-lg font-semibold mb-2">
            {result.recommendation.title}
          </Text>

          <Text className="text-sm text-slate-700 mb-3">
            {result.recommendation.message}
          </Text>

          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-slate-600">
              Predicted:{" "}
              <Text className="font-semibold">
                {result.recommendation.predictedMilk} L
              </Text>
            </Text>

            <Text className="text-sm text-slate-600">
              Actual:{" "}
              <Text className="font-semibold">
                {result.recommendation.actualMilk} L
              </Text>
            </Text>
          </View>

          {result.recommendation.actions.map(
            (action: string, i: number) => (
              <Text key={i} className="text-sm text-slate-700">
                • {action}
              </Text>
            )
          )}
        </View>
      )}

      {/* ✅ Close Button */}
      <Pressable
        onPress={() => setSuccess(false)}
        className="bg-green-600 py-3 rounded-xl items-center"
      >
        <Text className="text-white text-lg font-semibold">
          Done
        </Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </>
  );
}
