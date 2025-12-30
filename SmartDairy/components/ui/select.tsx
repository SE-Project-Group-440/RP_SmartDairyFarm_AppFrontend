import * as React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

type SelectContextType = {
  value?: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerLayout: any;
  setTriggerLayout: (v: any) => void;
};

const SelectContext = React.createContext<SelectContextType | null>(null);

/* -------------------------------------------------------------------------- */
/* Root */
/* -------------------------------------------------------------------------- */

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: SelectProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState<any>(null);

  const currentValue = value ?? internal;

  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        setValue,
        open,
        setOpen,
        triggerLayout,
        setTriggerLayout,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger */
/* -------------------------------------------------------------------------- */

type SelectTriggerProps = {
  size?: "sm" | "default";
  children: React.ReactNode;
  style?: any;
};

export function SelectTrigger({
  size = "default",
  children,
  style,
}: SelectTriggerProps) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be inside Select");

  return (
    <Pressable
      onLayout={(e) => ctx.setTriggerLayout(e.nativeEvent.layout)}
      onPress={() => ctx.setOpen(true)}
      style={[
        styles.trigger,
        size === "sm" && styles.triggerSm,
        style,
      ]}
    >
      <View style={styles.triggerContent}>{children}</View>
      <Text style={styles.chevron}>⌄</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Value */
/* -------------------------------------------------------------------------- */

export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.value,
        !ctx.value && styles.placeholder,
      ]}
    >
      {ctx.value ?? placeholder}
    </Text>
  );
}

/* -------------------------------------------------------------------------- */
/* Content */
/* -------------------------------------------------------------------------- */

type SelectContentProps = {
  children: React.ReactNode;
};

export function SelectContent({ children }: SelectContentProps) {
  const ctx = React.useContext(SelectContext);
  if (!ctx || !ctx.open || !ctx.triggerLayout) return null;

  const top =
    ctx.triggerLayout.y + ctx.triggerLayout.height + 6;
  const left = ctx.triggerLayout.x;
  const width = ctx.triggerLayout.width;

  return (
    <Modal transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={() => ctx.setOpen(false)}
      >
        <View
          style={[
            styles.content,
            { top, left, width },
          ]}
        >
          <ScrollView>{children}</ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/* Group */
/* -------------------------------------------------------------------------- */

export function SelectGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View>{children}</View>;
}

/* -------------------------------------------------------------------------- */
/* Label */
/* -------------------------------------------------------------------------- */

export function SelectLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.label}>{children}</Text>;
}

/* -------------------------------------------------------------------------- */
/* Item */
/* -------------------------------------------------------------------------- */

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export function SelectItem({
  value,
  children,
  disabled,
}: SelectItemProps) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be inside Select");

  const selected = ctx.value === value;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => ctx.setValue(value)}
      style={[
        styles.item,
        selected && styles.itemSelected,
        disabled && styles.itemDisabled,
      ]}
    >
      <Text style={styles.itemText}>{children}</Text>
      {selected && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Separator */
/* -------------------------------------------------------------------------- */

export function SelectSeparator() {
  return <View style={styles.separator} />;
}

/* -------------------------------------------------------------------------- */
/* Scroll Buttons (visual only, RN scrolls natively) */
/* -------------------------------------------------------------------------- */

export function SelectScrollUpButton() {
  return <Text style={styles.scrollHint}>↑</Text>;
}

export function SelectScrollDownButton() {
  return <Text style={styles.scrollHint}>↓</Text>;
}

const styles = StyleSheet.create({
  trigger: {
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  triggerSm: {
    height: 32,
  },
  triggerContent: {
    flex: 1,
  },
  chevron: {
    opacity: 0.5,
  },
  value: {
    fontSize: 14,
  },
  placeholder: {
    color: "#888",
  },
  overlay: {
    flex: 1,
  },
  content: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 240,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "#666",
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemSelected: {
    backgroundColor: "#f0f0f0",
  },
  itemDisabled: {
    opacity: 0.4,
  },
  itemText: {
    fontSize: 14,
  },
  check: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 4,
  },
  scrollHint: {
    textAlign: "center",
    opacity: 0.4,
    paddingVertical: 4,
  },
});
