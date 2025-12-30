import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = 260;
const SIDEBAR_WIDTH_COLLAPSED = 64;

const isMobile = SCREEN_WIDTH < 768;

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

type SidebarContextType = {
  open: boolean;
  collapsed: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Provider */
/* -------------------------------------------------------------------------- */

type SidebarProviderProps = {
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SidebarProvider({
  defaultOpen = true,
  children,
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [collapsed, setCollapsed] = React.useState(false);

  const toggle = () => {
    if (isMobile) setOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  const close = () => setOpen(false);

  return (
    <SidebarContext.Provider
      value={{ open, collapsed, toggle, close }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Sidebar */
/* -------------------------------------------------------------------------- */

type SidebarProps = {
  children: React.ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const { open, collapsed, close } = useSidebar();
  const translate = React.useRef(
    new Animated.Value(open ? 0 : -SIDEBAR_WIDTH),
  ).current;

  React.useEffect(() => {
    Animated.timing(translate, {
      toValue: open ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open]);

  if (isMobile) {
    return open ? (
      <Pressable style={styles.overlay} onPress={close}>
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: translate }] },
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    ) : null;
  }

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: collapsed
            ? SIDEBAR_WIDTH_COLLAPSED
            : SIDEBAR_WIDTH,
        },
      ]}
    >
      {children}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger */
/* -------------------------------------------------------------------------- */

export function SidebarTrigger({ children }: { children: React.ReactNode }) {
  const { toggle } = useSidebar();
  return <Pressable onPress={toggle}>{children}</Pressable>;
}

/* -------------------------------------------------------------------------- */
/* Layout Parts */
/* -------------------------------------------------------------------------- */

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <ScrollView style={styles.content}>{children}</ScrollView>;
}

export function SidebarSeparator() {
  return <View style={styles.separator} />;
}

/* -------------------------------------------------------------------------- */
/* Groups */
/* -------------------------------------------------------------------------- */

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

export function SidebarGroupLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.groupLabel}>{children}</Text>;
}

export function SidebarGroupContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View>{children}</View>;
}

/* -------------------------------------------------------------------------- */
/* Menu */
/* -------------------------------------------------------------------------- */

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <View style={styles.menu}>{children}</View>;
}

export function SidebarMenuItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View>{children}</View>;
}

type SidebarMenuButtonProps = {
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

export function SidebarMenuButton({
  active,
  onPress,
  children,
}: SidebarMenuButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuButton,
        active && styles.menuButtonActive,
      ]}
    >
      <Text style={styles.menuText}>{children}</Text>
    </Pressable>
  );
}

export function SidebarMenuBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton */
/* -------------------------------------------------------------------------- */

export function SidebarMenuSkeleton() {
  return <View style={styles.skeleton} />;
}

/* -------------------------------------------------------------------------- */
/* Inset (Main Content Wrapper) */
/* -------------------------------------------------------------------------- */

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return <View style={styles.inset}>{children}</View>;
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
  },
  sidebar: {
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 16,
  },
  header: {
    padding: 16,
  },
  footer: {
    padding: 16,
    marginTop: "auto",
  },
  content: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 8,
  },
  group: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  menu: {
    gap: 4,
  },
  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuButtonActive: {
    backgroundColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 14,
  },
  badge: {
    position: "absolute",
    right: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
  },
  skeleton: {
    height: 36,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginVertical: 4,
  },
  inset: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
});
