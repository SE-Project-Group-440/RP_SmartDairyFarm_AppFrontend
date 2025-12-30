import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Table (Container) */
/* -------------------------------------------------------------------------- */

type TableProps = {
  children: React.ReactNode;
  style?: any;
};

export function Table({ children, style }: TableProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
    >
      <View style={styles.table}>{children}</View>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Sections */
/* -------------------------------------------------------------------------- */

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

export function TableFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

/* -------------------------------------------------------------------------- */
/* Row */
/* -------------------------------------------------------------------------- */

type TableRowProps = {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
};

export function TableRow({
  children,
  selected,
  onPress,
}: TableRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        selected && styles.rowSelected,
      ]}
    >
      {children}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Cells */
/* -------------------------------------------------------------------------- */

type CellProps = {
  children: React.ReactNode;
  width?: number;
};

export function TableHead({ children, width = 120 }: CellProps) {
  return (
    <View style={[styles.cell, { width }]}>
      <Text style={styles.headText} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

export function TableCell({ children, width = 120 }: CellProps) {
  return (
    <View style={[styles.cell, { width }]}>
      <Text style={styles.cellText} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Caption */
/* -------------------------------------------------------------------------- */

export function TableCaption({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.caption}>{children}</Text>;
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  table: {
    minWidth: "100%",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    alignItems: "center",
  },
  rowSelected: {
    backgroundColor: "#f0f0f0",
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  headText: {
    fontSize: 13,
    fontWeight: "600",
  },
  cellText: {
    fontSize: 13,
  },
  caption: {
    marginTop: 12,
    fontSize: 12,
    color: "#666",
  },
});
