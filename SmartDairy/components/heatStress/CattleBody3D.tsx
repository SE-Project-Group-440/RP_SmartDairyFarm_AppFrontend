import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';
import { useTranslations } from "@/hooks/useTranslations";

interface CattleBody3DProps {
  thiIndex: number;
  stressLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export function CattleBody3D({ thiIndex, stressLevel }: CattleBody3DProps) {

  const { t } = useTranslations();

  // 🔥 THI-based color logic (structure unchanged)
  const getHeatColor = (thi: number) => {
    if (thi >= 88) return '#dc2626'; 
    if (thi >= 79) return '#f97316'; 
    if (thi >= 72) return '#eab308'; 
    return '#22c55e';               
  };

  const getHeatColorRGB = (thi: number) => {
    if (thi >= 88) return { r: 220, g: 38, b: 38 };
    if (thi >= 79) return { r: 249, g: 115, b: 22 };
    if (thi >= 72) return { r: 234, g: 179, b: 8 };
    return { r: 34, g: 197, b: 94 };
  };

  const color = getHeatColor(thiIndex);
  const colorRGB = getHeatColorRGB(thiIndex);

  const darkerColor = `rgb(
    ${Math.max(0, colorRGB.r - 60)},
    ${Math.max(0, colorRGB.g - 60)},
    ${Math.max(0, colorRGB.b - 60)}
  )`;

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width="100%" height="200" viewBox="0 0 300 200">
          <Defs>
            <RadialGradient id="bodyGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor={color} stopOpacity="1" />
              <Stop offset="70%" stopColor={color} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={darkerColor} stopOpacity="0.8" />
            </RadialGradient>
            <RadialGradient id="headGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={darkerColor} stopOpacity="0.8" />
            </RadialGradient>
          </Defs>

          {/* Shadow */}
          <Ellipse cx="150" cy="180" rx="100" ry="15" fill="rgba(0,0,0,0.1)" />

          {/* Tail */}
          <Path
            d="M 220 100 Q 240 90, 235 110"
            stroke={darkerColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Back legs */}
          <Path d="M 180 130 L 180 165" stroke={darkerColor} strokeWidth="12" strokeLinecap="round" />
          <Path d="M 200 130 L 200 165" stroke={darkerColor} strokeWidth="12" strokeLinecap="round" />

          {/* Body */}
          <Ellipse cx="150" cy="100" rx="70" ry="50" fill="url(#bodyGradient)" />

          {/* Front legs */}
          <Path d="M 110 130 L 110 165" stroke={darkerColor} strokeWidth="12" strokeLinecap="round" />
          <Path d="M 130 130 L 130 165" stroke={darkerColor} strokeWidth="12" strokeLinecap="round" />

          {/* Head */}
          <Ellipse cx="90" cy="80" rx="28" ry="25" fill="url(#headGradient)" />

          {/* Ears */}
          <Ellipse cx="75" cy="65" rx="8" ry="15" fill={darkerColor} transform="rotate(-20, 75, 65)" />
          <Ellipse cx="105" cy="65" rx="8" ry="15" fill={darkerColor} transform="rotate(20, 105, 65)" />

          {/* Eyes */}
          <Circle cx="80" cy="75" r="3" fill="#1f2937" />
          <Circle cx="100" cy="75" r="3" fill="#1f2937" />

          {/* Nose */}
          <Ellipse cx="90" cy="88" rx="8" ry="6" fill={darkerColor} />

          {/* 🔥 Hotspot only for High & Severe THI */}
          {thiIndex >= 79 && (
            <Circle
              cx="150"
              cy="95"
              r="25"
              fill="rgba(239, 68, 68, 0.3)"
            />
          )}
        </Svg>

        {/* Temperature display */}
        <View style={styles.tempOverlay}>
          <Text style={styles.tempText}>THI - {thiIndex}</Text>
        </View>
      </View>

      <View style={styles.labelContainer}>
        <View style={styles.label}>
          <Text style={styles.labelText}>
            {t('cattleHeat', 'heatMapView')}
          </Text>
        </View>
      </View>

      {/* Color Legend (unchanged) */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>
            {t('cattleHeat', 'low')}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
          <Text style={styles.legendText}>
            {t('cattleHeat', 'moderate')}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
          <Text style={styles.legendText}>
            {t('cattleHeat', 'high')}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
          <Text style={styles.legendText}>
            {t('cattleHeat', 'critical')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  svgContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  tempText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelContainer: { position: 'absolute', top: 8, right: 8 },
  label: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  labelText: { fontSize: 10, color: '#6b7280' },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#6b7280' },
});