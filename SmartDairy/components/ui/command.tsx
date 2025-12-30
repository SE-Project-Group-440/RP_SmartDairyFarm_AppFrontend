"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  StyleSheet,
  ViewStyle,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type CommandContextType = {
  search: string;
  setSearch: (v: string) => void;
};

const CommandContext = createContext<CommandContextType | null>(null);

function useCommand() {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error("Command components must be used within <Command />");
  }
  return ctx;
}

/* ---------------------------------- */
/* Command Root */
/* ---------------------------------- */

type CommandProps = {
  children: ReactNode;
  style?: ViewStyle;
};

function Command({ children, style }: CommandProps) {
  const [search, setSearch] = useState("");

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <View style={[styles.command, style]}>{children}</View>
    </CommandContext.Provider>
  );
}

/* ---------------------------------- */
/* Command Dialog */
/* ---------------------------------- */

type CommandDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
};

function CommandDialog({
  open,
  onOpenChange,
  title = "Command Palette",
  description = "Search for a command…",
  children,
}: CommandDialogProps) {
  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}

/* ---------------------------------- */
/* Command Input */
/* ---------------------------------- */

type CommandInputProps = {
  placeholder?: string;
};

function CommandInput({ placeholder = "Search…" }: CommandInputProps) {
  const { search, setSearch } = useCommand();

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#888"
      />
    </View>
  );
}

/* ---------------------------------- */
/* Command List */
/* ---------------------------------- */

type CommandListProps = {
  children: ReactNode;
};

function CommandList({ children }: CommandListProps) {
  return <View style={styles.list}>{children}</View>;
}

/* ---------------------------------- */
/* Command Empty */
/* ---------------------------------- */

type CommandEmptyProps = {
  message?: string;
};

function CommandEmpty({ message = "No results found." }: CommandEmptyProps) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

/* ---------------------------------- */
/* Command Group */
/* ---------------------------------- */

type CommandGroupProps = {
  heading?: string;
  children: ReactNode;
};

function CommandGroup({ heading, children }: CommandGroupProps) {
  return (
    <View style={styles.group}>
      {heading && <Text style={styles.groupHeading}>{heading}</Text>}
      {children}
    </View>
  );
}

/* ---------------------------------- */
/* Command Item */
/* ---------------------------------- */

type CommandItemProps = {
  value: string;
  onSelect?: (value: string) => void;
  children: ReactNode;
};

function CommandItem({ value, onSelect, children }: CommandItemProps) {
  const { search } = useCommand();

  const visible = useMemo(() => {
    return value.toLowerCase().includes(search.toLowerCase());
  }, [search, value]);

  if (!visible) return null;

  return (
    <Pressable
      onPress={() => onSelect?.(value)}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}
    >
      <Text style={styles.itemText}>{children}</Text>
    </Pressable>
  );
}

/* ---------------------------------- */
/* Command Shortcut */
/* ---------------------------------- */

type CommandShortcutProps = {
  children: ReactNode;
};

function CommandShortcut({ children }: CommandShortcutProps) {
  return <Text style={styles.shortcut}>{children}</Text>;
}

/* ---------------------------------- */
/* Command Separator */
/* ---------------------------------- */

function CommandSeparator() {
  return <View style={styles.separator} />;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  command: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  input: {
    height: 44,
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
  },
  empty: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
  group: {
    marginBottom: 8,
  },
  groupHeading: {
    fontSize: 12,
    fontWeight: "500",
    color: "#777",
    marginBottom: 4,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  itemPressed: {
    backgroundColor: "#eee",
  },
  itemText: {
    fontSize: 15,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#888",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 6,
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
