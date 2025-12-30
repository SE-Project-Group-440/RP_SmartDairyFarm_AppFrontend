import * as React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

type Side = "top" | "right" | "bottom" | "left";

type SheetContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  side: Side;
};

const SheetContext = React.createContext<SheetContextType | null>(null);

/* -------------------------------------------------------------------------- */
/* Root */
/* -------------------------------------------------------------------------- */

type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  children: React.ReactNode;
};

export function Sheet({
  open,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  children,
}: SheetProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = open ?? internal;

  const setOpen = (v: boolean) => {
    if (open === undefined) setInternal(v);
    onOpenChange?.(v);
  };

  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen, side }}>
      {children}
    </SheetContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger */
/* -------------------------------------------------------------------------- */

export function SheetTrigger({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("SheetTrigger must be inside Sheet");

  return (
    <Pressable onPress={() => ctx.setOpen(true)}>
      {children}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Close */
/* -------------------------------------------------------------------------- */

export function SheetClose({ children }: { children?: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("SheetClose must be inside Sheet");

  return (
    <Pressable onPress={() => ctx.setOpen(false)}>
      {children ?? <Text style={styles.close}>✕</Text>}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Overlay */
/* -------------------------------------------------------------------------- */

function SheetOverlay() {
  const ctx = React.useContext(SheetContext);
  if (!ctx || !ctx.open) return null;

  return (
    <Pressable
      style={styles.overlay}
      onPress={() => ctx.setOpen(false)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Content */
/* -------------------------------------------------------------------------- */

type SheetContentProps = {
  children: React.ReactNode;
};

export function SheetContent({ children }: SheetContentProps) {
  const ctx = React.useContext(SheetContext);
  if (!ctx || !ctx.open) return null;

  const { width, height } = Dimensions.get("window");
  const anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: ctx.open ? 1 : 0,
      duration: ctx.open ? 300 : 200,
      useNativeDriver: true,
    }).start();
  }, [ctx.open]);

  const translate = (() => {
    switch (ctx.side) {
      case "left":
        return {
          transform: [
            {
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-width, 0],
              }),
            },
          ],
        };
      case "right":
        return {
          transform: [
            {
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              }),
            },
          ],
        };
      case "top":
        return {
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-height, 0],
              }),
            },
          ],
        };
      case "bottom":
        return {
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0],
              }),
            },
          ],
        };
    }
  })();

  return (
    <Modal transparent animationType="none">
      <SheetOverlay />
      <Animated.View
        style={[
          styles.content,
          sideStyles(ctx.side),
          translate,
        ]}
      >
        {children}
        <View style={styles.closeBtn}>
          <SheetClose />
        </View>
      </Animated.View>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout Helpers */
/* -------------------------------------------------------------------------- */

const sideStyles = (side: Side) => {
  switch (side) {
    case "left":
      return styles.left;
    case "right":
      return styles.right;
    case "top":
      return styles.top;
    case "bottom":
      return styles.bottom;
  }
};

/* -------------------------------------------------------------------------- */
/* Header / Footer / Title / Description */
/* -------------------------------------------------------------------------- */

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SheetFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function SheetDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.description}>{children}</Text>;
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
    width: "75%",
  },
  right: {
    right: 0,
    top: 0,
    bottom: 0,
    width: "75%",
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  close: {
    fontSize: 18,
    opacity: 0.7,
  },
  header: {
    padding: 16,
    gap: 6,
  },
  footer: {
    padding: 16,
    marginTop: "auto",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
