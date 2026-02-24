import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

  type CowStatus = "PENDING" | "COMPLETED";

type CowRecord = {
  id: string;
  breed: string;
  status: CowStatus;
  lastAiDate: string;
  lastCalvingDate: string;
  milkingStatus: string;
  hormonalTreatment: string;
  probability: number;
};


const INITIAL_COWS: CowRecord[] = [
  {
    id: "COW-882",
    breed: "Jersey",
    status: "PENDING",
    lastAiDate: "2026-02-22",
    lastCalvingDate: "2025-08-10",
    milkingStatus: "Milking",
    hormonalTreatment: "None",
    probability: 85,
  },
  {
    id: "COW-412",
    breed: "Friesian",
    status: "COMPLETED",
    lastAiDate: "2026-02-18",
    lastCalvingDate: "2025-09-05",
    milkingStatus: "Dry",
    hormonalTreatment: "GnRH",
    probability: 92,
  },
];

export default function Aidata() {
  const [view, setView] = useState("list");

  const [cows, setCows] = useState(INITIAL_COWS);
  const [formData, setFormData] = useState({
    breed: "Jersey",
    milkingStatus: "Milking",
    hormonalTreatment: "None",
    lastAiDate: "",
    lastCalvingDate: "",
  });


const [selectedCow, setSelectedCow] = useState<CowRecord | null>(null);

  const handleSave = () => {
    const newCow: CowRecord = {
  id: `COW-${Math.floor(100 + Math.random() * 900)}`,
  breed: formData.breed ?? "Jersey",
  status: "PENDING", // Now correctly inferred as CowStatus
  lastAiDate: formData.lastAiDate ?? "",
  lastCalvingDate: formData.lastCalvingDate ?? "",
  milkingStatus: formData.milkingStatus ?? "Milking",
  hormonalTreatment: formData.hormonalTreatment ?? "None",
  probability: Math.floor(70 + Math.random() * 25),
};

    setCows([newCow, ...cows]);
    setView("list");
  };

  return (
    <View style={styles.container}>
      {view === "list" && (
        <>
          <Text style={styles.title}>Breeding Records</Text>

          <FlatList
            data={cows}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setSelectedCow(item);
                  setView("detail");
                }}
              >
                <View>
                  <Text style={styles.cowId}>{item.id}</Text>
                  <Text style={styles.subText}>
                    {item.breed} • AI: {item.lastAiDate}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.badge,
                    item.status === "PENDING"
                      ? styles.pending
                      : styles.completed,
                  ]}
                >
                  {item.status}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.fab}
            onPress={() => setView("add")}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {view === "add" && (
        <ScrollView>
          <Text style={styles.title}>Register Cow</Text>

          <TextInput
            placeholder="Breed"
            style={styles.input}
            value={formData.breed}
            onChangeText={(text) =>
              setFormData({ ...formData, breed: text })
            }
          />

          <TextInput
            placeholder="AI Date (YYYY-MM-DD)"
            style={styles.input}
            value={formData.lastAiDate}
            onChangeText={(text) =>
              setFormData({ ...formData, lastAiDate: text })
            }
          />

          <TextInput
            placeholder="Last Calving Date"
            style={styles.input}
            value={formData.lastCalvingDate}
            onChangeText={(text) =>
              setFormData({ ...formData, lastCalvingDate: text })
            }
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Record</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setView("list")}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {view === "detail" && selectedCow && (
        <View>
          <Text style={styles.title}>{selectedCow.id}</Text>
          <Text style={styles.detailText}>
            Breed: {selectedCow.breed}
          </Text>
          <Text style={styles.detailText}>
            AI Date: {selectedCow.lastAiDate}
          </Text>
          <Text style={styles.detailText}>
            Last Calving: {selectedCow.lastCalvingDate}
          </Text>
          <Text style={styles.detailText}>
            Pregnancy Probability: {selectedCow.probability}%
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.pregnantBtn}>
              <Text style={styles.btnText}>Pregnant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notPregnantBtn}>
              <Text style={styles.btnText}>Not Pregnant</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setView("list")}>
            <Text style={styles.cancel}>Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAF9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cowId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 12,
    color: "#666",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  pending: {
    backgroundColor: "orange",
  },
  completed: {
    backgroundColor: "green",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#10b981",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancel: {
    marginTop: 20,
    textAlign: "center",
    color: "#999",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  pregnantBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  notPregnantBtn: {
    backgroundColor: "#f43f5e",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});