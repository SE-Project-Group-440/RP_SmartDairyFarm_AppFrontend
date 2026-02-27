import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Layout,
  ClipboardList,
  Settings,
  Bell,
  User,
  ArrowLeft,
  MoreHorizontal,
  Search,
  CheckCircle2,
} from "lucide-react-native";
import { useAIStore } from "../../../Store/aiStore"; // your Zustand store
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ViewAiCow from "./viewAiCow";


export default function AiHomeScreen() {
  const {
    cows,
    addCow,
    markDone,
    confirmPregnancyStatus,
    fetchPending,
    loading,
  } = useAIStore();

  const [view, setView] = useState<"list" | "detail" | "add">("list");
  const [selectedCow, setSelectedCow] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [aiDates, setAiDates] = useState<Record<string, string>>({});
  const [showCalvingPicker, setShowCalvingPicker] = useState(false);
  const [calvingDate, setCalvingDate] = useState<Date | null>(null);
  const [showAiPicker, setShowAiPicker] = useState(false);
  const [tempAiDate, setTempAiDate] = useState<Date | null>(null);
  useEffect(() => {
    fetchPending();
  }, []);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedCow?.recommendation?.pregnancy_probability) {
      Animated.timing(progressAnim, {
        toValue: selectedCow.recommendation.pregnancy_probability,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(0);
    }
  }, [selectedCow]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  const InfoBox = ({ label, value }: { label: string; value?: string }) => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueBox}>
        <Text style={styles.infoValue}>{value || "-"}</Text>
      </View>
    </View>
  );
  const handleSelectCow = (cow: any) => {
    setSelectedCow(cow);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedCow(null);
    setView("list");
  };

  const handleAddClick = () => {
    setFormData({
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
    setView("add");
  };

  const handleSave = async () => {
    if (!formData.cowId) {
      alert("Cow ID is required");
      return;
    }
    await addCow(formData);
    setView("list");
  };

  const filteredCows = cows.filter((cow) =>
    cow.cowId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => (
    <View
      style={[
        styles.badge,
        { backgroundColor: status === "PENDING" ? "#FFE0B2" : "#A5D6A7" },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: status === "PENDING" ? "#FB8C00" : "#2E7D32" },
        ]}
      >
        {status}
      </Text>
    </View>
  );
  const FinalStatusHighlight = ({ cow }: { cow: any }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (
      cow?.recommendation?.pregnancy_check_status === "PREGNANT" ||
      cow?.recommendation?.pregnancy_check_status === "NOT_PREGNANT"
    ) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cow]);

  const status = cow?.recommendation?.pregnancy_check_status;

  if (status !== "PREGNANT" && status !== "NOT_PREGNANT") {
    return null;
  }

  const isPregnant = status === "PREGNANT";

  return (
    <Animated.View
      style={[
        styles.finalContainer,
        {
          backgroundColor: isPregnant ? "#84D288" : "#fff1f2",
          borderColor: isPregnant ? "#84D288" : "#fecdd3",
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isPregnant ? "#2E7D32" : "#e11d48" },
        ]}
      >
        {isPregnant ? (
          <CheckCircle2 size={24} color="white" />
        ) : (
          <XCircle size={24} color="white" />
        )}
      </View>

      <View>
        <Text style={styles.finalLabel}>Final Result</Text>
        <Text
          style={[
            styles.finalTitle,
            { color: isPregnant ? "#065f46" : "#9f1239" },
            
          ]}
        >
          {isPregnant
            ? "Pregnant"
            : "Not Pregnant"}
        </Text>
      </View>
    </Animated.View>
  );
};
  

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {view !== "list" ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={20} />
            <Text style={styles.backText}>{view === "add" ? "Cancel" : "Back"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerTitleContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>D</Text>
            </View>
            <View>
              <Text style={styles.appTitle}>DairySmart</Text>
              <Text style={styles.appSubTitle}>Sri Lanka</Text>
            </View>
          </View>
        )}
        <View style={styles.headerIcons}>
          <Bell size={20} />
          <View style={styles.userCircle}>
            <User size={16} />
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {loading && <ActivityIndicator size="large" color="#2E7D32" />}
 
        {/* LIST VIEW */}
        {view === "list" && (
          <>
            <TouchableOpacity
              onPress={handleAddClick}
              activeOpacity={0.9}
              style={styles.button}
            >
              <View style={styles.content}>
                <View style={styles.iconWrapper}>
                  <Plus size={20} color="#fff" />
                </View>

                <Text style={styles.text}>Register New Cow</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>{cows.length}</Text>
                <Text style={styles.summaryLabel}>Total Cows</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>
                  {cows.filter(c => c.recommendation.pregnancy_check_status === "PREGNANT").length}
                </Text>
                <Text style={styles.summaryLabel}>Pregnant</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>
                  {cows.filter(c => c.recommendation.status === "PENDING").length}
                </Text>
                <Text style={styles.summaryLabel}>AI Due</Text>
              </View>
            </View>

            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
              <Search size={18} color="#9E9E9E" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search cow ID..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor="#9E9E9E"
              />
            </View>

            {/* COW LIST */}
            {filteredCows.map((cow) => (
              <TouchableOpacity
                key={cow._id}
                style={styles.cowCard}
                onPress={() => handleSelectCow(cow)}
              >
                <View style={styles.cowCardLeft}>
                  <View style={styles.cowIcon}>
                    <Text style={{ fontSize: 24 }}>🐄</Text>
                  </View>
                  <View>
                    <View style={styles.cowRow}>
                      <Text style={styles.cowId}>{cow.cowId}</Text>
                      <StatusBadge status={cow.recommendation.status} />
                    </View>
                    <Text style={styles.cowSubtitle}>
                      Last AI:{" "}
                      {cow.recommendation.recommended_next_ai
                        ? new Date(
                            cow.recommendation.recommended_next_ai
                          ).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </View>
                </View>
                <MoreHorizontal size={20} color="#9E9E9E" />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ADD VIEW */}
        {view === "add" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add New Cow</Text>

            {/* Cow ID */}
            <Text style={styles.label}>Cow ID</Text>
            <TextInput
              value={formData.cowId}
              onChangeText={(text) => setFormData({ ...formData, cowId: text })}
              style={styles.input}
            />

            {/* Lactation No */}
            <Text style={styles.label}>Lactation No</Text>
            <TextInput
              keyboardType="numeric"
              value={formData["Lactation No"]}
              onChangeText={(text) =>
                setFormData({ ...formData, "Lactation No": text })
              }
              style={styles.input}
            />

            {/* Breed Dropdown */}
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

            {/* Milking/Dry Dropdown */}
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

            {/* Hormonal Treatment Dropdown */}
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

            {/* Milk Yield */}
            <Text style={styles.label}>Milk Yield</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.Milk_Yield}
              onChangeText={(text) =>
                setFormData({ ...formData, Milk_Yield: text })
              }
              style={styles.input}
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

            {/* Show Added Dates */}
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
              onPress={() => setShowCalvingPicker(true)}
            >
              <Text>
                {calvingDate
                  ? calvingDate.toISOString().split("T")[0]
                  : "Select Date"}
              </Text>
            </TouchableOpacity>

            {showCalvingPicker && (
              <DateTimePicker
                value={calvingDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowCalvingPicker(false);
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
          </View>
        )}

        {/* DETAIL VIEW */}
        {view === "detail" && selectedCow && (
          // <View style={styles.card}>
          //   <View style={styles.detailHeader}>
          //     <View style={styles.cowIcon}>
          //       <Text style={{ fontSize: 24 }}>🐄</Text>
          //     </View>
          //     <View>
          //       <Text style={styles.cowId}>Cow Id:{selectedCow.cowId}</Text> 
          //     </View>
          //     <MoreHorizontal size={20} />
          //   </View>
          //   {/* BASIC COW INFO - ALWAYS VISIBLE */}

          //   <Text style={{ fontWeight: "bold", marginBottom: 8,marginTop: 16  }}>
          //     Cow Information
          //   </Text>
          //   <FinalStatusHighlight cow={selectedCow} />

          //   <View style={styles.row}>
          //     <InfoBox label="Breed" value={selectedCow?.Breed} />
          //     <InfoBox label="Age (Months)" value={selectedCow?.["E. Age (Month)"]} />
          //   </View>
          //   <View style={styles.row}>
          //     <InfoBox label="Lactation No" value={selectedCow?.["Lactation No"]} />
          //     <InfoBox label="Milk Yield" value={selectedCow?.Milk_Yield} />
          //   </View>

          //   <View style={styles.row}>
          //     <InfoBox label="Estrus Cycle Length" value={selectedCow?.["Estrus Cycle Length"]} />
          //     <InfoBox label="Hormonal Treatment" value={selectedCow?.["Hormonal Treatment"]} />
          //   </View>
            
          //   <View style={styles.row}>
          //     <InfoBox label="Previous AI Dates" value={selectedCow?.["Previous AI Dates"]} />
          //     <InfoBox label="Last Calving Date" value={selectedCow?.["Last Caving Date"]} />
          //   </View>
          //   <View style={styles.row}>
          //     <InfoBox label="Milking/Dry" value={selectedCow?.["Milking/Dry"]} />      
          //   </View>
              
          //   {selectedCow.recommendation.pregnancy_check_status !== "PREGNANT" && (
          //     <View style={styles.aiCard}>
          //       {selectedCow.recommendation.status === "PENDING" && (
          //         <>
          //           <View>
          //             <Text style={{ color: "white", fontWeight: "bold" }}>
          //               Recommended AI Date
          //             </Text>
          //             <Text style={{ color: "white", fontSize: 16 }}>
          //               {selectedCow.recommendation.recommended_next_ai
          //                 ? new Date(
          //                     selectedCow.recommendation.recommended_next_ai
          //                   ).toDateString()
          //                 : "N/A"}
          //             </Text>
          //           </View>
          //           <Calendar size={24} color="white" />
          //         </>
          //       )}

          //       {selectedCow.recommendation.status === "COMPLETED" && (
          //         <>
          //           <View>
          //             <Text style={{ color: "white", fontWeight: "bold" }}>
          //               Pregnancy Check Date
          //             </Text>
          //             <Text style={{ color: "white", fontSize: 16 }}>
          //               {selectedCow.recommendation.pregnancy_check_date
          //                 ? new Date(
          //                     selectedCow.recommendation.pregnancy_check_date
          //                   ).toDateString()
          //                 : "Not Scheduled"}
          //             </Text>
          //           </View>
          //           <Calendar size={24} color="white" />
          //         </>
          //       )}
          //     </View>
          //   )}
          //   {selectedCow.recommendation.pregnancy_check_status && (
          //     <View style={{ marginTop: 16 }}>
                
          //       {selectedCow.recommendation.pregnancy_check_status === "PREGNANT" && (
          //         <View style={styles.row}>
          //           <InfoBox label="AI Date" value={
          //             selectedCow.recommendation.recommended_next_ai
          //               ? new Date(selectedCow.recommendation.recommended_next_ai)
          //                   .toISOString()
          //                   .split("T")[0]
          //               : "-"
          //           } />
          //           <InfoBox label="Pregnancy Checked Date" value={
          //             selectedCow.recommendation.pregnancy_check_date
          //               ? new Date(selectedCow.recommendation.pregnancy_check_date)
          //                   .toISOString()
          //                   .split("T")[0]
          //               : "-"
          //           }
          //           />
                    
          //         </View>
          //       )}
          //     </View>
          //   )}
          //   {/* Pregnancy Prediction */}
          //   {selectedCow.recommendation.status === "COMPLETED" && (
          //     <View style={{ marginTop: 16 }}>
          //       <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Pregnancy Prediction</Text>
          //       <View style={styles.row}>
          //         <InfoBox label="Probability" value={`${selectedCow.recommendation.pregnancy_probability || 0}%`} />
          //         <InfoBox label="Risk Level" value={selectedCow.recommendation.risk_level || "-"} />   
          //       </View>
                
          //       {!selectedCow.recommendation.pregnancy_check_status && (
          //         <View style={{ flexDirection: "row", marginTop: 8 }}>
          //           <TouchableOpacity
          //             style={styles.successBtn}
          //             onPress={() =>
          //               confirmPregnancyStatus(selectedCow.recommendation._id, "PREGNANT")
          //             }
          //           >
          //             <Text style={styles.btnText}>Pregnant</Text>
          //           </TouchableOpacity>
          //           <TouchableOpacity
          //             style={styles.dangerBtn}
          //             onPress={() =>
          //               confirmPregnancyStatus(selectedCow.recommendation._id, "NOT_PREGNANT")
          //             }
          //           >
          //             <Text style={styles.btnText}>Not Pregnant</Text>
          //           </TouchableOpacity>
          //         </View>
          //       )}  
          //     </View>
          //   )}

          //   {selectedCow.recommendation.status === "PENDING" && (
          //     <View style={{ marginTop: 16 }}>
          //       <TextInput
          //         placeholder="Enter AI done date (YYYY-MM-DD)"
          //         value={aiDates[selectedCow._id] || ""}
          //         onChangeText={(text) =>
          //           setAiDates((prev) => ({ ...prev, [selectedCow._id]: text }))
          //         }
          //         style={styles.input}
          //       />
          //       <TouchableOpacity
          //         style={styles.saveBtn}
          //         onPress={() =>
          //           markDone(selectedCow, aiDates[selectedCow._id])
          //         }
          //       >
          //         <Text style={styles.saveBtnText}>Mark AI as Done</Text>
          //       </TouchableOpacity>
          //     </View>
          //   )}
          // </View>
          <ViewAiCow
    cow={selectedCow}
    aiDates={aiDates}
    setAiDates={setAiDates}
    markDone={markDone}
    confirmPregnancyStatus={confirmPregnancyStatus}
  />
        )}
      </ScrollView>

      
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF9" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "white" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { fontWeight: "bold", marginLeft: 4 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#2E7D32", justifyContent: "center", alignItems: "center" },
  logoText: { color: "white", fontWeight: "bold", fontSize: 18 },
  appTitle: { fontWeight: "bold", fontSize: 16 },
  appSubTitle: { fontSize: 10, color: "#2E7D32", fontWeight: "600" },
  headerIcons: { flexDirection: "row", gap: 12 },
  userCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" },
  cowCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: 12, borderRadius: 20, marginBottom: 12 },
  cowCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  cowIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" },
  cowRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cowId: { fontWeight: "bold" },
  cowSubtitle: { fontSize: 12, color: "#757575" },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontWeight: "bold", fontSize: 10 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 20, marginBottom: 16 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 12, padding: 12, marginBottom: 12 },
  saveBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#2E7D32", padding: 14, borderRadius: 12 },
  saveBtnText: { color: "white", fontWeight: "bold" },
  detailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  aiCard: { backgroundColor: "#2E7D32", borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressBar: { width: "100%", height: 10, backgroundColor: "#E0E0E0", borderRadius: 5 },
  progressFill: { height: 10, backgroundColor: "#2E7D32", borderRadius: 5 },
  successBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: "#4CAF50", padding: 12, borderRadius: 12, marginRight: 8 },
  dangerBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: "#E53935", padding: 12, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "bold" },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 64, flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: "white" },
  navBtn: { flexDirection: "column", alignItems: "center" },
  navText: { fontSize: 10, fontWeight: "bold" },
  fabBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#2E7D32", justifyContent: "center", alignItems: "center", marginBottom: 32 },
  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#E0E0E0",
},

