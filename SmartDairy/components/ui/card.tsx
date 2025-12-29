import * as React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

/* =========================
   Card
========================= */
export function Card({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[styles.card, style]}
    />
  );
}

/* =========================
   CardHeader
========================= */
export function CardHeader({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[styles.header, style]}
    />
  );
}

/* =========================
   CardTitle
========================= */
export function CardTitle({ style, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[styles.title, style]}
    />
  );
}

/* =========================
   CardDescription
========================= */
export function CardDescription({ style, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[styles.description, style]}
    />
  );
}

/* =========================
   CardAction
========================= */
export function CardAction({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[styles.action, style]}
    />
  );
}

/* =========================
   CardContent
========================= */
export function CardContent({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[styles.content, style]}
    />
  );
}

/* =========================
   CardFooter
========================= */
export function CardFooter({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[styles.footer, style]}
    />
  );
}

/* =========================
   Styles
========================= */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },

  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
  },

  action: {
    marginLeft: 12,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
