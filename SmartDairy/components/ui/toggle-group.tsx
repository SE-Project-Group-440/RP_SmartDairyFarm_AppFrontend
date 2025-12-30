import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type ToggleVariant = "default" | "outline";
type ToggleSize = "sm" | "default" | "lg";

type ToggleGroupContextType = {
  value: string[];
  toggleValue: (v: string) => void;
  variant: ToggleVariant;
  size: ToggleSize;
  multiple: boolean;
};

const ToggleGroupContext =
  React.createContext<ToggleGroupContextType | null>(null);

/* -------------------------------------------------------------------------- */
/* ToggleGroup */
/* -------------------------------------------------------------------------- */

type ToggleGroupProps = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type?: "single" | "multiple";
  variant?: ToggleVariant;
  size?: ToggleSize;
  children: React.ReactNode;
  style?: any;
};

export function ToggleGroup({
  value,
  defaultValue = [],
  onValueChange,
  type = "single",
  variant = "default",
  size = "default",
  children,
  style,
}: ToggleGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] =
    React.useState<string[]>(defaultValue);

  const values = isControlled ? value! : internal;
  const multiple = type === "multiple";

  const toggleValue = (v: string) => {
    let next: string[];

    if (multiple) {
      next = values.includes(v)
        ? values.filter((x) => x !== v)
        : [...values, v];
    } else {
      next = values.includes(v) ? [] : [v];
    }

    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <ToggleGroupContext.Provider
      value={{
        value: values,
        toggleValue,
        variant,
        size,
        multiple,
      }}
    >
      <View style={[styles.group, style]}>{children}</View>
    </ToggleGroupContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* ToggleGroupItem */
/* -------------------------------------------------------------------------- */

type ToggleGroupItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  style?: any;
};

export function ToggleGroupItem({
  value,
  children,
  disabled,
  style,
}: ToggleGroupItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx)
    throw new Error("ToggleGroupItem must be used within ToggleGroup");

  const active = ctx.value.includes(value);

  return (
    <Pressable
      disabled={disabled}
      onPress={() => ctx.toggleValue(value)}
      style={[
        styles.item,
        stylesByVariant(ctx.variant),
        stylesBySize(ctx.size),
        active && styles.active,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.textActive,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  active: {
    backgroundColor: "#000",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  textActive: {
    color: "#fff",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});

/* -------------------------------------------------------------------------- */
/* Variant Styles */
/* -------------------------------------------------------------------------- */

const stylesByVariant = (variant: "default" | "outline") => {
  switch (variant) {
    case "outline":
      return {
        backgroundColor: "#fff",
      };
    default:
      return {
        backgroundColor: "#f4f4f5",
      };
  }
};

/* -------------------------------------------------------------------------- */
/* Size Styles */
/* -------------------------------------------------------------------------- */

const stylesBySize = (size: "sm" | "default" | "lg") => {
  switch (size) {
    case "sm":
      return { paddingVertical: 4, paddingHorizontal: 8 };
    case "lg":
      return { paddingVertical: 10, paddingHorizontal: 16 };
    default:
      return { paddingVertical: 6, paddingHorizontal: 12 };
  }
};
