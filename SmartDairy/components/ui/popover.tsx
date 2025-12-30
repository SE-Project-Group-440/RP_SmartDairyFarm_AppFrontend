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

type PopoverContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerLayout: any;
  setTriggerLayout: (v: any) => void;
};

const PopoverContext = React.createContext<PopoverContextType | null>(
  null
);

/* ---------------------------------- Root --------------------------------- */

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState(null);

  return (
    <PopoverContext.Provider
      value={{ open, setOpen, triggerLayout, setTriggerLayout }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

/* -------------------------------- Trigger -------------------------------- */

export function PopoverTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverTrigger must be inside Popover");

  return (
    <Pressable
      onLayout={(e) => ctx.setTriggerLayout(e.nativeEvent.layout)}
      onPress={() => ctx.setOpen(true)}
    >
      {children}
    </Pressable>
  );
}

/* -------------------------------- Content -------------------------------- */

type PopoverContentProps = {
  children: React.ReactNode;
  sideOffset?: number;
};

export function PopoverContent({
  children,
  sideOffset = 8,
}: PopoverContentProps) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverContent must be inside Popover");

  const { open, setOpen, triggerLayout } = ctx;
  const fade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: open ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [open]);

  if (!open || !triggerLayout) return null;

  const { width: screenWidth } = Dimensions.get("window");

  const top = triggerLayout.y + triggerLayout.height + sideOffset;
  const left = Math.min(
    triggerLayout.x,
    screenWidth - 280
  );

  return (
    <Modal transparent animationType="none">
      <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
        <Animated.View
          style={[
            styles.content,
            {
              top,
              left,
              opacity: fade,
              transform: [
                {
                  scale: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/* -------------------------------- Anchor --------------------------------- */
/* RN doesn't need a separate Anchor – Trigger already handles layout */
export function PopoverAnchor({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  content: {
    position: "absolute",
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
});