searchInput: {
  flex: 1,
  fontSize: 14,
},
summaryCard: {
  flex: 1,
  backgroundColor: "#2E7D32",
  padding: 12,
  borderRadius: 16,
  marginHorizontal: 4,
  alignItems: "center",
},
summaryNumber: { color: "white", fontSize: 18, fontWeight: "bold" },
summaryLabel: { color: "white", fontSize: 12 },
label: {
  marginBottom: 4,
  fontWeight: "bold",
  color: "#333",
},

pickerWrapper: {
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 12,
  marginBottom: 12,
  backgroundColor: "#F9F9F9",
  overflow: "hidden",
},
button: {
    width: "100%",
    backgroundColor: "#2E7D32", // emerald-600
    paddingVertical: 16,
    borderRadius: 24, // rounded-3xl
    shadowColor: "#a7f3d0", // emerald-200 shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6, // Android shadow
    marginBottom: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    backgroundColor: "",
    padding: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  probRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  probLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },

  probValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#059669",
  },

  progressBg: {
    height: 12,
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
infoContainer: {
    flex: 1,
    marginHorizontal: 5,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
    marginLeft: 4,
  },

  infoValueBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#f1f5f9",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
  },
  finalContainer: {
  marginBottom: 20,
  padding: 16,
  borderRadius: 20,
  borderWidth: 2,
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
},

finalLabel: {
  fontSize: 10,
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: 1.5,
  opacity: 0.7,
},

finalTitle: {
  fontSize: 18,
  fontWeight: "900",
},
iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", elevation: 4, },

});