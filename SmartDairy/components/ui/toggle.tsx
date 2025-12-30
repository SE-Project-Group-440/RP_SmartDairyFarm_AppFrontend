import * as React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type ToggleVariant = "default" | "outline";
type ToggleSize = "sm" | "default" | "lg";

type ToggleProps = {
  pressed?: boolean;                 // controlled
  defaultPressed?: boolean;          // uncontrolled
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

/* -------------------------------------------------------------------------- */
/* Toggle */
/* -------------------------------------------------------------------------- */

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  variant = "default",
  size = "default",
  disabled,
  children,
  style,
  textStyle,
}: ToggleProps) {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = React.useState(defaultPressed);
  const isOn = isControlled ? pressed! : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  };

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={[
        styles.base,
        stylesByVariant(variant),
        stylesBySize(size),
        isOn && styles.on,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isOn && styles.textOn,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 6,
  },
  on: {
    backgroundColor: "#e5e5e5",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  textOn: {
    color: "#000",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});

/* -------------------------------------------------------------------------- */
/* Variant Styles */
/* -------------------------------------------------------------------------- */

const stylesByVariant = (variant: ToggleVariant): ViewStyle => {
  switch (variant) {
    case "outline":
      return {
        borderWidth: 1,
        borderColor: "#d4d4d4",
        backgroundColor: "transparent",
      };
    default:
      return {
        backgroundColor: "transparent",
      };
  }
};

/* -------------------------------------------------------------------------- */
/* Size Styles */
/* -------------------------------------------------------------------------- */

const stylesBySize = (size: ToggleSize): ViewStyle => {
  switch (size) {
    case "sm":
      return {
        height: 32,
        paddingHorizontal: 8,
        minWidth: 32,
      };
    case "lg":
      return {
        height: 40,
        paddingHorizontal: 12,
        minWidth: 40,
      };
    default:
      return {
        height: 36,
        paddingHorizontal: 10,
        minWidth: 36,
      };
  }
};
