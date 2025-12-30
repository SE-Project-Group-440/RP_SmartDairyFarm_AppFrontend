"use client";

import * as React from "react";
import {
  Text,
  StyleSheet,
  TextProps,
} from "react-native";

/* ---------------------------------- */
/* Label */
/* ---------------------------------- */

type LabelProps = TextProps & {
  disabled?: boolean;
};

function Label({
  style,
  disabled,
  ...props
}: LabelProps) {
  return (
    <Text
      {...props}
      style={[
        styles.label,
        disabled && styles.disabled,
        style,
      ]}
    />
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  disabled: {
    opacity: 0.5,
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export { Label };
