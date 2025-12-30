"use client";

import React from "react";
import { StyleProp, TextStyle } from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";


/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type IconSymbolProps = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
};

/* ---------------------------------- */
/* IconSymbol */
/* ---------------------------------- */

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  return (
    <MaterialIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}
