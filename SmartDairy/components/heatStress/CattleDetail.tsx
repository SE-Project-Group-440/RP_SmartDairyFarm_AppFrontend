import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Cattle } from '../../app/(tabs)/cattleHeat/Screens/CattleListScreen';
import { CattleBody3D } from './CattleBody3D';

interface CattleDetailProps {
  cattle: Cattle;
  onBack: () => void;
  onStatusChange: (id: number, status: 'active' | 'inactive') => void;
}

export function CattleDetail({ cattle, onBack, onStatusChange }: CattleDetailProps) {
  const [collarStatus, setCollarStatus] = useState<'active' | 'inactive'>(cattle.collarStatus);
  const [sprinklerOn, setSprinklerOn] = useState<boolean>(false);

  useEffect(() => {
    // Auto start sprinkler when stress is High or Critical
    if (cattle.stressLevel === 'High' || cattle.stressLevel === 'Critical') {
      setSprinklerOn(true);
      setCollarStatus('inactive'); // button becomes STOP mode
    } else {
      setSprinklerOn(false);
    }
  }, [cattle.stressLevel]);

  const handleToggle = () => {
    const newStatus = collarStatus === 'active' ? 'inactive' : 'active';
    setCollarStatus(newStatus);
    setSprinklerOn(newStatus === 'inactive'); // turn on if STOP is shown
    onStatusChange(cattle.id, newStatus);
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
                <Text style={styles.headerTitle}>{cattle.name}</Text>
                <Text style={styles.headerSubtitle}>Heat Stress Details</Text>
              </View>
            </View>

            {/* Sprinkler Auto Alert */}
            {sprinklerOn && (
              <View style={styles.autoAlertBox}>
                <Text style={styles.autoAlertText}>Sprinkler Activated Automatically due to High Stress!</Text>
              </View>
            )}

            {/* Status Badge */}
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
          {/* 3D Cattle Body Map */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Body Temperature Map</Text>
            <CattleBody3D temperature={cattle.bodyTemp} stressLevel={cattle.stressLevel} />
            <View style={styles.tempDisplay}>
              <Text style={styles.tempValue}>{cattle.bodyTemp}°C</Text>
              <Text style={styles.tempLabel}>Current Body Temperature</Text>
            </View>
          </View>

          {/* Environmental Conditions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Environmental Conditions</Text>
            <View style={[styles.envCard, { backgroundColor: '#fed7aa' }]}>
              <View style={styles.envCardContent}>
                <View style={[styles.envIconContainer, { backgroundColor: '#f97316' }]}>
                  <Text style={styles.envIcon}>🌡️</Text>
                </View>
                <View>
                  <Text style={styles.envLabel}>Temperature</Text>
                  <Text style={styles.envValue}>{cattle.envTemp}°C</Text>
                </View>
              </View>
              <Text style={[styles.envStatus, { color: '#c2410c' }]}>
                {cattle.envTemp > 35 ? 'Very High' : cattle.envTemp > 30 ? 'High' : 'Normal'}
              </Text>
            </View>

            <View style={[styles.envCard, { backgroundColor: '#dbeafe' }]}>
              <View style={styles.envCardContent}>
                <View style={[styles.envIconContainer, { backgroundColor: '#3b82f6' }]}>
                  <Text style={styles.envIcon}>💧</Text>
                </View>
                <View>
                  <Text style={styles.envLabel}>Humidity</Text>
                  <Text style={styles.envValue}>{cattle.humidity}%</Text>
                </View>
              </View>
              <Text style={[styles.envStatus, { color: '#2563eb' }]}>
                {cattle.humidity > 80 ? 'Very High' : cattle.humidity > 70 ? 'High' : 'Normal'}
              </Text>
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

          {/* Water Flow Control */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Water Flow Control</Text>
            <TouchableOpacity
              onPress={handleToggle}
              style={[
                styles.toggleButton,
                { backgroundColor: sprinklerOn ? '#ef4444' : '#22c55e' }
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleText}>
                {sprinklerOn ? 'Stop Water Flow' : 'Start Water Flow'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.toggleHint}>
              {sprinklerOn ? 'Click to stop sprinkler system' : 'Click to activate sprinkler system'}
            </Text>
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
