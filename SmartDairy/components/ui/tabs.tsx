import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

type TabsContextType = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

/* -------------------------------------------------------------------------- */
/* Tabs (Root) */
/* -------------------------------------------------------------------------- */

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: any;
};

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue);

  const currentValue = value ?? internal;

  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  if (!currentValue) return null;

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <View style={[styles.root, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* TabsList */
/* -------------------------------------------------------------------------- */

type TabsListProps = {
  children: React.ReactNode;
  style?: any;
};

export function TabsList({ children, style }: TabsListProps) {
  return <View style={[styles.list, style]}>{children}</View>;
}

/* -------------------------------------------------------------------------- */
/* TabsTrigger */
/* -------------------------------------------------------------------------- */

type TabsTriggerProps = {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  style?: any;
};

export function TabsTrigger({
  value,
  disabled,
  children,
  style,
}: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const active = ctx.value === value;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => ctx.setValue(value)}
      style={[
        styles.trigger,
        active && styles.triggerActive,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.triggerText,
          active && styles.triggerTextActive,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* TabsContent */
/* -------------------------------------------------------------------------- */

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  style?: any;
};

export function TabsContent({
  value,
  children,
  style,
}: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  if (ctx.value !== value) return null;

  return <View style={[styles.content, style]}>{children}</View>;
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 8,
  },
  list: {
    flexDirection: "row",
    backgroundColor: "#e5e5e5",
    borderRadius: 12,
    padding: 4,
    alignSelf: "flex-start",
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  triggerActive: {
    backgroundColor: "#fff",
  },
  triggerText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  triggerTextActive: {
    color: "#000",
  },
  content: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
