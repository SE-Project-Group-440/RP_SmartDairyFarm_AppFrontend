import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  Droplet,
  Sun,
  Moon,
  Check,
  WifiOff,
  Wifi,
} from "lucide-react-native";

import { useCowListStore } from "../../../../Store/cowStore";
import { api } from "../../../../hooks/api";
import { useTranslations } from "../../../../hooks/useTranslations";

export default function DataEntryScreen() {
  const { cows, fetchCows } = useCowListStore();
  const [selectedCow, setSelectedCow] = useState<string | null>(null);
  const [session, setSession] = useState<"morning" | "evening">("morning");
  const [milkAmount, setMilkAmount] = useState(15);
  const [isOnline] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchCows();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCow) return;

    try {
      const payload: any = {
        cowId: selectedCow,
      };

      if (session === "morning") payload.morning = Number(milkAmount);
      else payload.evening = Number(milkAmount);

      await api.post("/milk/milktoml", payload);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setMilkAmount(15);
      }, 2000);
    } catch (err) {
      // keep simple error handling for now
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl text-white">Record Milk Data</Text>

          <View className="flex-row items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
            {isOnline ? (
              <>
                <Wifi size={16} color="white" />
                <Text className="text-white text-sm">Online</Text>
              </>
            ) : (
              <>
                <WifiOff size={16} color="white" />
                <Text className="text-white text-sm">Offline</Text>
              </>
            )}
          </View>
        </View>

        <Text className="text-blue-100">Quick and easy data entry</Text>
      </View>

      <View className="px-6 py-6 space-y-6">
        {/* Session Selector */}
        <View>
          <Text className="text-slate-600 mb-3">Milking Session</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setSession("morning")}
              className={`flex-1 py-4 rounded-xl items-center ${
                session === "morning"
                  ? "bg-orange-500"
                  : "bg-white border-2 border-slate-200"
              }`}
            >
              <Sun size={28} color={session === "morning" ? "white" : "#334155"} />
              <Text className={session === "morning" ? "text-white" : "text-slate-700"}>
                Morning
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSession("evening")}
              className={`flex-1 py-4 rounded-xl items-center ${
                session === "evening"
                  ? "bg-indigo-600"
                  : "bg-white border-2 border-slate-200"
              }`}
            >
              <Moon size={28} color={session === "evening" ? "white" : "#334155"} />
              <Text className={session === "evening" ? "text-white" : "text-slate-700"}>
                Evening
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Cow Selector */}
        <View>
          <Text className="text-slate-600 mb-3">Select Cow</Text>
          {cows.map((cow) => (
            <Pressable
              key={cow._id}
              onPress={() => setSelectedCow(cow._id)}
              className={`p-4 rounded-xl mb-2 flex-row items-center gap-4 ${
                selectedCow === cow._id
                  ? "bg-green-600"
                  : "bg-white border-2 border-slate-200"
              }`}
            >
              <Text className="text-2xl">🐄</Text>
              <Text
                className={`text-lg ${
                  selectedCow === cow._id ? "text-white" : "text-slate-700"
                }`}
              >
                {cow.name}
              </Text>
              {selectedCow === cow._id && (
                <Check size={20} color="white" style={{ marginLeft: "auto" }} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Milk Slider */}
        <View className="bg-white rounded-2xl p-6 border border-slate-100">
          <View className="items-center mb-4">
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-2">
              <Droplet size={40} color="#2563eb" />
            </View>
            <Text className="text-5xl text-slate-900">{milkAmount}</Text>
            <Text className="text-slate-600">Liters</Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={30}
            step={0.5}
            value={milkAmount}
            onValueChange={setMilkAmount}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#e2e8f0"
          />

          <View className="flex-row justify-between mt-2">
            <Text className="text-xs text-slate-500">0L</Text>
            <Text className="text-xs text-slate-500">15L</Text>
            <Text className="text-xs text-slate-500">30L</Text>
          </View>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={showSuccess}
          className="bg-green-600 py-5 rounded-2xl flex-row justify-center items-center gap-3"
        >
          {showSuccess ? (
            <>
              <Check size={24} color="white" />
              <Text className="text-white text-lg">Saved Successfully!</Text>
            </>
          ) : (
            <>
              <Droplet size={24} color="white" />
              <Text className="text-white text-lg">Save Milk Data</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess}>
        <View className="flex-1 bg-black/30 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 items-center">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Check size={40} color="#16a34a" />
            </View>
            <Text className="text-xl text-slate-900 mb-2">Data Saved!</Text>
            <Text className="text-slate-600">Milk data recorded successfully</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
