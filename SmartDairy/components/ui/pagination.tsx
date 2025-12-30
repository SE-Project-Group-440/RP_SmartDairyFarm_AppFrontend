import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react-native";

type PaginationProps = {
  style?: any;
  children: React.ReactNode;
};

export function Pagination({ style, children }: PaginationProps) {
  return (
    <View style={[styles.pagination, style]}>
      {children}
    </View>
  );
}

export function PaginationContent({ style, children }: PaginationProps) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

type PaginationLinkProps = {
  isActive?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

export function PaginationLink({
  isActive,
  onPress,
  children,
}: PaginationLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        isActive && styles.linkActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.linkText, isActive && styles.linkTextActive]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function PaginationPrevious({
  onPress,
}: {
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.navButton}>
      <ChevronLeft size={18} />
      <Text style={styles.navText}>Previous</Text>
    </Pressable>
  );
}

export function PaginationNext({
  onPress,
}: {
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.navButton}>
      <Text style={styles.navText}>Next</Text>
      <ChevronRight size={18} />
    </Pressable>
  );
}

export function PaginationEllipsis() {
  return (
    <View style={styles.ellipsis}>
      <MoreHorizontal size={18} />
    </View>
  );
}
const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  item: {
    marginHorizontal: 2,
  },
  link: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  linkActive: {
    borderWidth: 1,
    borderColor: "#000",
  },
  linkText: {
    fontSize: 14,
  },
  linkTextActive: {
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.6,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    height: 36,
  },
  navText: {
    fontSize: 14,
  },
  ellipsis: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
