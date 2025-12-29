"use client";

import * as React from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  LayoutRectangle,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type HoverCardContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: LayoutRectangle | null;
  setAnchor: (r: LayoutRectangle) => void;
};

const HoverCardContext =
  React.createContext<HoverCardContextType | null>(null);

function useHoverCard() {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx) {
    throw new Error(
      "HoverCard components must be used within <HoverCard />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* Root */
/* ---------------------------------- */

type HoverCardProps = {
  children: React.ReactNode;
};

function HoverCard({ children }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] =
    React.useState<LayoutRectangle | null>(null);

  return (
    <HoverCardContext.Provider
      value={{ open, setOpen, anchor, setAnchor }}
    >
      {children}
    </HoverCardContext.Provider>
  );
}

/* ---------------------------------- */
/* Trigger */
/* ---------------------------------- */

type HoverCardTriggerProps = {
  children: React.ReactNode;
};

function HoverCardTrigger({ children }: HoverCardTriggerProps) {
  const { setOpen, setAnchor } = useHoverCard();

  return (
    <Pressable
      onPress={() => setOpen(true)}
      onLayout={(e) =>
        setAnchor(e.nativeEvent.layout)
      }
    >
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

type HoverCardContentProps = {
  children: React.ReactNode;
};

function HoverCardContent({
  children,
}: HoverCardContentProps) {
  const { open, setOpen, anchor } = useHoverCard();

  if (!open || !anchor) return null;

  return (
    <Modal transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={() => setOpen(false)}
      >
        <View
          style={[
            styles.content,
            {
              top: anchor.y + anchor.height + 6,
              left: anchor.x,
            },
          ]}
        >
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  content: {
    position: "absolute",
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 8,
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
};
