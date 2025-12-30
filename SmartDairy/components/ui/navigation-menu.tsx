"use client";

import * as React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  LayoutRectangle,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type NavigationMenuContextType = {
  openItem: string | null;
  setOpenItem: (id: string | null) => void;
  anchors: Record<string, LayoutRectangle>;
  setAnchor: (id: string, rect: LayoutRectangle) => void;
};

const NavigationMenuContext =
  React.createContext<NavigationMenuContextType | null>(null);

function useNavigationMenu() {
  const ctx = React.useContext(NavigationMenuContext);
  if (!ctx) {
    throw new Error(
      "NavigationMenu components must be used within <NavigationMenu />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* Root */
/* ---------------------------------- */

function NavigationMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openItem, setOpenItem] =
    React.useState<string | null>(null);
  const [anchors, setAnchors] = React.useState<
    Record<string, LayoutRectangle>
  >({});

  const setAnchor = (id: string, rect: LayoutRectangle) => {
    setAnchors((prev) => ({ ...prev, [id]: rect }));
  };

  return (
    <NavigationMenuContext.Provider
      value={{ openItem, setOpenItem, anchors, setAnchor }}
    >
      <View style={styles.root}>{children}</View>
    </NavigationMenuContext.Provider>
  );
}

/* ---------------------------------- */
/* List */
/* ---------------------------------- */

function NavigationMenuList({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.list}>{children}</View>;
}

/* ---------------------------------- */
/* Item */
/* ---------------------------------- */

function NavigationMenuItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return <View>{children}</View>;
}

/* ---------------------------------- */
/* Trigger */
/* ---------------------------------- */

function NavigationMenuTrigger({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { openItem, setOpenItem, setAnchor } =
    useNavigationMenu();

  const isOpen = openItem === id;

  return (
    <Pressable
      onPress={() => setOpenItem(isOpen ? null : id)}
      onLayout={(e) =>
        setAnchor(id, e.nativeEvent.layout)
      }
      style={({ pressed }) => [
        styles.trigger,
        (pressed || isOpen) && styles.triggerActive,
      ]}
    >
      <Text style={styles.triggerText}>{children}</Text>
      <Text
        style={[
          styles.chevron,
          isOpen && styles.chevronOpen,
        ]}
      >
        ▾
      </Text>
    </Pressable>
  );
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

function NavigationMenuContent({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { openItem, setOpenItem, anchors } =
    useNavigationMenu();

  if (openItem !== id || !anchors[id]) return null;

  const anchor = anchors[id];

  return (
    <Modal transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={() => setOpenItem(null)}
      >
        <View
          style={[
            styles.content,
            {
              top: anchor.y + anchor.height + 8,
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
/* Link */
/* ---------------------------------- */

function NavigationMenuLink({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const { setOpenItem } = useNavigationMenu();

  return (
    <Pressable
      onPress={() => {
        onPress?.();
        setOpenItem(null);
      }}
      style={({ pressed }) => [
        styles.link,
        pressed && styles.linkPressed,
      ]}
    >
      <Text style={styles.linkText}>{children}</Text>
    </Pressable>
  );
}

/* ---------------------------------- */
/* Indicator (visual only) */
/* ---------------------------------- */

function NavigationMenuIndicator() {
  return <View style={styles.indicator} />;
}

/* ---------------------------------- */
/* Viewport (noop on native) */
/* ---------------------------------- */

function NavigationMenuViewport() {
  return null;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  triggerActive: {
    backgroundColor: "#f3f4f6",
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: 6,
    fontSize: 12,
    opacity: 0.6,
    transform: [{ rotate: "0deg" }],
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  overlay: {
    flex: 1,
  },
  content: {
    position: "absolute",
    minWidth: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 10,
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  linkPressed: {
    backgroundColor: "#f3f4f6",
  },
  linkText: {
    fontSize: 14,
  },
  indicator: {
    height: 2,
    width: 24,
    backgroundColor: "#2563eb",
    borderRadius: 1,
    marginTop: 4,
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
