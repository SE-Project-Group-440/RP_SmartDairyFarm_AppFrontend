import * as React from "react";
import {
  Pressable,
  View,
  StyleSheet,
  AccessibilityProps,
} from "react-native";
import { Check } from "lucide-react-native";

type CheckboxProps = {
  value?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
  onValueChange?: (checked: boolean) => void;
} & AccessibilityProps;

export function Checkbox({
  value,
  defaultValue = false,
  disabled = false,
  onValueChange,
  accessibilityLabel,
}: CheckboxProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const checked = value ?? internalValue;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      style={[
        styles.base,
        checked && styles.checked,
        disabled && styles.disabled,
      ]}
    >
      {checked && <Check size={14} color="#ffffff" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#cbd5f5", // slate-300
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#10b981", // green-500
    borderColor: "#10b981",
  },
  disabled: {
    opacity: 0.5,
  },
});
