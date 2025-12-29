import * as React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

type ScrollAreaContextType = {
  scrollY: Animated.Value;
  viewportHeight: number;
  contentHeight: number;
};

const ScrollAreaContext =
  React.createContext<ScrollAreaContextType | null>(null);

/* -------------------------------------------------------------------------- */
/* ScrollArea */
/* -------------------------------------------------------------------------- */

type ScrollAreaProps = {
  children: React.ReactNode;
  style?: any;
};

export function ScrollArea({ children, style }: ScrollAreaProps) {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [viewportHeight, setViewportHeight] = React.useState(1);
  const [contentHeight, setContentHeight] = React.useState(1);

  return (
    <ScrollAreaContext.Provider
      value={{ scrollY, viewportHeight, contentHeight }}
    >
      <View style={[styles.root, style]}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onLayout={(e) =>
            setViewportHeight(e.nativeEvent.layout.height)
          }
          onContentSizeChange={(_, h) => setContentHeight(h)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          {children}
        </Animated.ScrollView>
        <ScrollBar orientation="vertical" />
      </View>
    </ScrollAreaContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* ScrollBar */
/* -------------------------------------------------------------------------- */

type ScrollBarProps = {
  orientation?: "vertical" | "horizontal";
  style?: any;
};

export function ScrollBar({
  orientation = "vertical",
  style,
}: ScrollBarProps) {
  const ctx = React.useContext(ScrollAreaContext);
  if (!ctx) return null;

  const { scrollY, viewportHeight, contentHeight } = ctx;

  if (contentHeight <= viewportHeight) return null;

  const thumbHeight =
    (viewportHeight / contentHeight) * viewportHeight;

  const maxTranslate =
    viewportHeight - thumbHeight;

  const translateY = scrollY.interpolate({
    inputRange: [0, contentHeight - viewportHeight],
    outputRange: [0, maxTranslate],
    extrapolate: "clamp",
  });

  if (orientation !== "vertical") return null;

  return (
    <View style={[styles.scrollbar, style]}>
      <Animated.View
        style={[
          styles.thumb,
          {
            height: thumbHeight,
            transform: [{ translateY }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flex: 1,
  },
  scrollbar: {
    position: "absolute",
    right: 2,
    top: 2,
    bottom: 2,
    width: 6,
    borderRadius: 3,
  },
  thumb: {
    width: "100%",
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});
