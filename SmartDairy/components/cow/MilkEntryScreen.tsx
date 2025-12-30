import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  ArrowLeft,
  Droplet,
  Sun,
  Moon,
  Check,
  WifiOff,
  Wifi,
} from "lucide-react-native";

interface MilkEntryScreenProps {
  onBack: () => void;
}

const cows = [
  { id: "1", name: "Lassie" },
  { id: "2", name: "Bella" },
  { id: "3", name: "Daisy" },
];

export function MilkEntryScreen({ onBack }: MilkEntryScreenProps) {
  const [selectedCow, setSelectedCow] = useState("1");
  const [session, setSession] = useState<"morning" | "evening">("morning");
  const [milkAmount, setMilkAmount] = useState(15);
  const [isOnline] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setMilkAmount(15);
    }, 2000);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50">
        {/* Header */}
        <View className="bg-blue-600 px-6 pt-12 pb-6">
          <Pressable
            onPress={onBack}
            className="mb-4 flex-row items-center gap-2"
          >
            <ArrowLeft size={20} color="#bfdbfe" />
            <Text className="text-blue-100">
              Back to Dashboard
            </Text>
          </Pressable>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl text-white">
              Record Milk Data
            </Text>

            <View className="flex-row items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              {isOnline ? (
                <>
                  <Wifi size={16} color="white" />
                  <Text className="text-white text-sm">
                    Online
                  </Text>
                </>
              ) : (
                <>
                  <WifiOff size={16} color="white" />
                  <Text className="text-white text-sm">
                    Offline
                  </Text>
                </>
              )}
            </View>
          </View>

          <Text className="text-blue-100">
            Quick and easy data entry
          </Text>
        </View>

        <View className="px-6 py-6 space-y-6">
          {/* Session Selector */}
          <View>
            <Text className="text-sm text-slate-600 mb-3">
              Milking Session
            </Text>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setSession("morning")}
                className={`flex-1 py-4 rounded-xl items-center ${
                  session === "morning"
                    ? "bg-orange-500"
                    : "bg-white border-2 border-slate-200"
                }`}
              >
                <Sun
                  size={32}
                  color={session === "morning" ? "white" : "#334155"}
                />
                <Text
                  className={`mt-2 ${
                    session === "morning"
                      ? "text-white"
                      : "text-slate-700"
                  }`}
                >
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
                <Moon
                  size={32}
                  color={session === "evening" ? "white" : "#334155"}
                />
                <Text
                  className={`mt-2 ${
                    session === "evening"
                      ? "text-white"
                      : "text-slate-700"
                  }`}
                >
                  Evening
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Cow Selector */}
          <View>
            <Text className="text-sm text-slate-600 mb-3">
              Select Cow
            </Text>

            {cows.map((cow) => (
              <Pressable
                key={cow.id}
                onPress={() => setSelectedCow(cow.id)}
                className={`p-4 rounded-xl mb-2 flex-row items-center gap-4 ${
                  selectedCow === cow.id
                    ? "bg-green-600"
                    : "bg-white border-2 border-slate-200"
                }`}
              >
                <View className="w-12 h-12 rounded-xl items-center justify-center bg-amber-200">
                  <Text className="text-2xl">🐄</Text>
                </View>

                <Text
                  className={`text-lg ${
                    selectedCow === cow.id
                      ? "text-white"
                      : "text-slate-700"
                  }`}
                >
                  {cow.name}
                </Text>

                {selectedCow === cow.id && (
                  <Check
                    size={20}
                    color="white"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </Pressable>
            ))}
          </View>

          {/* Milk Slider */}
          <View>
            <Text className="text-sm text-slate-600 mb-3">
              Milk Amount (Liters)
            </Text>

            <View className="bg-white rounded-2xl p-6 border border-slate-100">
              <View className="items-center mb-6">
                <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-3">
                  <Droplet size={48} color="#2563eb" />
                </View>
                <Text className="text-5xl text-slate-900">
                  {milkAmount}
                </Text>
                <Text className="text-sm text-slate-600">
                  Liters
                </Text>
              </View>

              <Slider
                minimumValue={0}
                maximumValue={30}
                step={0.5}
                value={milkAmount}
                onValueChange={setMilkAmount}
                minimumTrackTintColor="#16a34a"
                maximumTrackTintColor="#e5e7eb"
              />

              <View className="flex-row justify-between mt-2">
                <Text className="text-xs text-slate-500">0L</Text>
                <Text className="text-xs text-slate-500">15L</Text>
                <Text className="text-xs text-slate-500">30L</Text>
              </View>

              <View className="flex-row gap-2 mt-6">
                {[10, 15, 20, 25].map((amt) => (
                  <Pressable
                    key={amt}
                    onPress={() => setMilkAmount(amt)}
                    className={`flex-1 py-2 rounded-lg ${
                      milkAmount === amt
                        ? "bg-green-600"
                        : "bg-slate-100"
                    }`}
                  >
                    <Text
                      className={`text-center ${
                        milkAmount === amt
                          ? "text-white"
                          : "text-slate-700"
                      }`}
                    >
                      {amt}L
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={showSuccess}
            className="bg-green-600 py-5 rounded-2xl flex-row items-center justify-center gap-3"
          >
            {showSuccess ? (
              <>
                <Check size={24} color="white" />
                <Text className="text-lg text-white">
                  Saved Successfully!
                </Text>
              </>
            ) : (
              <>
                <Droplet size={24} color="white" />
                <Text className="text-lg text-white">
                  Save Milk Data
                </Text>
              </>
            )}
          </Pressable>

          {!isOnline && (
            <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex-row gap-3">
              <WifiOff size={20} color="#d97706" />
              <View>
                <Text className="text-sm text-slate-900">
                  Working Offline
                </Text>
                <Text className="text-xs text-slate-600">
                  Data will sync later
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/20 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 items-center">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Check size={40} color="#16a34a" />
            </View>
            <Text className="text-xl text-slate-900 mb-2">
              Data Saved!
            </Text>
            <Text className="text-sm text-slate-600">
              Successfully recorded milk data
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
