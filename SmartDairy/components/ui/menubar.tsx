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

type MenubarContextType = {
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  anchors: Record<string, LayoutRectangle>;
  setAnchor: (id: string, rect: LayoutRectangle) => void;
};

const MenubarContext =
  React.createContext<MenubarContextType | null>(null);

function useMenubar() {
  const ctx = React.useContext(MenubarContext);
  if (!ctx) {
    throw new Error(
      "Menubar components must be used within <Menubar />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* Root */
/* ---------------------------------- */

function Menubar({ children }: { children: React.ReactNode }) {
  const [openMenu, setOpenMenu] =
    React.useState<string | null>(null);
  const [anchors, setAnchors] = React.useState<
    Record<string, LayoutRectangle>
  >({});

  const setAnchor = (id: string, rect: LayoutRectangle) => {
    setAnchors((prev) => ({ ...prev, [id]: rect }));
  };

  return (
    <MenubarContext.Provider
      value={{ openMenu, setOpenMenu, anchors, setAnchor }}
    >
      <View style={styles.menubar}>{children}</View>
    </MenubarContext.Provider>
  );
}

/* ---------------------------------- */
/* Menu */
/* ---------------------------------- */

function MenubarMenu({
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

function MenubarTrigger({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setOpenMenu, setAnchor } = useMenubar();

  return (
    <Pressable
      onPress={() => setOpenMenu(id)}
      onLayout={(e) =>
        setAnchor(id, e.nativeEvent.layout)
      }
      style={({ pressed }) => [
        styles.trigger,
        pressed && styles.triggerPressed,
      ]}
    >
      <Text style={styles.triggerText}>{children}</Text>
    </Pressable>
  );
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

function MenubarContent({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { openMenu, setOpenMenu, anchors } =
    useMenubar();

  if (openMenu !== id || !anchors[id]) return null;

  const anchor = anchors[id];

  return (
    <Modal transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={() => setOpenMenu(null)}
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
/* Group */
/* ---------------------------------- */

function MenubarGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View>{children}</View>;
}

/* ---------------------------------- */
/* Item */
/* ---------------------------------- */

function MenubarItem({
  children,
  onSelect,
  destructive,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
}) {
  const { setOpenMenu } = useMenubar();

  return (
    <Pressable
      onPress={() => {
        onSelect?.();
        setOpenMenu(null);
      }}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}
    >
      <Text
        style={[
          styles.itemText,
          destructive && styles.destructive,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

/* ---------------------------------- */
/* Checkbox Item */
/* ---------------------------------- */

function MenubarCheckboxItem({
  children,
  checked,
  onCheckedChange,
}: {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <MenubarItem
      onSelect={() => onCheckedChange?.(!checked)}
    >
      <Text>
        {checked ? "✓ " : ""}
        {children}
      </Text>
    </MenubarItem>
  );
}

/* ---------------------------------- */
/* Radio Group */
/* ---------------------------------- */

type RadioContextValue = {
  value: string;
  onValueChange: (v: string) => void;
};

const RadioContext =
  React.createContext<RadioContextValue | null>(null);

function MenubarRadioGroup({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <RadioContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioContext.Provider>
  );
}

/* ---------------------------------- */
/* Radio Item */
/* ---------------------------------- */

function MenubarRadioItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(RadioContext);
  if (!ctx) return null;

  const selected = ctx.value === value;

  return (
    <MenubarItem
      onSelect={() => ctx.onValueChange(value)}
    >
      <Text>
        {selected ? "● " : "○ "}
        {children}
      </Text>
    </MenubarItem>
  );
}

/* ---------------------------------- */
/* Label */
/* ---------------------------------- */

function MenubarLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.label}>{children}</Text>;
}

/* ---------------------------------- */
/* Separator */
/* ---------------------------------- */

function MenubarSeparator() {
  return <View style={styles.separator} />;
}

/* ---------------------------------- */
/* Shortcut */
/* ---------------------------------- */

function MenubarShortcut({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.shortcut}>{children}</Text>;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  menubar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  trigger: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  triggerPressed: {
    backgroundColor: "#f3f4f6",
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
  },
  content: {
    position: "absolute",
    minWidth: 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    elevation: 8,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  itemPressed: {
    backgroundColor: "#f3f4f6",
  },
  itemText: {
    fontSize: 14,
  },
  destructive: {
    color: "#dc2626",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 6,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#9ca3af",
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
};
