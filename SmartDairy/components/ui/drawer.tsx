"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type DrawerDirection = "bottom" | "top" | "left" | "right";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type DrawerContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  direction: DrawerDirection;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("Drawer components must be used within <Drawer />");
  }
  return ctx;
}

/* ---------------------------------- */
/* Root */
/* ---------------------------------- */

type DrawerProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  direction?: DrawerDirection;
};

function Drawer({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  direction = "bottom",
}: DrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const open =
    controlledOpen !== undefined
      ? controlledOpen
      : uncontrolledOpen;

  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(v);
    }
    onOpenChange?.(v);
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen, direction }}>
      {children}
    </DrawerContext.Provider>
  );
}

/* ---------------------------------- */
/* Trigger */
/* ---------------------------------- */

type DrawerTriggerProps = {
  children: ReactNode;
};

function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { setOpen } = useDrawer();
  return <Pressable onPress={() => setOpen(true)}>{children}</Pressable>;
}

/* ---------------------------------- */
/* Close */
/* ---------------------------------- */

type DrawerCloseProps = {
  children: ReactNode;
};

function DrawerClose({ children }: DrawerCloseProps) {
  const { setOpen } = useDrawer();
  return <Pressable onPress={() => setOpen(false)}>{children}</Pressable>;
}

/* ---------------------------------- */
/* Overlay */
/* ---------------------------------- */

function DrawerOverlay() {
  const { setOpen } = useDrawer();

  return (
    <Pressable
      style={styles.overlay}
      onPress={() => setOpen(false)}
    />
  );
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

type DrawerContentProps = {
  children: ReactNode;
};

function DrawerContent({ children }: DrawerContentProps) {
  const { open, direction } = useDrawer();
  const screen = Dimensions.get("window");

  const translate = useRef(
    new Animated.Value(open ? 0 : 1)
  ).current;

  React.useEffect(() => {
    Animated.timing(translate, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open]);

  if (!open) return null;

  const transformMap = {
    bottom: {
      transform: [
        {
          translateY: translate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screen.height],
          }),
        },
      ],
    },
    top: {
      transform: [
        {
          translateY: translate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -screen.height],
          }),
        },
      ],
    },
    left: {
      transform: [
        {
          translateX: translate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -screen.width],
          }),
        },
      ],
    },
    right: {
      transform: [
        {
          translateX: translate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screen.width],
          }),
        },
      ],
    },
  };

  return (
    <Modal transparent animationType="none">
      <View style={styles.modalRoot}>
        <DrawerOverlay />
        <Animated.View
          style={[
            styles.content,
            styles[direction],
            transformMap[direction],
          ]}
        >
          {direction === "bottom" && <View style={styles.handle} />}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------------------------------- */
/* Header */
/* ---------------------------------- */

function DrawerHeader({ children }: { children: ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

/* ---------------------------------- */
/* Footer */
/* ---------------------------------- */

function DrawerFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

/* ---------------------------------- */
/* Title */
/* ---------------------------------- */

function DrawerTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

/* ---------------------------------- */
/* Description */
/* ---------------------------------- */

function DrawerDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    backgroundColor: "#fff",
    maxHeight: "80%",
    width: "100%",
    borderRadius: 16,
    paddingBottom: 16,
  },
  bottom: {
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  top: {
    top: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  left: {
    left: 0,
    height: "100%",
    width: "75%",
  },
  right: {
    right: 0,
    height: "100%",
    width: "75%",
  },
  handle: {
    width: 100,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 8,
  },
  header: {
    padding: 16,
    gap: 6,
  },
  footer: {
    marginTop: "auto",
    padding: 16,
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

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
