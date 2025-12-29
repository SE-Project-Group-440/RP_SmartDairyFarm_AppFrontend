import * as React from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

type Direction = "horizontal" | "vertical";

type PanelGroupContextType = {
  direction: Direction;
  sizes: number[];
  setSizeAt: (index: number, delta: number) => void;
  containerSize: number;
};

const PanelGroupContext =
  React.createContext<PanelGroupContextType | null>(null);

/* -------------------------------------------------------------------------- */
/* Panel Group */
/* -------------------------------------------------------------------------- */

type ResizablePanelGroupProps = {
  direction?: Direction;
  children: React.ReactNode;
  style?: any;
};

export function ResizablePanelGroup({
  direction = "horizontal",
  children,
  style,
}: ResizablePanelGroupProps) {
  const childCount = React.Children.count(children);
  const [sizes, setSizes] = React.useState(
    Array(childCount).fill(1 / childCount),
  );
  const [containerSize, setContainerSize] = React.useState(0);

  const setSizeAt = (index: number, delta: number) => {
    setSizes((prev) => {
      const next = [...prev];
      const a = next[index];
      const b = next[index + 1];

      const deltaRatio = delta / containerSize;

      next[index] = Math.max(0.1, a + deltaRatio);
      next[index + 1] = Math.max(0.1, b - deltaRatio);

      const total = next.reduce((s, n) => s + n, 0);
      return next.map((n) => n / total);
    });
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize(direction === "horizontal" ? width : height);
  };

  return (
    <PanelGroupContext.Provider
      value={{ direction, sizes, setSizeAt, containerSize }}
    >
      <View
        onLayout={onLayout}
        style={[
          styles.group,
          direction === "vertical" && styles.vertical,
          style,
        ]}
      >
        {children}
      </View>
    </PanelGroupContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Panel */
/* -------------------------------------------------------------------------- */

type ResizablePanelProps = {
  index: number;
  children: React.ReactNode;
};

export function ResizablePanel({
  index,
  children,
}: ResizablePanelProps) {
  const ctx = React.useContext(PanelGroupContext);
  if (!ctx) throw new Error("ResizablePanel must be inside group");

  const size = ctx.sizes[index] ?? 0;

  return (
    <View
      style={{
        flex: size,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Resize Handle */
/* -------------------------------------------------------------------------- */

type ResizableHandleProps = {
  index: number;
  withHandle?: boolean;
};

export function ResizableHandle({
  index,
  withHandle,
}: ResizableHandleProps) {
  const ctx = React.useContext(PanelGroupContext);
  if (!ctx) throw new Error("ResizableHandle must be inside group");

  const isHorizontal = ctx.direction === "horizontal";

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const delta = isHorizontal ? g.dx : g.dy;
        ctx.setSizeAt(index, delta);
      },
    }),
  ).current;

  return (
    <View
      {...pan.panHandlers}
      style={[
        styles.handle,
        isHorizontal ? styles.handleVertical : styles.handleHorizontal,
      ]}
    >
      {withHandle && <View style={styles.grip} />}
    </View>
  );
}
const styles = StyleSheet.create({
  group: {
    flex: 1,
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  handle: {
    backgroundColor: "#e5e5e5",
    alignItems: "center",
    justifyContent: "center",
  },
  handleVertical: {
    width: 8,
  },
  handleHorizontal: {
    height: 8,
  },
  grip: {
    width: 3,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#999",
  },
});
