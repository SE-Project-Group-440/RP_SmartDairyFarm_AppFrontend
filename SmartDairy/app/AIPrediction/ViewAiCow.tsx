import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Image
} from "react-native";
import { Calendar, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react-native";
import { useTranslations } from "@/hooks/useTranslations";

interface Props {
  cow: any;
  aiDates: Record<string, string>;
  setAiDates: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  markDone: (cow: any, date: string) => void;
  confirmPregnancyStatus: (
  id: string,
  status: "PREGNANT" | "NOT_PREGNANT"
) => Promise<void>;
}

export default function ViewAiCow({
  cow,
  aiDates,
  setAiDates,
  markDone,
  confirmPregnancyStatus,
}: Props) {
    
  const progressAnim = useRef(new Animated.Value(0)).current;
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
            { backgroundColor: isPregnant ? "#16A34A" : "#e11d48" },
          ]}
        >
          {isPregnant ? (
            <CheckCircle2 size={24} color="white" />
          ) : (
            <XCircle size={24} color="white" />
          )}
        </View>
  
        <View>
          <Text style={styles.finalLabel}>{t('addAiCow', 'finalResult')}</Text>
          <Text
            style={[
              styles.finalTitle,
              { color: isPregnant ? "#065f46" : "#9f1239" },
              
            ]}
          >
            {isPregnant
              ? t('addAiCow', 'pregnant')
              : t('addAiCow', 'notPregnant')}
          </Text>
        </View>
      </Animated.View>
    );
  };
  const { t } = useTranslations();

  useEffect(() => {
    if (cow?.recommendation?.pregnancy_probability) {
      Animated.timing(progressAnim, {
        toValue: cow.recommendation.pregnancy_probability,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [cow]);

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

  if (!cow) return null;

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.detailHeader}>
        <View style={styles.cowIcon}>
            <Image
              source={require("../../assets/images/cow.png")}
              style={styles.cowImage}
              resizeMode="contain"
            />
        </View>
        <View>
          <Text style={styles.cowId}>Cow - {cow.cowId}</Text>
        </View>
        <MoreHorizontal size={20} />
      </View>

      <Text style={styles.sectionTitle}>{t('addAiCow', 'viewtitle')}</Text>

      <FinalStatusHighlight cow={cow} />

      <View style={styles.row}>
        <InfoBox label={t('addAiCow', 'breed')} value={t('addAiCow', cow?.Breed)} />
        <InfoBox label={t('addAiCow', 'ageMonths')} value={cow?.["E. Age (Month)"]} />
      </View>

      <View style={styles.row}>
        <InfoBox label={t('addAiCow', 'lactationNo')} value={cow?.["Lactation No"]} />
        <InfoBox label={t('addAiCow', 'milkYield')} value={cow?.Milk_Yield} />
      </View>

      <View style={styles.row}>
        <InfoBox label={t('addAiCow', 'estrusCycle')} value={cow?.["Estrus Cycle Length"]} />
        <InfoBox label={t('addAiCow', 'hormonalTreatment')} value={t('addAiCow', cow?.["Hormonal Treatment"])} />
      </View>
                  
      <View style={styles.row}>
        <InfoBox label={t('addAiCow', 'previousAiDates')} value={cow?.["Previous AI Dates"]} />
        <InfoBox label={t('addAiCow', 'lastCalvingDate')} value={cow?.["Last Caving Date"]} />
      </View>
      <View style={styles.row}>
        <InfoBox label={t('addAiCow', 'milkingDry')} value={t('addAiCow', cow?.["Milking/Dry"])} />      
      </View>

      {cow.recommendation.pregnancy_check_status !== "PREGNANT" && (
        <View style={styles.aiCard}>
          {cow.recommendation.status === "PENDING" && (
            <>
              <View>
                <Text style={styles.aiLabel}>{t('addAiCow', 'recommendAiDate')}</Text>
                <Text style={styles.aiValue}>
                  {cow.recommendation.recommended_next_ai
                    ? new Date(
                        cow.recommendation.recommended_next_ai
                      ).toDateString()
                    : "N/A"}
                </Text>
              </View>
              <Calendar size={24} color="white" />
            </>
          )}

          {cow.recommendation.status === "COMPLETED" && (
            <>
              <View>
                <Text style={styles.aiLabel}>{t('addAiCow', 'pregnancyCheckDate')}</Text>
                <Text style={styles.aiValue}>
                  {cow.recommendation.pregnancy_check_date
                    ? new Date(
                        cow.recommendation.pregnancy_check_date
                      ).toDateString()
                    : "Not Scheduled"}
                </Text>
              </View>
              <Calendar size={24} color="white" />
            </>
          )}
        </View>
      )}

      {cow.recommendation.pregnancy_check_status && (
        <View style={{ marginTop: 16 }}>
          {cow.recommendation.pregnancy_check_status === "PREGNANT" && (
            <View style={styles.row}>
              <InfoBox label={t('addAiCow', 'aiDate')} value={
                cow.recommendation.recommended_next_ai
                ? new Date(cow.recommendation.recommended_next_ai)
                .toISOString()
                .split("T")[0]
                : "-"
              } />
              <InfoBox label={t('addAiCow', 'pregnancyCheckDate')} value={
                cow.recommendation.pregnancy_check_date
                ? new Date(cow.recommendation.pregnancy_check_date)
                .toISOString()
                .split("T")[0]
                : "-"
              }
              />
            </View>
          )}
        </View>
      )}
      {/* Pregnancy Prediction */}
      {cow.recommendation.status === "COMPLETED" && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>{t('addAiCow', 'pregnancyPrediction')}</Text>
          <View style={styles.row}>
            <InfoBox label={t('addAiCow', 'probability')} value={`${cow.recommendation.pregnancy_probability || 0}%`} />
            <InfoBox label={t('addAiCow', 'riskLevel')} value={t('addAiCow', cow.recommendation.risk_level || "-")} />   
          </View>
            
          {!cow.recommendation.pregnancy_check_status && (
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity
                style={styles.successBtn}
                  onPress={() =>
                  confirmPregnancyStatus(cow.recommendation._id, "PREGNANT")
                }
              >
                <Text style={styles.btnText}>{t('addAiCow', 'pregnant')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dangerBtn}
                onPress={() =>
                  confirmPregnancyStatus(cow.recommendation._id, "NOT_PREGNANT")
                }
              >
                <Text style={styles.btnText}>{t('addAiCow', 'notPregnant')}</Text>
              </TouchableOpacity>
            </View>
          )}  
        </View>
      )}
      {cow.recommendation.status === "PENDING" && (
        <View style={{ marginTop: 16 }}>
          <TextInput
            placeholder={t('addAiCow', 'enterAiDate')}
            value={aiDates[cow._id] || ""}
            onChangeText={(text) =>
              setAiDates((prev) => ({ ...prev, [cow._id]: text }))
            }
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() =>
              markDone(cow, aiDates[cow._id])
            }
          >
           <Text style={styles.saveBtnText}>{t('addAiCow', 'markAIDone')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", padding: 16, borderRadius: 20 },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cowIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" },
  cowId: { fontWeight: "bold", fontSize: 16 },
  sectionTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  infoContainer: { flex: 1, marginHorizontal: 5 },
  infoLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  infoValueBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 14,
    padding: 12,
  },
  infoValue: { fontWeight: "bold" },
  aiCard: {
    backgroundColor: "#16A34A",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aiLabel: { color: "white", fontWeight: "bold" },
  aiValue: { color: "white", fontSize: 16 },
  progressBg: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: 10, backgroundColor: "#16A34A" },
  successBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 12,
    marginRight: 6,
    alignItems: "center",
  },
  dangerBtn: {
    flex: 1,
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 12,
    marginLeft: 6,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
saveBtnText: { color: "white", fontWeight: "bold" },
cowImage: {
  width: 24,
  height: 24,
},
});