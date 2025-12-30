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
  LayoutRectangle,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type DropdownMenuContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: LayoutRectangle | null;
};

const DropdownMenuContext =
  createContext<DropdownMenuContextType | null>(null);

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) {
    throw new Error(
      "DropdownMenu components must be used within <DropdownMenu />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* Root */
/* ---------------------------------- */

type DropdownMenuProps = {
  children: ReactNode;
};

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] =
    useState<LayoutRectangle | null>(null);

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, anchor }}
    >
      <View
        onLayout={(e) =>
          setAnchor(e.nativeEvent.layout)
        }
      >
        {children}
      </View>
    </DropdownMenuContext.Provider>
  );
}

/* ---------------------------------- */
/* Trigger */
/* ---------------------------------- */

type DropdownMenuTriggerProps = {
  children: ReactNode;
};

function DropdownMenuTrigger({
  children,
}: DropdownMenuTriggerProps) {
  const { setOpen } = useDropdownMenu();

  return (
    <Pressable onPress={() => setOpen(true)}>
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

type DropdownMenuContentProps = {
  children: ReactNode;
};

function DropdownMenuContent({
  children,
}: DropdownMenuContentProps) {
  const { open, setOpen, anchor } = useDropdownMenu();

  if (!open || !anchor) return null;

  return (
    <Modal transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={() => setOpen(false)}
      >
        <View
          style={[
            styles.menu,
            {
              top: anchor.y + anchor.height,
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

function DropdownMenuGroup({
  children,
}: {
  children: ReactNode;
}) {
  return <View>{children}</View>;
}

/* ---------------------------------- */
/* Item */
/* ---------------------------------- */

type DropdownMenuItemProps = {
  children: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
};

function DropdownMenuItem({
  children,
  onSelect,
  destructive,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

  return (
    <Pressable
      onPress={() => {
        onSelect?.();
        setOpen(false);
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

type DropdownMenuCheckboxItemProps = {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
};

function DropdownMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
}: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuItem
      onSelect={() => onCheckedChange?.(!checked)}
    >
      <Text>{checked ? "✓ " : ""}{children}</Text>
    </DropdownMenuItem>
  );
}

/* ---------------------------------- */
/* Radio Group Context */
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

type DropdownMenuRadioGroupProps = {
  value: string;
  onValueChange: (v: string) => void;
  children: ReactNode;
};

function DropdownMenuRadioGroup({
  value,
  onValueChange,
  children,
}: DropdownMenuRadioGroupProps) {
  return (
    <RadioContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioContext.Provider>
  );
}

/* ---------------------------------- */
/* Radio Item */
/* ---------------------------------- */

type DropdownMenuRadioItemProps = {
  value: string;
  children: ReactNode;
};

function DropdownMenuRadioItem({
  value,
  children,
}: DropdownMenuRadioItemProps) {
  const ctx = useContext(RadioContext);
  if (!ctx) return null;

  const selected = ctx.value === value;

  return (
    <DropdownMenuItem
      onSelect={() => ctx.onValueChange(value)}
    >
      <Text>{selected ? "● " : "○ "}{children}</Text>
    </DropdownMenuItem>
  );
}

/* ---------------------------------- */
/* Label */
/* ---------------------------------- */

function DropdownMenuLabel({
  children,
}: {
  children: ReactNode;
}) {
  return <Text style={styles.label}>{children}</Text>;
}

/* ---------------------------------- */
/* Separator */
/* ---------------------------------- */

function DropdownMenuSeparator() {
  return <View style={styles.separator} />;
}

/* ---------------------------------- */
/* Shortcut */
/* ---------------------------------- */

function DropdownMenuShortcut({
  children,
}: {
  children: ReactNode;
}) {
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
