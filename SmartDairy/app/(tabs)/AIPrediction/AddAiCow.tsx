import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Plus } from "lucide-react-native";

interface Props {
  addCow: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function AddAiCow({ addCow, onCancel }: Props) {
  const [formData, setFormData] = useState<any>({
    cowId: "",
    "Lactation No": "",
    Milk_Yield: "",
    Breed: "",
    "Milking/Dry": "",
    "Hormonal Treatment": "",
    "Estrus Cycle Length": "",
    "Previous AI Dates": [],
    "Last Caving Date": "",
    "E. Age (Month)": "",
  });

  const [showPicker, setShowPicker] = useState(false);
  const [calvingDate, setCalvingDate] = useState<Date | null>(null);
  const [showAiPicker, setShowAiPicker] = useState(false);
  const [tempAiDate, setTempAiDate] = useState<Date | null>(null);

  const handleSave = async () => {
    if (!formData.cowId) {
      alert("Cow ID is required");
      return;
    }

    await addCow(formData);
    onCancel();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add New Cow For AI Monitoring</Text>

      <Text style={styles.label}>Cow ID</Text>
      <TextInput
        style={styles.input}
        value={formData.cowId}
        onChangeText={(text) =>
          setFormData({ ...formData, cowId: text })
        }
      />
      <Text style={styles.label}>Lactation No</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={formData["Lactation No"]}
                    onChangeText={(text) =>
                      setFormData({ ...formData, "Lactation No": text })
                    }
                    style={styles.input}
                  />

      <Text style={styles.label}>Breed</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.Breed}
          onValueChange={(value) =>
            setFormData({ ...formData, Breed: value })
          }
        >
          <Picker.Item label="Select Breed..." value="" />
          <Picker.Item label="Jersey" value="Jersey" />
          <Picker.Item label="Friesian" value="Friesian" />
          <Picker.Item label="Crossbreed" value="Crossbreed" />
        </Picker>
      </View>

      <Text style={styles.label}>Milking / Dry</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={formData["Milking/Dry"]}
                      onValueChange={(value) =>
                        setFormData({ ...formData, "Milking/Dry": value })
                      }
                    >
                      <Picker.Item label="Select..." value="" />
                      <Picker.Item label="Milking" value="Milking" />
                      <Picker.Item label="Dry" value="Dry" />
                    </Picker>
                  </View>

        <Text style={styles.label}>Hormonal Treatment</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={formData["Hormonal Treatment"]}
                        onValueChange={(value) =>
                          setFormData({ ...formData, "Hormonal Treatment": value })
                        }
                      >
                        <Picker.Item label="Select..." value="" />
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="No" value="No" />
                      </Picker>
                    </View>

      <Text style={styles.label}>Milk Yield</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={formData.Milk_Yield}
        onChangeText={(text) =>
          setFormData({ ...formData, Milk_Yield: text })
        }
      />
      <Text style={styles.label}>Estrus Cycle Length</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={formData["Estrus Cycle Length"]}
                    onChangeText={(text) =>
                      setFormData({ ...formData, "Estrus Cycle Length": text })
                    }
                    style={styles.input}
                  />
        <Text style={styles.label}>Age in Months</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={formData["E. Age (Month)"]}
                      onChangeText={(text) =>
                        setFormData({ ...formData, "E. Age (Month)": text })
                      }
                      style={styles.input}
                    />
                    <Text style={styles.label}>Previous AI Dates</Text>
        
                    {/* Add Button */}
                    <TouchableOpacity
                      style={[styles.saveBtn, { marginBottom: 12 }]}
                      onPress={() => setShowAiPicker(true)}
                    >
                      <Text style={styles.saveBtnText}>Add AI Date</Text>
                    </TouchableOpacity>
        {formData["Previous AI Dates"]?.map((date: string, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  padding: 8,
                  backgroundColor: "#E8F5E9",
                  borderRadius: 8,
                }}
              >
                <Text>{date}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...formData["Previous AI Dates"]];
                    updated.splice(index, 1);
                    setFormData({
                      ...formData,
                      "Previous AI Dates": updated,
                    });
                  }}
                >
                  <Text style={{ color: "red" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Date Picker */}
            {showAiPicker && (
              <DateTimePicker
                value={tempAiDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowAiPicker(false);
                  if (selectedDate) {
                    const formatted =
                      selectedDate.toISOString().split("T")[0];

                    setFormData({
                      ...formData,
                      "Previous AI Dates": [
                        ...formData["Previous AI Dates"],
                        formatted,
                      ],
                    });
                  }
                }}
              />
            )}

      <Text style={styles.label}>Last Calving Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text>
          {calvingDate
            ? calvingDate.toISOString().split("T")[0]
            : "Select Date"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={calvingDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setCalvingDate(selectedDate);
              setFormData({
                ...formData,
                "Last Caving Date": selectedDate
                  .toISOString()
                  .split("T")[0],
              });
            }
          }}
        />
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Plus size={18} color="white" />
        <Text style={styles.saveBtnText}>Save Record</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancel} style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", color: "gray" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", padding: 16, borderRadius: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: { color: "white", fontWeight: "bold" },
});