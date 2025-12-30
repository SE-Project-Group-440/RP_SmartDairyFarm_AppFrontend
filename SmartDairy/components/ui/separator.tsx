import * as React from "react";
import { View, StyleSheet } from "react-native";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean; // kept for API parity (RN doesn’t use it)
  thickness?: number;
  color?: string;
  style?: any;
};

export function Separator({
  orientation = "horizontal",
  decorative = true,
  thickness = StyleSheet.hairlineWidth,
  color = "#e5e5e5",
  style,
}: SeparatorProps) {
  return (
    <View
      style={[
        orientation === "horizontal"
          ? {
              height: thickness,
              width: "100%",
            }
          : {
              width: thickness,
              height: "100%",
            },
        { backgroundColor: color },
        style,
      ]}
    />
  );
}
