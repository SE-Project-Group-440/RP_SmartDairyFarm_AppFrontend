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
  Image
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
import AddAiCow from "./AddAiCow";


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
          { color: status === "PENDING" ? "#FB8C00" : "#16A34A" },
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
        {loading && <ActivityIndicator size="large" color="#16A34A" />}
 
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

                <Text style={styles.text}>Register New Cow For AI</Text>
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
                    
                    <Image
                      source={require("../../../assets/images/cow.png")}
                      style={styles.cowImage}
                      resizeMode="contain"
                    />
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
          <AddAiCow
            addCow={addCow}
            onCancel={() => setView("list")}
          />
        )}

        {/* DETAIL VIEW */}
        {view === "detail" && selectedCow && (  
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
  logoCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center" },
  logoText: { color: "white", fontWeight: "bold", fontSize: 18 },
  appTitle: { fontWeight: "bold", fontSize: 16 },
  appSubTitle: { fontSize: 10, color: "#16A34A", fontWeight: "600" },
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
  saveBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#16A34A", padding: 14, borderRadius: 12 },
  saveBtnText: { color: "white", fontWeight: "bold" },
  detailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  aiCard: { backgroundColor: "#16A34A", borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  successBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: "#4CAF50", padding: 12, borderRadius: 12, marginRight: 8 },
  dangerBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: "#E53935", padding: 12, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "bold" },
  fabBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center", marginBottom: 32 },
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
  backgroundColor: "#16A34A",
  padding: 12,
  borderRadius: 16,
  marginHorizontal: 4,
  alignItems: "center",
},
summaryNumber: { color: "white", fontSize: 18, fontWeight: "bold" },
summaryLabel: { color: "white", fontSize: 12 },
button: {
    width: "100%",
    backgroundColor: "#16A34A", 
    paddingVertical: 16,
    borderRadius: 24, 
    shadowColor: "#a7f3d0", 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6, 
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
  cowImage: {
  width: 24,
  height: 24,
},
 
});