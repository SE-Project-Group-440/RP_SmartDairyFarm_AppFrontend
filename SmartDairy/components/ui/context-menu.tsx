"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

/* ---------------------------------- */
/* Context Menu Context */
/* ---------------------------------- */

type ContextMenuContextType = {
  open: boolean;
  x: number;
  y: number;
  openMenu: (e: GestureResponderEvent) => void;
  closeMenu: () => void;
};

const ContextMenuContext =
  createContext<ContextMenuContextType | null>(null);

function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error(
      "ContextMenu components must be used within <ContextMenu />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* Root */
/* ---------------------------------- */

type ContextMenuProps = {
  children: ReactNode;
};

function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const openMenu = (e: GestureResponderEvent) => {
    setPos({
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    });
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  return (
    <ContextMenuContext.Provider
      value={{ open, x: pos.x, y: pos.y, openMenu, closeMenu }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

/* ---------------------------------- */
/* Trigger */
/* ---------------------------------- */

type ContextMenuTriggerProps = {
  children: ReactNode;
};

function ContextMenuTrigger({ children }: ContextMenuTriggerProps) {
  const { openMenu } = useContextMenu();

  return <Pressable onLongPress={openMenu}>{children}</Pressable>;
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

type ContextMenuContentProps = {
  children: ReactNode;
};

function ContextMenuContent({ children }: ContextMenuContentProps) {
  const { open, x, y, closeMenu } = useContextMenu();

  if (!open) return null;

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={closeMenu}>
        <View style={[styles.menu, { top: y, left: x }]}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

/* ---------------------------------- */
/* Item */
/* ---------------------------------- */

type ContextMenuItemProps = {
  children: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
};

function ContextMenuItem({
  children,
  onSelect,
  destructive,
}: ContextMenuItemProps) {
  const { closeMenu } = useContextMenu();

  return (
    <Pressable
      onPress={() => {
        onSelect?.();
        closeMenu();
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

type ContextMenuCheckboxItemProps = {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
};

function ContextMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuItem
      onSelect={() => onCheckedChange?.(!checked)}
    >
      <Text>{checked ? "✓ " : ""}{children}</Text>
    </ContextMenuItem>
  );
}

/* ---------------------------------- */
/* Radio Group Context (FIXED) */
/* ---------------------------------- */

type RadioContextValue = {
  value: string;
  onValueChange: (v: string) => void;
};

const RadioContext =
  createContext<RadioContextValue | null>(null);

/* ---------------------------------- */
/* Radio Group */
/* ---------------------------------- */

type ContextMenuRadioGroupProps = {
  value: string;
  onValueChange: (v: string) => void;
  children: ReactNode;
};

function ContextMenuRadioGroup({
  value,
  onValueChange,
  children,
}: ContextMenuRadioGroupProps) {
  return (
    <RadioContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioContext.Provider>
  );
}

/* ---------------------------------- */
/* Radio Item */
/* ---------------------------------- */

type ContextMenuRadioItemProps = {
  value: string;
  children: ReactNode;
};

function ContextMenuRadioItem({
  value,
  children,
}: ContextMenuRadioItemProps) {
  const ctx = useContext(RadioContext);
  if (!ctx) return null;

  const selected = ctx.value === value;

  return (
    <ContextMenuItem
      onSelect={() => ctx.onValueChange(value)}
    >
      <Text>{selected ? "● " : "○ "}{children}</Text>
    </ContextMenuItem>
  );
}

/* ---------------------------------- */
/* Label */
/* ---------------------------------- */

type ContextMenuLabelProps = {
  children: ReactNode;
};

function ContextMenuLabel({ children }: ContextMenuLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

/* ---------------------------------- */
/* Separator */
/* ---------------------------------- */

function ContextMenuSeparator() {
  return <View style={styles.separator} />;
}

/* ---------------------------------- */
/* Shortcut */
/* ---------------------------------- */

type ContextMenuShortcutProps = {
  children: ReactNode;
};

function ContextMenuShortcut({ children }: ContextMenuShortcutProps) {
  return <Text style={styles.shortcut}>{children}</Text>;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    minWidth: 180,
    elevation: 8,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  itemPressed: {
    backgroundColor: "#eee",
  },
  itemText: {
    fontSize: 14,
  },
  destructive: {
    color: "red",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 6,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#999",
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
};
