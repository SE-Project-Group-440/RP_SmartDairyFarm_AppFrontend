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
import { useCowStore } from "../../Store/cowStore";

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
  "Murrah",
  "Other",
];

export function AddCowScreen({ onBack }: AddCowScreenProps) {
  const { createCow, isCreating } = useCowStore();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    birthDate: "",
    color: "",
    weight: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid =
    formData.name &&
    formData.breed &&
    formData.birthDate;

  

  const calculateAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();

    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    return years * 12 + months;
  };

  const handleSubmit = async () => {
    if (!isFormValid || isCreating) return;

    const payload = {
      name: formData.name,
      breed: formData.breed,
      birthDate: formData.birthDate,
      ageInMonths: calculateAgeInMonths(formData.birthDate),
      color: formData.color || null,
      weight: formData.weight
        ? Number(formData.weight)
        : null,
      status: "Active" as const,
    };

    try {
      await createCow(payload);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 1500);
    } catch (e) {
      console.error("Create cow failed", e);
    }
  };

  /* ---------------- UI ---------------- */

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
            <Text className="text-green-100">
              Back to Dashboard
            </Text>
          </Pressable>

          <Text className="text-2xl text-white mb-1">
            Add New Cow
          </Text>
          <Text className="text-green-100">
            Register a new cow to your farm
          </Text>
        </View>

        <View className="px-6 py-6 space-y-6">
          {/* Photo */}
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

          {/* Basic Info */}
          <View className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
            <Text className="text-slate-900">
              Basic Information
            </Text>

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
                placeholder="e.g., Raththi"
                className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
              />
            </View>

            {/* Breed */}
            <View>
              <Text className="text-sm text-slate-600 mb-2">
                Breed *
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
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
                </View>
              </ScrollView>
            </View>

            {/* Birth Date */}
            <View>
              <Text className="text-sm text-slate-600 mb-2">
                Birth Date *
              </Text>
              <TextInput
                value={formData.birthDate}
                onChangeText={(v) =>
                  setFormData({
                    ...formData,
                    birthDate: v,
                  })
                }
                placeholder="YYYY-MM-DD"
                className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
              />
            </View>

            {/* Color */}
            <View>
              <Text className="text-sm text-slate-600 mb-2">
                Color (Optional)
              </Text>
              <TextInput
                value={formData.color}
                onChangeText={(v) =>
                  setFormData({ ...formData, color: v })
                }
                placeholder="e.g., Black"
                className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
              />
            </View>

            {/* Weight */}
            <View>
              <Text className="text-sm text-slate-600 mb-2">
                Weight (kg, optional)
              </Text>
              <TextInput
                value={formData.weight}
                onChangeText={(v) =>
                  setFormData({ ...formData, weight: v })
                }
                keyboardType="numeric"
                placeholder="e.g., 450"
                className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
              />
            </View>
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={!isFormValid || isCreating}
            className={`py-5 rounded-2xl items-center ${
              isFormValid && !isCreating
                ? "bg-green-600"
                : "bg-slate-300"
            }`}
          >
            <Text
              className={`text-lg ${
                isFormValid && !isCreating
                  ? "text-white"
                  : "text-slate-500"
              }`}
            >
              {isCreating ? "Saving..." : "Add Cow"}
            </Text>
          </Pressable>

          {!isFormValid && (
            <Text className="text-center text-sm text-slate-500">
              * Name, Breed, and Birth Date are required
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
              {formData.name} has been registered
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
