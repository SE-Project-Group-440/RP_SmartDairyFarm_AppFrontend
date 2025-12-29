import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
} from "react-native";

interface AvatarProps {
  size?: number; // default 40
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Avatar({
  size = 40,
  style,
  children,
}: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface AvatarImageProps {
  source: ImageSourcePropType;
}

export function AvatarImage({ source }: AvatarImageProps) {
  return (
    <Image
      source={source}
      style={styles.image}
      resizeMode="cover"
    />
  );
}

interface AvatarFallbackProps {
  label?: string; // initials or emoji
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AvatarFallback({
  label = "?",
  style,
  textStyle,
}: AvatarFallbackProps) {
  return (
    <View style={[styles.fallback, style]}>
      <Text style={[styles.fallbackText, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    backgroundColor: "#e5e7eb", // muted bg
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
});
