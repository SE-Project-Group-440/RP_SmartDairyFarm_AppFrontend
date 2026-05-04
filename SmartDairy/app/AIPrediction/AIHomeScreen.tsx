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
  Image,
  Alert,
  Platform
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
  Pencil,
  Trash2,
} from "lucide-react-native";
import { useAIStore } from "../../Store/aiStore"; // your Zustand store
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ViewAiCow from "./ViewAiCow";
import AddAiCow from "./AddAiCow";
import { useTranslations } from '@/hooks/useTranslations';
import { useAuthStore } from "@/Store/auth.store";
import { router } from "expo-router";
import { CommonFooter } from "../../components/CommonFooter";


export default function AIHomeScreen({ onBack }: { onBack?: () => void }) {
  const {
    cows,
    addCow,
    markDone,
    confirmPregnancyStatus,
    fetchPending,
    loading,
    updateCow,
    deleteCow,
  } = useAIStore();
  const { t } = useTranslations();

  const [view, setView] = useState<"list" | "detail" | "add">("list");
  const [selectedCow, setSelectedCow] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PREGNANT" | "PENDING">("ALL");
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
  const [editId, setEditId] = useState<string | null>(null);
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
    setEditId(null);
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
    setEditId(null);
    setView("add");
  };


  const filteredCows = cows.filter((cow) => {
    const matchesSearch = cow.cowId?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === "ALL") return matchesSearch;
    if (filterType === "PREGNANT") return matchesSearch && cow.recommendation.pregnancy_check_status === "PREGNANT";
    if (filterType === "PENDING") return matchesSearch && cow.recommendation.status === "PENDING";
    return matchesSearch;
  });

  const StatusBadge = ({ cow }: { cow: any }) => {
    let statusKey = "PENDING";
    if (cow.recommendation.pregnancy_check_status) {
      statusKey = "COMPLETED";
    } else if (cow.recommendation.status === "COMPLETED") {
      statusKey = "AI_COMPLETED";
    }

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor:
              statusKey === "PENDING" ? "#FFE0B2" : "#A5D6A7",
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color:
                statusKey === "PENDING" ? "#FB8C00" : "#16A34A",
            },
          ]}
        >
          {t("addAiCow", statusKey)}
        </Text>
      </View>
    );
  };
  const user = useAuthStore((s) => s.user);

  const handleEdit = (cow: any) => {
    setFormData({
      cowId: cow.cowId,
      ...cow.recommendation.input_data
    });
    setEditId(cow.recommendation._id);
    setView("add");
  };

  const handleDelete = async (id: string) => {
    await deleteCow(id);
    handleBack();
  };

  const confirmDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (window.confirm(t('addAiCow', 'confirmDelete') || "Are you sure you want to delete this record?")) {
        handleDelete(id);
      }
    } else {
      Alert.alert(
        t('addAiCow', 'deleteTitle') || "Delete Record",
        t('addAiCow', 'deleteMessage') || "Are you sure you want to delete this cow record?",
        [
          { text: t('addAiCow', 'cancel') || "Cancel", style: "cancel" },
          { text: t('addAiCow', 'delete') || "Delete", style: "destructive", onPress: () => handleDelete(id) }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          )}
          <Text className="text-2xl text-white">
            {user?.name || user?.email || "Farmer"}
          </Text>
        </View>
        <Text className="text-green-100">
          {t('dashboard', 'dairyFarmManagement')}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {loading && <ActivityIndicator size="large" color="#16A34A" />}

        {/* LIST VIEW */}
        {view === "list" && (
          <>
            {/* SUMMARY CARDS */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.summaryCard, { backgroundColor: '#E8F5E9', opacity: filterType === "ALL" ? 1 : 0.5 }]}
                onPress={() => setFilterType("ALL")}
              >
                <View style={[styles.iconBox, { backgroundColor: '#C8E6C9' }]}>
                  <ClipboardList size={20} color="#2E7D32" />
                </View>
                <Text style={[styles.summaryNumber, { color: '#2E7D32' }]}>{cows.length}</Text>
                <Text style={[styles.summaryLabel, { color: '#388E3C' }]}>{t('addAiCow', 'totalCows')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.summaryCard, { backgroundColor: '#E3F2FD', opacity: filterType === "PREGNANT" ? 1 : 0.5 }]}
                onPress={() => setFilterType("PREGNANT")}
              >
                <View style={[styles.iconBox, { backgroundColor: '#BBDEFB' }]}>
                  <CheckCircle2 size={20} color="#1565C0" />
                </View>
                <Text style={[styles.summaryNumber, { color: '#1565C0' }]}>
                  {cows.filter(c => c.recommendation.pregnancy_check_status === "PREGNANT").length}
                </Text>
                <Text style={[styles.summaryLabel, { color: '#1976D2' }]}>{t('addAiCow', 'pregnant')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.summaryCard, { backgroundColor: '#FFF3E0', opacity: filterType === "PENDING" ? 1 : 0.5 }]}
                onPress={() => setFilterType("PENDING")}
              >
                <View style={[styles.iconBox, { backgroundColor: '#FFE0B2' }]}>
                  <Bell size={20} color="#E65100" />
                </View>
                <Text style={[styles.summaryNumber, { color: '#E65100' }]}>
                  {cows.filter(c => c.recommendation.status === "PENDING").length}
                </Text>
                <Text style={[styles.summaryLabel, { color: '#F57C00' }]}>{t('addAiCow', 'aiDue')}</Text>
              </TouchableOpacity>
            </View>

            {/* ADD BTN */}
            <TouchableOpacity
              onPress={handleAddClick}
              activeOpacity={0.8}
              style={styles.addButton}
            >
              <View style={styles.addContent}>
                <View style={styles.addIconBg}>
                  <Plus size={24} color="#16A34A" />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.addTitle}>{t('addAiCow', 'title')}</Text>
                  <Text style={styles.addSubtitle}>Click here to add a new observation</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
              <Search size={18} color="#9E9E9E" style={{ marginRight: 8 }} />
              <TextInput
                placeholder={t('addAiCow', 'searchByCowId')}
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
                      source={require("../../assets/images/cow.png")}
                      style={styles.cowImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <View style={styles.cowRow}>
                      <Text style={styles.cowId}>{cow.cowId}</Text>
                      <StatusBadge cow={cow} />
                    </View>
                    <Text style={styles.cowSubtitle}>
                      {t('addAiCow', 'lastAi')}:{" "}
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
            updateCow={updateCow}
            editId={editId}
            initialData={formData}
            onCancel={() => {
              setView("list");
              setEditId(null);
            }}
            onBack={handleBack}
          />
        )}

        {/* DETAIL VIEW */}
        {view === "detail" && selectedCow && (
          <ViewAiCow
            cow={cows.find((c) => c._id === selectedCow._id) || selectedCow}
            aiDates={aiDates}
            setAiDates={setAiDates}
            markDone={markDone}
            confirmPregnancyStatus={confirmPregnancyStatus}
            onBack={handleBack}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "flex-start",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  summaryNumber: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  summaryLabel: { fontSize: 10, fontWeight: "700", textTransform: 'uppercase', letterSpacing: 0.5 },
  addButton: {
    backgroundColor: "#16A34A",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addIconBg: {
    width: 52,
    height: 52,
    backgroundColor: "white",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  addSubtitle: {
    color: "#DCFCE7",
    fontSize: 13,
  },
  cowImage: {
    width: 24,
    height: 24,
  },

});