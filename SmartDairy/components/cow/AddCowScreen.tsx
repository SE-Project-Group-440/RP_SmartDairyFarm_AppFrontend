import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { ArrowLeft, Camera } from "lucide-react-native";

interface AddCowScreenProps {
  onBack: () => void;
}

const breeds = [
  "Jersey",
  "Holstein Friesian",
  "Jersey Cross",
  "Ayrshire",
  "Brown Swiss",
  "Sahiwal",
  "Other",
];

export function AddCowScreen({ onBack }: AddCowScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    purchaseDate: "",
    lactationNumber: "",
    currentLactationDay: "",
    notes: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = formData.name && formData.breed && formData.age;

  const handleSubmit = () => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 2000);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50">
        {/* Header */}
        <View className="bg-green-600 px-6 pt-12 pb-6">
          <Pressable
            onPress={onBack}
            className="mb-4 flex-row items-center gap-2"
          >
            <ArrowLeft size={20} color="#dcfce7" />
            <Text className="text-green-100">Back to Dashboard</Text>
          </Pressable>

          <Text className="text-2xl text-white mb-1">Add New Cow</Text>
          <Text className="text-green-100">
            Register a new cow to your farm
          </Text>
        </View>

        <View className="px-6 py-6 space-y-6">
          {/* Photo Upload */}
          <View className="bg-white rounded-2xl p-6 border border-slate-100">
            <Text className="text-sm text-slate-600 mb-3">
              Cow Photo (Optional)
            </Text>

            <Pressable className="h-32 border-2 border-dashed border-slate-300 rounded-xl items-center justify-center gap-2">
              <Camera size={32} color="#94a3b8" />
              <Text className="text-sm text-slate-600">
                Tap to add photo
              </Text>
            </Pressable>
          </View>

          {/* Basic Information */}
          <View className="bg-white rounded-2xl p-6 border border-slate-100">
            <Text className="text-slate-900 mb-4">
              Basic Information
            </Text>

            <View className="space-y-4">
              {/* Name */}
              <View>
                <Text className="text-sm text-slate-600 mb-2">
                  Cow Name *
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(v) =>
                    setFormData({ ...formData, name: v })
                  }
                  placeholder="e.g., Lassie"
                  className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />
              </View>

              {/* Breed */}
              <View>
                <Text className="text-sm text-slate-600 mb-2">
                  Breed *
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-2"
                >
                  {breeds.map((breed) => (
                    <Pressable
                      key={breed}
                      onPress={() =>
                        setFormData({ ...formData, breed })
                      }
                      className={`px-4 py-2 rounded-xl border ${
                        formData.breed === breed
                          ? "bg-green-600 border-green-600"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      <Text
                        className={
                          formData.breed === breed
                            ? "text-white"
                            : "text-slate-700"
                        }
                      >
                        {breed}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Age */}
              <View>
                <Text className="text-sm text-slate-600 mb-2">
                  Age (Years) *
                </Text>
                <TextInput
                  value={formData.age}
                  onChangeText={(v) =>
                    setFormData({ ...formData, age: v })
                  }
                  placeholder="e.g., 3"
                  keyboardType="numeric"
                  className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />
              </View>

              {/* Purchase Date */}
              <View>
                <Text className="text-sm text-slate-600 mb-2">
                  Purchase / Birth Date
                </Text>
                <TextInput
                  value={formData.purchaseDate}
                  onChangeText={(v) =>
                    setFormData({ ...formData, purchaseDate: v })
                  }
                  placeholder="YYYY-MM-DD"
                  className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />
              </View>
            </View>
          </View>

          {/* Lactation Info */}
          <View className="bg-white rounded-2xl p-6 border border-slate-100">
            <Text className="text-slate-900 mb-4">
              Lactation Information
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm text-slate-600 mb-2">
                  Lactation Number
                </Text>
                <TextInput
                  value={formData.lactationNumber}
                  onChangeText={(v) =>
                    setFormData({ ...formData, lactationNumber: v })
                  }
                  placeholder="e.g., 2"
                  keyboardType="numeric"
                  className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />
              </View>

              <View>
                <Text className="text-sm text-slate-600 mb-2">
                  Current Lactation Day
                </Text>
                <TextInput
                  value={formData.currentLactationDay}
                  onChangeText={(v) =>
                    setFormData({
                      ...formData,
                      currentLactationDay: v,
                    })
                  }
                  placeholder="e.g., 45"
                  keyboardType="numeric"
                  className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />
                <Text className="text-xs text-slate-500 mt-1">
                  Days since last calving
                </Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          <View className="bg-white rounded-2xl p-6 border border-slate-100">
            <Text className="text-slate-900 mb-4">
              Additional Notes
            </Text>
            <TextInput
              value={formData.notes}
              onChangeText={(v) =>
                setFormData({ ...formData, notes: v })
              }
              placeholder="Any special notes about this cow..."
              multiline
              numberOfLines={4}
              className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-top"
            />
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={!isFormValid || showSuccess}
            className={`py-5 rounded-2xl items-center ${
              isFormValid && !showSuccess
                ? "bg-green-600"
                : "bg-slate-300"
            }`}
          >
            <Text
              className={`text-lg ${
                isFormValid && !showSuccess
                  ? "text-white"
                  : "text-slate-500"
              }`}
            >
              {showSuccess ? "✓ Cow Added!" : "Add Cow to Farm"}
            </Text>
          </Pressable>

          {!isFormValid && (
            <Text className="text-center text-sm text-slate-500">
              * Please fill in all required fields
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/20 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 items-center mx-6">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🐄</Text>
            </View>
            <Text className="text-xl text-slate-900 mb-2">
              Cow Added Successfully!
            </Text>
            <Text className="text-sm text-slate-600 text-center">
              {formData.name} has been registered to your farm
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
