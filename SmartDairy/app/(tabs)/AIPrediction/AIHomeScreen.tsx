import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
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
} from "lucide-react-native";
import { useAIStore } from "../../../Store/aiStore"; // your Zustand store

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
    "Previous AI Dates": "",
    "Last Caving Date": "",
    "E. Age (Month)": "",
  });
  const [aiDates, setAiDates] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPending();
  }, []);

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
      "Previous AI Dates": "",
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
            {Object.keys(formData).map((key) => (
              <TextInput
                key={key}
                placeholder={key}
                value={formData[key]}
                onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                style={styles.input}
              />
            ))}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Plus size={18} color="white" />
              <Text style={styles.saveBtnText}>Save Record</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DETAIL VIEW */}
        {view === "detail" && selectedCow && (
          <View style={styles.card}>
            <View style={styles.detailHeader}>
              <View style={styles.cowIcon}>
                <Text style={{ fontSize: 24 }}>🐄</Text>
              </View>
              <View>
                <Text style={styles.cowId}>{selectedCow.cowId}</Text>
                <Text style={{ color: "#2E7D32", fontWeight: "bold" }}>
                  Breed: {selectedCow.Breed}
                </Text>
              </View>
              <MoreHorizontal size={20} />
            </View>

            {/* AI Recommendation */}
            {/* AI / Pregnancy Info Card */}
<View style={styles.aiCard}>
  {selectedCow.recommendation.status === "PENDING" ? (
    <>
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Recommended AI Date
      </Text>
      <Text style={{ color: "white", fontSize: 16 }}>
        {selectedCow.recommendation.recommended_next_ai
          ? new Date(
              selectedCow.recommendation.recommended_next_ai
            ).toDateString()
          : "N/A"}
      </Text>
    </>
  ) : (
    <>
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Pregnancy Check Date
      </Text>
      <Text style={{ color: "white", fontSize: 16 }}>
        {selectedCow.recommendation.pregnancy_check_date
          ? new Date(
              selectedCow.recommendation.pregnancy_check_date
            ).toDateString()
          : "Not Scheduled"}
      </Text>
    </>
  )}
  <Calendar size={24} color="white" />
</View>

            {/* Pregnancy Prediction */}
            {selectedCow.recommendation.status === "COMPLETED" && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Pregnancy Prediction</Text>
                <Text>Probability: {selectedCow.recommendation.pregnancy_probability || 0}%</Text>
                <Text>Risk Level: {selectedCow.recommendation.risk_level || "-"}</Text>

                {!selectedCow.recommendation.pregnancy_check_status && (
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <TouchableOpacity
                      style={styles.successBtn}
                      onPress={() =>
                        confirmPregnancyStatus(selectedCow.recommendation._id, "PREGNANT")
                      }
                    >
                      <Text style={styles.btnText}>Pregnant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dangerBtn}
                      onPress={() =>
                        confirmPregnancyStatus(selectedCow.recommendation._id, "NOT_PREGNANT")
                      }
                    >
                      <Text style={styles.btnText}>Not Pregnant</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedCow.recommendation.pregnancy_check_status && (
  <View style={{ marginTop: 16 }}>
    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
      Final Status: {selectedCow.recommendation.pregnancy_check_status}
    </Text>

    {/* Show All Cow Details */}
    <View style={{ marginTop: 12 }}>
      <Text>Lactation No: {selectedCow["Lactation No"]}</Text>
      <Text>Milk Yield: {selectedCow.Milk_Yield}</Text>
      <Text>Breed: {selectedCow.Breed}</Text>
      <Text>Milking/Dry: {selectedCow["Milking/Dry"]}</Text>
      <Text>Hormonal Treatment: {selectedCow["Hormonal Treatment"]}</Text>
      <Text>Estrus Cycle Length: {selectedCow["Estrus Cycle Length"]}</Text>
      <Text>Last Calving Date: {selectedCow["Last Caving Date"]}</Text>
      <Text>Age (Months): {selectedCow["E. Age (Month)"]}</Text>
    </View>
  </View>
)}
              </View>
            )}

            {selectedCow.recommendation.status === "PENDING" && (
              <View style={{ marginTop: 16 }}>
                <TextInput
                  placeholder="Enter AI done date (YYYY-MM-DD)"
                  value={aiDates[selectedCow._id] || ""}
                  onChangeText={(text) =>
                    setAiDates((prev) => ({ ...prev, [selectedCow._id]: text }))
                  }
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() =>
                    markDone(selectedCow, aiDates[selectedCow._id])
                  }
                >
                  <Text style={styles.saveBtnText}>Mark AI as Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <Layout size={20} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <ClipboardList size={20} />
          <Text style={styles.navText}>Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabBtn} onPress={handleAddClick}>
          <Plus size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Search size={20} />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Settings size={20} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
  successBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: "#4CAF50", padding: 12, borderRadius: 12 },
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
});