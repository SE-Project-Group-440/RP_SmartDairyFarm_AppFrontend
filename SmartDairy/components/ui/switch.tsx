import * as React from "react";
import { Pressable, View, StyleSheet, Animated } from "react-native";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type SwitchProps = {
  value?: boolean;                 // controlled
  defaultValue?: boolean;          // uncontrolled
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: any;
};

/* -------------------------------------------------------------------------- */
/* Switch */
/* -------------------------------------------------------------------------- */

export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled,
  style,
}: SwitchProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const checked = isControlled ? value! : internal;

  const translateX = React.useRef(new Animated.Value(checked ? 14 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: checked ? 14 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={[
        styles.root,
        checked && styles.checked,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  root: {
    width: 32,
    height: 18,
    borderRadius: 999,
    padding: 2,
    backgroundColor: "#d4d4d4",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#000",
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  disabled: {
    opacity: 0.5,
  },
});
