import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface AspectRatioProps {
  /**
   * Width / Height
   * Example:
   * 16 / 9 → widescreen
   * 1 / 1 → square
   */
  ratio: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AspectRatio({
  ratio,
  children,
  style,
}: AspectRatioProps) {
  return (
    <View style={[styles.container, { aspectRatio: ratio }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
