import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type AlertVariant = "default" | "destructive";

interface AlertProps {
  variant?: AlertVariant;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Alert({
  variant = "default",
  style,
  children,
}: AlertProps) {
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.base,
        variant === "destructive"
          ? styles.destructive
          : styles.default,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* =========================
   Alert Title
========================= */

interface AlertTitleProps {
  children: React.ReactNode;
}

export function AlertTitle({ children }: AlertTitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

/* =========================
   Alert Description
========================= */

interface AlertDescriptionProps {
  children: React.ReactNode;
}

export function AlertDescription({
  children,
}: AlertDescriptionProps) {
  return <Text style={styles.description}>{children}</Text>;
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  base: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },

  default: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },

  destructive: {
    backgroundColor: "#ffffff",
    borderColor: "#fecaca",
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  description: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
});
