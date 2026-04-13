import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, ScrollView } from "react-native";
import { useAIStore } from "../../../Store/aiStore";

export const AiRecommendationScreen = () => {
  const { cows, addCow, markDone, loading, fetchPending } = useAIStore();
  const fieldsOrder = [
    "cowId",
    "Lactation No",
    "Milk_Yield",
    "Breed",
    "Milking/Dry",
    "Hormonal Treatment",
    "Estrus Cycle Length",
    "Previous AI Dates",
    "Last Caving Date",
    "E. Age (Month)",
  ];

  const [form, setForm] = useState({
    cowId: "",
    "Lactation No": "",
    "Milk_Yield": "",
    "Breed": "",
    "Milking/Dry": "",
    "Hormonal Treatment": "",
    "Estrus Cycle Length": "",
    "Previous AI Dates": "",
    "Last Caving Date": "",
    "E. Age (Month)": "",
  });

  const [aiDate, setAiDate] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    fetchPending(); // fetch PENDING cows from DB on mount
  }, []);

  const handleAddCow = () => {
    if (!form.cowId) {
      alert("Please enter Cow ID");
      return;
    }
    addCow(form);
    setForm({
      cowId: "",
      "Lactation No": "",
      "Milk_Yield": "",
      "Breed": "",
      "Milking/Dry": "",
      "Hormonal Treatment": "",
      "Estrus Cycle Length": "",
      "Previous AI Dates": "",
      "Last Caving Date": "",
      "E. Age (Month)": "",
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add New Cow</Text>

      {fieldsOrder.map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          value={form[key]}
          onChangeText={(text) => setForm({ ...form, [key]: text })}
          style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
        />
      ))}

      <Button title="Add Cow" onPress={handleAddCow} />

      {loading && <ActivityIndicator size="large" color="green" style={{ marginTop: 10 }} />}

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Cows List</Text>

      {cows.map((cow) => (
        <View key={cow._id} style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}>
          <Text>No of times Lactated: {cow["Lactation No"]}</Text>
          <Text>Milk Yield: {cow["Milk_Yield"]}</Text>
          <Text>Breed: {cow["Breed"]}</Text>
          <Text>Milking/Dry: {cow["Milking/Dry"]}</Text>
          <Text>Hormonal Treatment: {cow["Hormonal Treatment"]}</Text>
          <Text>Estrus Cycle Length: {cow["Estrus Cycle Length"]}</Text>
          <Text>Previous AI Dates: {cow["Previous AI Dates"]}</Text>
          <Text>Last Caving Date: {cow["Last Caving Date"]}</Text>
          <Text>E. Age (Month): {cow["E. Age (Month)"]}</Text>

          {cow.recommendation && (
            <View style={{ marginTop: 10 }}>
              <Text>Recommended AI Date: {cow.recommendation.recommended_next_ai}</Text>
              <Text>Status: {cow.recommendation.status}</Text>

              {cow.recommendation.status === "PENDING" && (
                <View>
                  <TextInput
                    placeholder="Enter AI done date (YYYY-MM-DD)"
                    value={aiDate}
                    onChangeText={(text) => {
                      setAiDate(text);
                      setError("");
                    }}
                    style={{ borderWidth: 1, padding: 5, marginVertical: 5, borderColor: error ? 'red' : 'gray' }}
                  />
                  {error ? <Text style={{ color: 'red', marginBottom: 5 }}>{error}</Text> : null}
                  <Button title="Mark AI as Done" onPress={() => {
                    if (!aiDate.trim()) {
                      setError("Date is required!");
                      return;
                    }
                    markDone(cow, aiDate);
                  }} />
                </View>
              )}

              {cow.recommendation.status === "COMPLETED" && (
                <View>
                  <Text>Pregnancy Probability: {cow.recommendation.pregnancy_probability}</Text>
                  <Text>Risk Level: {cow.recommendation.risk_level}</Text>
                  <Text>Pregnancy Check Date: {cow.recommendation.pregnancy_check_date}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default AiRecommendationScreen;