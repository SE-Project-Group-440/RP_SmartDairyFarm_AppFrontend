import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

interface BreadcrumbProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface BreadcrumbLinkProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
  style?: TextStyle;
}

interface BreadcrumbSeparatorProps {
  style?: ViewStyle;
}

interface BreadcrumbEllipsisProps {
  style?: ViewStyle;
}

/* ------------------------------------------------------------------ */
/* COMPONENTS */
/* ------------------------------------------------------------------ */

export function Breadcrumb({ children, style }: BreadcrumbProps) {
  return (
   <View
  accessibilityRole="header"
  accessibilityLabel="Breadcrumb"
  style={[styles.container, style]}
>

      {children}
    </View>
  );
}

export function BreadcrumbList({ children }: BreadcrumbProps) {
  return <View style={styles.list}>{children}</View>;
}

export function BreadcrumbItem({ children, style }: BreadcrumbItemProps) {
  return <View style={[styles.item, style]}>{children}</View>;
}

export function BreadcrumbLink({
  label,
  onPress,
  active = false,
  style,
}: BreadcrumbLinkProps) {
  if (active) {
    return (
      <Text style={[styles.pageText, style]} accessibilityState={{ disabled: true }}>
        {label}
      </Text>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.linkText, style]}>{label}</Text>
    </Pressable>
  );
}

export function BreadcrumbSeparator({ style }: BreadcrumbSeparatorProps) {
  return (
    <View style={[styles.separator, style]}>
      <ChevronRight size={14} color="#94a3b8" />
    </View>
  );
}

export function BreadcrumbEllipsis({ style }: BreadcrumbEllipsisProps) {
  return (
    <View
      style={[styles.ellipsis, style]}
      accessibilityRole="text"
      accessibilityLabel="More breadcrumb items"
    >
      <MoreHorizontal size={16} color="#94a3b8" />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* STYLES */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    fontSize: 14,
    color: "#64748b", // slate-500
  },
  pageText: {
    fontSize: 14,
    color: "#0f172a", // slate-900
    fontWeight: "500",
  },
  separator: {
    alignItems: "center",
    justifyContent: "center",
  },
  ellipsis: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
