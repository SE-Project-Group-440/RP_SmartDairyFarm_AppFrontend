import * as React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  PressableProps,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  variant = "default",
  size = "default",
  disabled,
  children,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {typeof children === "string" ? (
          <Text
            style={[
              styles.text,
              textVariantStyles[variant],
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  textDisabled: {
    opacity: 0.8,
  },
});

/* ================= VARIANTS ================= */

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: {
    backgroundColor: "#16a34a",
  },
  destructive: {
    backgroundColor: "#dc2626",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondary: {
    backgroundColor: "#e5e7eb",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
  },
};

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
  default: { color: "#ffffff" },
  destructive: { color: "#ffffff" },
  outline: { color: "#111827" },
  secondary: { color: "#111827" },
  ghost: { color: "#111827" },
  link: {
    color: "#16a34a",
    textDecorationLine: "underline",
  },
};

/* ================= SIZES ================= */

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: {
    height: 36,
    paddingHorizontal: 16,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  lg: {
    height: 40,
    paddingHorizontal: 24,
  },
  icon: {
    width: 36,
    height: 36,
  },
};
