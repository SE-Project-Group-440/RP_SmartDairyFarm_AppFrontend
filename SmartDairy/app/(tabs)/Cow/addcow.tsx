import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useCowStore } from "../../../Store/cowStore";

export default function AddCowScreen() {
  const { createCow, loading } = useCowStore();

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [ageInMonths, setAgeInMonths] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");

  const onSubmit = async () => {
    await createCow({
      name,
      breed,
      birthDate: birthDate?.toISOString(),
      ageInMonths: Number(ageInMonths),
      color,
      weight: Number(weight),
      status: "Active",
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Add New Cow 🐄</Text>
      <Text style={styles.subtitle}>
        Register cow details to start smart tracking
      </Text>

      <View style={styles.card}>
        <Input label="Cow Name" icon="paw" value={name} onChange={setName} />
        <Input label="Breed" icon="leaf" value={breed} onChange={setBreed} />
        <Input
          label="Age (Months)"
          icon="time"
          value={ageInMonths}
          onChange={setAgeInMonths}
          keyboard="numeric"
        />
        <Input label="Color" icon="color-palette" value={color} onChange={setColor} />
        <Input
          label="Weight (kg)"
          icon="speedometer"
          value={weight}
          onChange={setWeight}
          keyboard="numeric"
        />

        <View style={styles.dateBox}>
          <Ionicons name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.dateText}>
            {birthDate ? birthDate.toDateString() : "Select Birth Date"}
          </Text>
        </View>

        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => setBirthDate(date ?? null)}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Adding..." : "Add Cow"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          Lactation cycle & milking records will be created automatically.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------- Input Component ---------- */

type InputProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChange: (text: string) => void;
  keyboard?: "default" | "numeric";
};

function Input({
  label,
  icon,
  value,
  onChange,
  keyboard = "default",
}: InputProps) {
  return (
    <View style={styles.inputBox}>
      <Ionicons name={icon} size={18} color="#4CAF50" />
      <TextInput
        placeholder={label}
        value={value}
        keyboardType={keyboard}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1B5E20",
  },
  subtitle: {
    marginTop: 4,
    color: "#558B2F",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 12,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 8,
    color: "#2E7D32",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    color: "#777",
  },
});
