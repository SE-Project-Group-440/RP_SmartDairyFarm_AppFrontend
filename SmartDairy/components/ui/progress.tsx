import * as React from "react";
import { View, StyleSheet, Animated } from "react-native";

type ProgressProps = {
  value?: number; // 0 → 100
  height?: number;
  backgroundColor?: string;
  indicatorColor?: string;
};

export function Progress({
  value = 0,
  height = 8,
  backgroundColor = "rgba(0,0,0,0.15)",
  indicatorColor = "#000",
}: ProgressProps) {
  const progress = React.useRef(new Animated.Value(value)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: Math.min(100, Math.max(0, value)),
      duration: 200,
      useNativeDriver: false, // width animation
    }).start();
  }, [value]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.root,
        {
          height,
          backgroundColor,
          borderRadius: height / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            width,
            backgroundColor: indicatorColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
  },
});
