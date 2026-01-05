import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Cattle } from '../../app/(tabs)/cattleHeat/Screens/CattleListScreen';

interface CattleListProps {
  cattleData: Cattle[];
  onSelectCattle: (cattle: Cattle) => void;
}

export function CattleList({ cattleData, onSelectCattle }: CattleListProps) {
  const totalCattle = cattleData.length;
  const highStressCattle = cattleData.filter(c => 
    c.stressLevel === 'High' || c.stressLevel === 'Critical'
  ).length;

  const getStressColors = (level: string) => {
    switch (level) {
      case 'Low':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'Moderate':
        return { bg: '#fef3c7', text: '#a16207' };
      case 'High':
        return { bg: '#fed7aa', text: '#c2410c' };
      case 'Critical':
        return { bg: '#fecaca', text: '#dc2626' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>Good Evening</Text>
              <Text style={styles.moonIcon}>🌙</Text>
              <Text style={styles.greetingText}>Manujaya</Text>
            </View>
            <Text style={styles.subHeaderText}>Dairy Farm Management</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Heat Stress Monitoring</Text>
          
          <View style={styles.grid}>
            {cattleData.map((cattle) => {
              const colors = getStressColors(cattle.stressLevel);
              return (
                <TouchableOpacity
                  key={cattle.id}
                  onPress={() => onSelectCattle(cattle)}
                  style={styles.card}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardContent}>
                    {/* Cattle Icon */}
                    <View style={styles.cattleIcon}>
                      <Text style={styles.cattleIconText}>🐄</Text>
                    </View>
                    
                    {/* Cattle Name */}
                    <Text style={styles.cattleName}>{cattle.name}</Text>
                    
                    {/* Temperature */}
                    <Text style={styles.temperature}>{cattle.bodyTemp}°C</Text>
                    
                    {/* Stress Level Badge */}
                    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.badgeText, { color: colors.text }]}>
                        {cattle.stressLevel}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    gap: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  moonIcon: {
    fontSize: 20,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#bbf7d0',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  statValueOrange: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f97316',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  cattleIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#22c55e',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cattleIconText: {
    fontSize: 32,
  },
  cattleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  temperature: {
    fontSize: 14,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
