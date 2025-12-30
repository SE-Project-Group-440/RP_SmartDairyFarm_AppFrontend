import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  variant = "default",
  label,
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      <Text style={[styles.text, textVariantStyles[variant], textStyle]}>
        {label}
      </Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

const variantStyles: Record<BadgeVariant, ViewStyle> = {
  default: {
    backgroundColor: "#16a34a", // green-600
    borderColor: "transparent",
  },
  secondary: {
    backgroundColor: "#e5e7eb", // gray-200
    borderColor: "transparent",
  },
  destructive: {
    backgroundColor: "#dc2626", // red-600
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#cbd5f5",
  },
};

const textVariantStyles: Record<BadgeVariant, TextStyle> = {
  default: {
    color: "#ffffff",
  },
  secondary: {
    color: "#111827",
  },
  destructive: {
    color: "#ffffff",
  },
  outline: {
    color: "#0f172a",
  },
};
