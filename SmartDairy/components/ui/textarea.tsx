import * as React from "react";
import {
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type TextareaProps = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

/* -------------------------------------------------------------------------- */
/* Textarea */
/* -------------------------------------------------------------------------- */

export function Textarea({
  value,
  defaultValue,
  onChangeText,
  placeholder,
  editable = true,
  numberOfLines = 4,
  style,
}: TextareaProps) {
  return (
    <TextInput
      multiline
      value={value}
      defaultValue={defaultValue}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={editable}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      style={[
        styles.textarea,
        !editable && styles.disabled,
        style,
      ]}
    />
  );
}
const styles = StyleSheet.create({
  textarea: {
    minHeight: 64,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    borderColor: "#d4d4d4",
  },
  disabled: {
    opacity: 0.5,
  },
});
