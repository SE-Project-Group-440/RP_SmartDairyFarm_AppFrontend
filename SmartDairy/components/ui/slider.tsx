import * as React from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  Animated,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type SliderProps = {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  style?: any;
};

/* -------------------------------------------------------------------------- */
/* Utils */
/* -------------------------------------------------------------------------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* -------------------------------------------------------------------------- */
/* Slider */
/* -------------------------------------------------------------------------- */

export function Slider({
  value,
  defaultValue = [0],
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled,
  style,
}: SliderProps) {
  const isControlled = value !== undefined;

  const [internal, setInternal] = React.useState(defaultValue);
  const values = isControlled ? value! : internal;

  // ✅ Store percent values in state (NOT Animated.Value)
  const [percents, setPercents] = React.useState<number[]>(
    values.map((v) => (v - min) / (max - min)),
  );

  const trackWidth = React.useRef(0);
  const thumbs = React.useRef(
    percents.map((p) => new Animated.Value(p)),
  ).current;

  // Sync animated thumbs when values change
  React.useEffect(() => {
    const nextPercents = values.map(
      (v) => (v - min) / (max - min),
    );
    setPercents(nextPercents);
    nextPercents.forEach((p, i) => thumbs[i].setValue(p));
  }, [values, min, max]);

  const updateValue = (index: number, percent: number) => {
    const raw = min + percent * (max - min);
    const stepped = Math.round(raw / step) * step;

    const nextValues = [...values];
    nextValues[index] = clamp(stepped, min, max);

    // Prevent crossing for range sliders
    if (nextValues.length === 2) {
      if (index === 0)
        nextValues[0] = Math.min(nextValues[0], nextValues[1]);
      if (index === 1)
        nextValues[1] = Math.max(nextValues[1], nextValues[0]);
    }

    const nextPercents = nextValues.map(
      (v) => (v - min) / (max - min),
    );

    if (!isControlled) setInternal(nextValues);
    setPercents(nextPercents);
    onValueChange?.(nextValues);
  };

  const createPan = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (_, g) => {
        const delta = g.dx / trackWidth.current;
        const percent = clamp(
          percents[index] + delta,
          0,
          1,
        );
        thumbs[index].setValue(percent);
        updateValue(index, percent);
      },
    });

  return (
    <View
      style={[styles.root, style, disabled && styles.disabled]}
      onLayout={(e: LayoutChangeEvent) => {
        trackWidth.current = e.nativeEvent.layout.width;
      }}
    >
      {/* Track */}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.range,
            values.length === 1
              ? {
                  width: thumbs[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                }
              : {
                  left: thumbs[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  width: Animated.subtract(
                    thumbs[1],
                    thumbs[0],
                  ).interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
          ]}
        />
      </View>

      {/* Thumbs */}
      {thumbs.map((anim, index) => {
        const pan = createPan(index);
        return (
          <Animated.View
            key={index}
            {...pan.panHandlers}
            style={[
              styles.thumb,
              {
                transform: [
                  {
                    translateX: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, trackWidth.current],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    height: 32,
    justifyContent: "center",
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e5e5e5",
    overflow: "hidden",
  },
  range: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#000",
  },
  thumb: {
    position: "absolute",
    top: "50%",
    width: 16,
    height: 16,
    marginTop: -8,
    marginLeft: -8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  disabled: {
    opacity: 0.5,
  },
});
