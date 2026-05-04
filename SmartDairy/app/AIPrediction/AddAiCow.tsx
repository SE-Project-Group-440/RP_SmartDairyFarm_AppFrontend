import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Plus, ArrowLeft, Info, Droplets, Activity, Trash2, Calendar as CalendarIcon } from "lucide-react-native";
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  addCow: (data: any) => Promise<void>;
  updateCow?: (id: string, data: any) => Promise<void>;
  editId?: string | null;
  initialData?: any;
  onCancel: () => void;
  onBack: () => void;
}

export default function AddAiCow({ addCow, updateCow, editId, initialData, onCancel, onBack }: Props) {
  const [formData, setFormData] = useState<any>(initialData || {
    cowId: "",
    "Lactation No": "",
    Milk_Yield: "",
    Breed: "",
    "Milking/Dry": "",
    "Hormonal Treatment": "",
    "Estrus Cycle Length": "",
    "Estrus Signs": "",
    "Days_Since_Last_Estrus": "",
    "Previous AI Dates": [],
    "Last Caving Date": "",
    "E. Age (Month)": "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPicker, setShowPicker] = useState(false);
  const [calvingDate, setCalvingDate] = useState<Date | null>(initialData?.["Last Caving Date"] ? new Date(initialData["Last Caving Date"]) : null);
  const [showAiPicker, setShowAiPicker] = useState(false);
  const [tempAiDate, setTempAiDate] = useState<Date | null>(null);
  const { t } = useTranslations();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    const requiredFields = [
      { key: "cowId", label: t('addAiCow', 'cowId') },
      { key: "E. Age (Month)", label: t('addAiCow', 'ageMonths') },
      { key: "Breed", label: t('addAiCow', 'breed') },
      { key: "Lactation No", label: t('addAiCow', 'lactationNo') },
      { key: "Milk_Yield", label: t('addAiCow', 'milkYield') },
      { key: "Milking/Dry", label: t('addAiCow', 'milkingDry') },
      { key: "Estrus Cycle Length", label: t('addAiCow', 'estrusCycle') },
      { key: "Hormonal Treatment", label: t('addAiCow', 'hormonalTreatment') },
      { key: "Estrus Signs", label: t('addAiCow', 'estrusSigns') },
      { key: "Days_Since_Last_Estrus", label: t('addAiCow', 'daysSinceLastEstrus') },
      { key: "Last Caving Date", label: t('addAiCow', 'lastCalvingDate') }
    ];

    const newErrors: Record<string, string> = {};

    for (const field of requiredFields) {
      if (!formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (editId && updateCow) {
      await updateCow(editId, formData);
    } else {
      await addCow(formData);
    }
    onCancel();
  };

  const SectionHeader = ({ icon: Icon, title }: any) => (
    <View style={styles.sectionHeader}>
      <Icon size={20} color="#16A34A" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <ArrowLeft size={24} color="#333" />
        <Text style={styles.backText}>{editId ? t('addAiCow', 'editTitle') || 'Edit AI Record' : t('addAiCow', 'addtitle')}</Text>
      </Pressable>

      <View style={{ paddingBottom: 40, paddingLeft: 10, paddingRight: 10 }}>

          <SectionHeader icon={Info} title="Basic Information" />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addAiCow', 'cowId')} *</Text>
            <TextInput
              style={[styles.input, errors["cowId"] && styles.inputError]}
              placeholder="e.g., C-101"
              placeholderTextColor="#9CA3AF"
              value={formData.cowId}
              onChangeText={(text) => {
                setFormData({ ...formData, cowId: text });
                clearError("cowId");
              }}
            />
            {errors["cowId"] && <Text style={styles.errorText}>{errors["cowId"]}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'ageMonths')} *</Text>
              <TextInput
                style={[styles.input, errors["E. Age (Month)"] && styles.inputError]}
                placeholder="e.g., 24"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData["E. Age (Month)"]}
                onChangeText={(text) => {
                  setFormData({ ...formData, "E. Age (Month)": text });
                  clearError("E. Age (Month)");
                }}
              />
              {errors["E. Age (Month)"] && <Text style={styles.errorText}>{errors["E. Age (Month)"]}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'breed')} *</Text>
              <View style={[styles.pickerWrapper, errors["Breed"] && styles.inputError]}>
                <Picker
                  selectedValue={formData.Breed}
                  onValueChange={(value) => {
                    setFormData({ ...formData, Breed: value });
                    clearError("Breed");
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label={t('addAiCow', 'select')} value="" color="#9CA3AF" />
                  <Picker.Item label={t('addAiCow', 'jersey')} value="Jersey" />
                  <Picker.Item label={t('addAiCow', 'friesian')} value="Friesian" />
                  <Picker.Item label={t('addAiCow', 'crossbreed')} value="Crossbreed" />
                </Picker>
              </View>
              {errors["Breed"] && <Text style={styles.errorText}>{errors["Breed"]}</Text>}
            </View>
          </View>

          <SectionHeader icon={Droplets} title="Milk & Lactation" />

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'lactationNo')} *</Text>
              <TextInput
                style={[styles.input, errors["Lactation No"] && styles.inputError]}
                placeholder="e.g., 2"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData["Lactation No"]}
                onChangeText={(text) => {
                  setFormData({ ...formData, "Lactation No": text });
                  clearError("Lactation No");
                }}
              />
              {errors["Lactation No"] && <Text style={styles.errorText}>{errors["Lactation No"]}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'milkYield')}  *</Text>
              <TextInput
                style={[styles.input, errors["Milk_Yield"] && styles.inputError]}
                placeholder="(Liters)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.Milk_Yield}
                onChangeText={(text) => {
                  setFormData({ ...formData, Milk_Yield: text });
                  clearError("Milk_Yield");
                }}
              />
              {errors["Milk_Yield"] && <Text style={styles.errorText}>{errors["Milk_Yield"]}</Text>}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addAiCow', 'milkingDry')} *</Text>
            <View style={[styles.pickerWrapper, errors["Milking/Dry"] && styles.inputError]}>
              <Picker
                selectedValue={formData["Milking/Dry"]}
                onValueChange={(value) => {
                  setFormData({ ...formData, "Milking/Dry": value });
                  clearError("Milking/Dry");
                }}
                style={styles.pickerStyle}
              >
                <Picker.Item label={t('addAiCow', 'select')} value="" color="#9CA3AF" />
                <Picker.Item label={t('addAiCow', 'milking')} value="Milking" />
                <Picker.Item label={t('addAiCow', 'dry')} value="Dry" />
              </Picker>
            </View>
            {errors["Milking/Dry"] && <Text style={styles.errorText}>{errors["Milking/Dry"]}</Text>}
          </View>

          <SectionHeader icon={Activity} title="Reproduction History" />

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'estrusCycle')} *</Text>
              <TextInput
                style={[styles.input, errors["Estrus Cycle Length"] && styles.inputError]}
                placeholder="(Days)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData["Estrus Cycle Length"]}
                onChangeText={(text) => {
                  setFormData({ ...formData, "Estrus Cycle Length": text });
                  clearError("Estrus Cycle Length");
                }}
              />
              {errors["Estrus Cycle Length"] && <Text style={styles.errorText}>{errors["Estrus Cycle Length"]}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'hormonalTreatment')} *</Text>
              <View style={[styles.pickerWrapper, errors["Hormonal Treatment"] && styles.inputError]}>
                <Picker
                  selectedValue={formData["Hormonal Treatment"]}
                  onValueChange={(value) => {
                    setFormData({ ...formData, "Hormonal Treatment": value });
                    clearError("Hormonal Treatment");
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label={t('addAiCow', 'select')} value="" color="#9CA3AF" />
                  <Picker.Item label={t('addAiCow', 'yes')} value="Yes" />
                  <Picker.Item label={t('addAiCow', 'no')} value="No" />
                </Picker>
              </View>
              {errors["Hormonal Treatment"] && <Text style={styles.errorText}>{errors["Hormonal Treatment"]}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'estrusSigns')} *</Text>
              <View style={[styles.pickerWrapper, errors["Estrus Signs"] && styles.inputError]}>
                <Picker
                  selectedValue={formData["Estrus Signs"]}
                  onValueChange={(value) => {
                    setFormData({ ...formData, "Estrus Signs": value });
                    clearError("Estrus Signs");
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label={t('addAiCow', 'select')} value="" color="#9CA3AF" />
                  <Picker.Item label={t('addAiCow', 'weakEstrus')} value="1" />
                  <Picker.Item label={t('addAiCow', 'silentHeat')} value="2" />
                  <Picker.Item label={t('addAiCow', 'standingHeat')} value="3" />
                  <Picker.Item label={t('addAiCow', 'mounting')} value="4" />
                </Picker>
              </View>
              {errors["Estrus Signs"] && <Text style={styles.errorText}>{errors["Estrus Signs"]}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>{t('addAiCow', 'daysSinceLastEstrus')} *</Text>
              <TextInput
                style={[styles.input, errors["Days_Since_Last_Estrus"] && styles.inputError]}
                placeholder="(Days)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData["Days_Since_Last_Estrus"]}
                onChangeText={(text) => {
                  setFormData({ ...formData, "Days_Since_Last_Estrus": text });
                  clearError("Days_Since_Last_Estrus");
                }}
              />
              {errors["Days_Since_Last_Estrus"] && <Text style={styles.errorText}>{errors["Days_Since_Last_Estrus"]}</Text>}
            </View>
          </View>



          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addAiCow', 'lastCalvingDate')} *</Text>
            {Platform.OS === 'web' ? (
              React.createElement('input', {
                type: 'date',
                max: yesterday.toISOString().split("T")[0],
                value: calvingDate ? calvingDate.toISOString().split("T")[0] : "",
                onChange: (e: any) => {
                  const val = e.target.value;
                  if (val) {
                    const selectedDate = new Date(val);
                    setCalvingDate(selectedDate);
                    setFormData({ ...formData, "Last Caving Date": val });
                    clearError("Last Caving Date");
                  }
                },
                style: {
                  padding: '14px',
                  borderRadius: '12px',
                  border: errors["Last Caving Date"] ? '1px solid #EF4444' : '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  fontSize: '15px',
                  color: '#1F2937',
                  outline: 'none',
                  fontFamily: 'inherit',
                  width: '100%',
                }
              })
            ) : (
              <>
                <TouchableOpacity style={[styles.dateSelector, errors["Last Caving Date"] && styles.inputError]} onPress={() => setShowPicker(true)}>
                  <CalendarIcon size={20} color="#6B7280" />
                  <Text style={[styles.dateText, !calvingDate && { color: "#9CA3AF" }]}>
                    {calvingDate ? calvingDate.toISOString().split("T")[0] : t('addAiCow', 'selectDate')}
                  </Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={calvingDate || yesterday}
                    maximumDate={yesterday}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowPicker(Platform.OS === "ios");
                      if (selectedDate) {
                        setCalvingDate(selectedDate);
                        setFormData({ ...formData, "Last Caving Date": selectedDate.toISOString().split("T")[0] });
                        clearError("Last Caving Date");
                      }
                    }}
                  />
                )}
              </>
            )}
            {errors["Last Caving Date"] && <Text style={styles.errorText}>{errors["Last Caving Date"]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addAiCow', 'previousAiDates')}</Text>
            <View style={styles.aiDatesContainer}>
              {formData["Previous AI Dates"]?.map((date: string, index: number) => (
                <View key={index} style={styles.aiDateChip}>
                  <Text style={styles.aiDateChipText}>{date}</Text>
                  <TouchableOpacity onPress={() => {
                    const updated = [...formData["Previous AI Dates"]];
                    updated.splice(index, 1);
                    setFormData({ ...formData, "Previous AI Dates": updated });
                  }}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {Platform.OS === 'web' ? (
                React.createElement('input', {
                  type: 'date',
                  max: yesterday.toISOString().split("T")[0],
                  value: "",
                  onChange: (e: any) => {
                    const val = e.target.value;
                    if (val && !formData["Previous AI Dates"].includes(val)) {
                      setFormData({
                        ...formData,
                        "Previous AI Dates": [...formData["Previous AI Dates"], val],
                      });
                      clearError("Previous AI Dates");
                    }
                    e.target.value = '';
                  },
                  style: {
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: errors["Previous AI Dates"] ? '1px dashed #EF4444' : '1px dashed #16A34A',
                    backgroundColor: '#F0FDF4',
                    fontSize: '13px',
                    color: '#16A34A',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }
                })
              ) : (
                <TouchableOpacity style={[styles.addAiDateBtn, errors["Previous AI Dates"] && styles.inputError]} onPress={() => setShowAiPicker(true)}>
                  <Plus size={16} color="#16A34A" />
                  <Text style={styles.addAiDateText}>{t('addAiCow', 'addAiDate')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {errors["Previous AI Dates"] && <Text style={[styles.errorText, { marginTop: 6 }]}>{errors["Previous AI Dates"]}</Text>}

            {Platform.OS !== 'web' && showAiPicker && (
              <DateTimePicker
                value={tempAiDate || yesterday}
                maximumDate={yesterday}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowAiPicker(Platform.OS === "ios");
                  if (event.type === 'set' && selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    if (!formData["Previous AI Dates"].includes(formatted)) {
                      setFormData({
                        ...formData,
                        "Previous AI Dates": [...formData["Previous AI Dates"], formatted],
                      });
                      clearError("Previous AI Dates");
                    }
                  }
                }}
              />
            )}
          </View>

          <View style={styles.footerSpacing}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Plus size={20} color="white" />
              <Text style={styles.saveBtnText}>{editId ? t('addAiCow', 'updateRecord') || 'Update Record' : t('addAiCow', 'saveRecord')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>{t('addAiCow', 'cancel')}</Text>
            </TouchableOpacity>
          </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", padding: 20, borderRadius: 24, flex: 1 },
  backBtn: { marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 12 },
  backText: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputGroup: { marginBottom: 18 },
  label: { fontWeight: "600", color: "#4B5563", marginBottom: 8, fontSize: 13 },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1F2937",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  pickerWrapper: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    height: 52,
    justifyContent: "center",
  },
  pickerStyle: { height: 50, width: "100%", color: "#1F2937" },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  dateText: { fontSize: 15, color: "#1F2937" },
  aiDatesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  aiDateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 8,
  },
  aiDateChipText: { color: "#991B1B", fontWeight: "600", fontSize: 13 },
  addAiDateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderStyle: "dashed",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  addAiDateText: { color: "#16A34A", fontWeight: "600", fontSize: 13 },
  footerSpacing: { marginTop: 16, marginBottom: 40 },
  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  cancelBtn: { marginTop: 16, alignItems: "center", padding: 8 },
  cancelBtnText: { color: "#6B7280", fontWeight: "600", fontSize: 15 },
});