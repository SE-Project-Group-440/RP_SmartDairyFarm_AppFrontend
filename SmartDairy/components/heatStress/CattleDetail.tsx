import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import type { Cattle } from '../../app/(tabs)/cattleHeat/Screens/CattleListScreen';
import { CattleBody3D } from './CattleBody3D';
import {
  getSprinklerStatus,
  setAutoMode,
  setManualMode
} from "../../services/cattleHeatApi";

interface CattleDetailProps {
  cattle: Cattle;
  onBack: () => void;
  onStatusChange: (id: string, status: 'active' | 'inactive') => void;
}


export function CattleDetail({ cattle, onBack }: CattleDetailProps) {

  const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [sprinklerOn, setSprinklerOn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch sprinkler status from backend
  useEffect(() => {
    fetchStatus();
  }, [cattle.id]);

  const fetchStatus = async () => {
  try {
    setLoading(true);
    const data = await getSprinklerStatus(cattle.id);

    setMode(data.mode);
    setSprinklerOn(data.state);

  } catch (err) {
    console.log("Failed to fetch sprinkler status");
  } finally {
    setLoading(false);
  }
};

  const handleAutoMode = async () => {
    try {
      await setAutoMode(cattle.id);
      setMode("AUTO");
    } catch (err) {
      console.log("Failed AUTO mode");
    }
  };

  const handleManualMode = async () => {
    try {
      await setManualMode(cattle.id, sprinklerOn);
      setMode("MANUAL");
    } catch (err) {
      console.log("Failed MANUAL mode");
    }
  };

  const handleToggleWater = async () => {
    const newState = !sprinklerOn;

    try {
      const data = await setManualMode(cattle.id, newState);
      setSprinklerOn(data.state);
    } catch (err) {
      console.log("Toggle failed");
    }
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'Low': return '#22c55e';
      case 'Moderate': return '#eab308';
      case 'High': return '#f97316';
      case 'Critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStressWidth = (level: string) => {
    switch (level) {
      case 'Low': return '25%';
      case 'Moderate': return '50%';
      case 'High': return '75%';
      case 'Critical': return '100%';
      default: return '0%';
    }
  };

  const getStressMessage = (level: string) => {
    switch (level) {
      case 'Low': return 'No action needed';
      case 'Moderate': return 'Monitor closely';
      case 'High': return 'Intervention recommended';
      case 'Critical': return 'Immediate action required';
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{cattle.id}</Text>
                <Text style={styles.headerSubtitle}>Heat Stress Details</Text>
              </View>
            </View>

            {/* AUTO Message */}
            {mode === "AUTO" && (
              <View style={styles.autoAlertBox}>
                <Text style={styles.autoAlertText}>
                  Sprinkler is automatically controlled by prediction system.
                </Text>
              </View>
            )}

            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Sprinkler System</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: sprinklerOn ? '#86efac' : '#d1d5db' }
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: sprinklerOn ? '#166534' : '#374151' }
                ]}>
                  {sprinklerOn ? 'Running' : 'Stopped'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Heat Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cattlle Heat Stress</Text>
            <CattleBody3D thiIndex={cattle.thi} stressLevel={cattle.stressLevel} />
            <View style={styles.tempDisplay}>
              <Text style={styles.tempValue}>{cattle.envTemp}°C</Text>
              <Text style={styles.tempLabel}>Current Body Temperature</Text>
            </View>
          </View>

          {/* Stress Level */}
          <View style={styles.card}>
            <View style={styles.stressHeader}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.cardTitle}>Stress Level</Text>
            </View>

            <View style={styles.stressRow}>
              <Text style={[styles.stressLevel, { color: getStressColor(cattle.stressLevel) }]}>
                {cattle.stressLevel}
              </Text>
              <Text style={styles.stressMessage}>
                {getStressMessage(cattle.stressLevel)}
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={{
                  height: '100%',
                  width: getStressWidth(cattle.stressLevel),
                  backgroundColor: getStressColor(cattle.stressLevel),
                  borderRadius: 6
                }} />
              </View>
            </View>

            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Low</Text>
              <Text style={styles.progressLabel}>Moderate</Text>
              <Text style={styles.progressLabel}>High</Text>
              <Text style={styles.progressLabel}>Critical</Text>
            </View>
          </View>

          {/* 🔥 AUTO / MANUAL CONTROL */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sprinkler Control</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  { backgroundColor: mode === "AUTO" ? '#22c55e' : '#d1d5db', flex: 1 }
                ]}
                onPress={handleAutoMode}
              >
                <Text style={styles.toggleText}>AUTO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  { backgroundColor: mode === "MANUAL" ? '#22c55e' : '#d1d5db', flex: 1 }
                ]}
                onPress={handleManualMode}
              >
                <Text style={styles.toggleText}>MANUAL</Text>
              </TouchableOpacity>
            </View>

            {mode === "MANUAL" && (
              <>
                <TouchableOpacity
                  onPress={handleToggleWater}
                  style={[
                    styles.toggleButton,
                    { backgroundColor: sprinklerOn ? '#ef4444' : '#22c55e' }
                  ]}
                >
                  <Text style={styles.toggleText}>
                    {sprinklerOn ? 'Stop Water Flow' : 'Start Water Flow'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.toggleHint}>
                  {sprinklerOn
                    ? 'Click to stop sprinkler system'
                    : 'Click to activate sprinkler system'}
                </Text>
              </>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    maxWidth: 390,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    backgroundColor: '#22c55e',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bbf7d0',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  autoAlertBox: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  autoAlertText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  tempDisplay: {
    alignItems: 'center',
    marginTop: 16,
  },
  tempValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1f2937',
  },
  tempLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  envCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  envCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  envIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envIcon: {
    fontSize: 20,
  },
  envLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  envValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  envStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  stressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  stressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stressLevel: {
    fontSize: 20,
    fontWeight: '600',
  },
  stressMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  toggleButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  toggleHint: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  }
});
