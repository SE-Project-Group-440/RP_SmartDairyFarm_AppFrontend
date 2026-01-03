import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

interface CattleBody3DProps {
  temperature: number;
  stressLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export function CattleBody3D({ temperature, stressLevel }: CattleBody3DProps) {
  const getHeatColor = (temp: number) => {
    const normalTemp = 38.5;
    const diff = temp - normalTemp;
    
    if (diff > 3) return '#dc2626'; // Critical - Red
    if (diff > 2) return '#f97316'; // High - Orange
    if (diff > 1) return '#eab308'; // Moderate - Yellow
    return '#22c55e'; // Low - Green
  };

  const getHeatColorRGB = (temp: number) => {
    const normalTemp = 38.5;
    const diff = temp - normalTemp;
    
    if (diff > 3) return { r: 220, g: 38, b: 38 };
    if (diff > 2) return { r: 249, g: 115, b: 22 };
    if (diff > 1) return { r: 234, g: 179, b: 8 };
    return { r: 34, g: 197, b: 94 };
  };

  const color = getHeatColor(temperature);
  const colorRGB = getHeatColorRGB(temperature);
  const darkerColor = `rgb(${Math.max(0, colorRGB.r - 60)}, ${Math.max(0, colorRGB.g - 60)}, ${Math.max(0, colorRGB.b - 60)})`;

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
          <Ellipse
            cx="150"
            cy="180"
            rx="100"
            ry="15"
            fill="rgba(0,0,0,0.1)"
          />

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

          {/* Body (main torso) */}
          <Ellipse
            cx="150"
            cy="100"
            rx="70"
            ry="50"
            fill="url(#bodyGradient)"
          />

          {/* Front legs */}
          <Path d="M 110 130 L 110 165" stroke={darkerColor} strokeWidth="12" strokeLinecap="round" />
          <Path d="M 130 130 L 130 165" stroke={darkerColor} strokeWidth="12" strokeLinecap="round" />

          {/* Head */}
          <Ellipse
            cx="90"
            cy="80"
            rx="28"
            ry="25"
            fill="url(#headGradient)"
          />

          {/* Ears */}
          <Ellipse
            cx="75"
            cy="65"
            rx="8"
            ry="15"
            fill={darkerColor}
            transform="rotate(-20, 75, 65)"
          />
          <Ellipse
            cx="105"
            cy="65"
            rx="8"
            ry="15"
            fill={darkerColor}
            transform="rotate(20, 105, 65)"
          />

          {/* Eyes */}
          <Circle cx="80" cy="75" r="3" fill="#1f2937" />
          <Circle cx="100" cy="75" r="3" fill="#1f2937" />

          {/* Nose */}
          <Ellipse cx="90" cy="88" rx="8" ry="6" fill={darkerColor} />

          {/* Temperature hotspot indicator */}
          {temperature > 39 && (
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
          <Text style={styles.tempText}>{temperature}°C</Text>
        </View>
      </View>

      <View style={styles.labelContainer}>
        <View style={styles.label}>
          <Text style={styles.labelText}>Heat Map View</Text>
        </View>
      </View>

      {/* Color Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>Normal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
          <Text style={styles.legendText}>Elevated</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
          <Text style={styles.legendText}>Critical</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  svgContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  label: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  labelText: {
    fontSize: 10,
    color: '#6b7280',
  },
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
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#6b7280',
  },
});
