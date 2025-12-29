import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";

/* =========================
   Root
========================= */

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({
  open,
  onOpenChange,
  children,
}: AlertDialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

/* =========================
   Header / Footer
========================= */

export function AlertDialogHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.header}>{children}</View>;
}

export function AlertDialogFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.footer}>{children}</View>;
}

/* =========================
   Title & Description
========================= */

export function AlertDialogTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.title}>{children}</Text>;
}

export function AlertDialogDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.description}>{children}</Text>;
}

/* =========================
   Buttons
========================= */

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

export function AlertDialogAction({
  onPress,
  children,
}: ButtonProps) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionText}>{children}</Text>
    </Pressable>
  );
}

export function AlertDialogCancel({
  onPress,
  children,
}: ButtonProps) {
  return (
    <Pressable style={styles.cancelButton} onPress={onPress}>
      <Text style={styles.cancelText}>{children}</Text>
    </Pressable>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#cbd5f5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelText: {
    color: "#0f172a",
    fontWeight: "500",
  },
});
