import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAIStore } from "../../Store/aiStore";

export const AiRecommendationScreen = () => {
  const {
    cows,
    addCow,
    markDone,
    loading,
    fetchPending,
    confirmPregnancyStatus,
  } = useAIStore();
  type CowForm = {
  cowId: string;
  "Lactation No": string;
  Milk_Yield: string;
  Breed: string;
  "Milking/Dry": string;
  "Hormonal Treatment": string;
  "Estrus Cycle Length": string;
  "Previous AI Dates": string;
  "Last Caving Date": string;
  "E. Age (Month)": string;
};

const [form, setForm] = useState<CowForm>({
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

  const handleAddCow = () => {
    if (!form.cowId) {
      alert("Please enter Cow ID");
      return;
    }
    addCow(form);
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐄 AI Reproductive Advisor</Text>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add New Cow</Text>

        {(Object.keys(form) as (keyof CowForm)[]).map((key) => (
  <TextInput
    key={key}
    placeholder={key}
    value={form[key]}
    onChangeText={(text) => setForm({ ...form, [key]: text })}
    style={styles.input}
  />
))}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleAddCow}>
          <Text style={styles.btnText}>Add Cow</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#2e7d32" />}
      </View>

      {/* LIST SECTION */}
      <Text style={styles.sectionTitle}>Cow Records</Text>

      {cows.map((cow) => (
        <View key={cow._id} style={styles.card}>
          
          <Text style={styles.cowTitle}>Cow ID: {cow.cowId}</Text>

          <Text>Milk Yield: {cow["Milk_Yield"]}</Text>
          <Text>Lactation: {cow["Lactation No"]}</Text>
          <Text>Breed: {cow["Breed"]}</Text>

          {cow.recommendation && (
            <View style={{ marginTop: 10 }}>

              {/* Status Badge */}
              <View
                style={[
                  styles.badge,
                  cow.recommendation.status === "PENDING"
                    ? styles.pending
                    : styles.completed,
                ]}
              >
                <Text style={styles.badgeText}>
                  {cow.recommendation.status}
                </Text>
              </View>

              {/* Recommended Date */}
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                  Recommended AI Date:
                </Text>
                <Text>
                  {cow.recommendation.recommended_next_ai && (
  <Text>{new Date(cow.recommendation.recommended_next_ai).toDateString()}</Text>
)}
                </Text>
              </View>

              {/* PENDING SECTION */}
              {cow.recommendation.status === "PENDING" && (
                <>
                  <TextInput
                    placeholder="Enter AI done date (YYYY-MM-DD)"
                    value={aiDates[cow._id] || ""}
                    onChangeText={(text) =>
                      setAiDates((prev) => ({ ...prev, [cow._id]: text }))
                    }
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() =>
                      markDone(cow, aiDates[cow._id])
                    }
                  >
                    <Text style={styles.btnText}>Mark AI as Done</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* COMPLETED SECTION */}
              {cow.recommendation.status === "COMPLETED" && (
                <>
                  <Text>
                    Pregnancy Probability:{" "}
                    {cow.recommendation.pregnancy_probability}
                  </Text>
                  <Text>
                    Risk Level: {cow.recommendation.risk_level}
                  </Text>

                  {!cow.recommendation.pregnancy_check_status && (
                    <View style={styles.row}>
                      <TouchableOpacity
                        style={styles.successBtn}
                        onPress={() =>
                          confirmPregnancyStatus(
                            cow.recommendation._id,
                            "PREGNANT"
                          )
                        }
                      >
                        <Text style={styles.btnText}>Pregnant</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dangerBtn}
                        onPress={() =>
                          confirmPregnancyStatus(
                            cow.recommendation._id,
                            "NOT_PREGNANT"
                          )
                        }
                      >
                        <Text style={styles.btnText}>Not Pregnant</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {cow.recommendation.pregnancy_check_status && (
                    <Text style={{ marginTop: 5 }}>
                      Final Status:{" "}
                      {cow.recommendation.pregnancy_check_status}
                    </Text>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default AiRecommendationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f4",
    padding: 15,
  },
  header: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cowTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c8e6c9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  successBtn: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  dangerBtn: {
    backgroundColor: "#e53935",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  badge: {
    padding: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  pending: {
    backgroundColor: "#ff9800",
  },
  completed: {
    backgroundColor: "#4caf50",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
  highlightBox: {
    backgroundColor: "#e8f5e9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  highlightText: {
    fontWeight: "bold",
  },
});