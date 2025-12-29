"use client";

import * as React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

/* ---------------------------------- */
/* Input */
/* ---------------------------------- */

type InputProps = TextInputProps & {
  error?: boolean;
};

function Input({
  style,
  error,
  editable = true,
  ...props
}: InputProps) {
  return (
    <TextInput
      editable={editable}
      style={[
        styles.input,
        !editable && styles.disabled,
        error && styles.error,
        style,
      ]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  input: {
    height: 36,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#111827",
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    borderColor: "#dc2626",
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export { Input };
