import * as React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

// Enable layout animations on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RadioGroupContextType = {
  value?: string;
  setValue: (v: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

/* ---------------------------------- Group --------------------------------- */

type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  style?: any;
  children: React.ReactNode;
};

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
  style,
  children,
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);

  const currentValue = value ?? internal;

  const setValue = (v: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value: currentValue, setValue, disabled }}
    >
      <View style={[styles.group, style]}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

/* ----------------------------------- Item --------------------------------- */

type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
  style?: any;
};

export function RadioGroupItem({
  value,
  disabled,
  style,
}: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be inside RadioGroup");

  const isChecked = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => ctx.setValue(value)}
      style={({ pressed }) => [
        styles.item,
        isChecked && styles.itemChecked,
        isDisabled && styles.itemDisabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {isChecked && <View style={styles.indicator} />}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  item: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  itemChecked: {
    borderColor: "#000",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#000",
  },
  pressed: {
    opacity: 0.6,
  },
  itemDisabled: {
    opacity: 0.4,
  },
});
