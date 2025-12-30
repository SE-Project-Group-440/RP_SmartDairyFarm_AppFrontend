import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  Animated,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type TooltipContextType = {
  open: boolean;
  show: () => void;
  hide: () => void;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

/* ---------------------------------- */
/* TooltipProvider */
/* ---------------------------------- */
type TooltipProviderProps = {
  delayDuration?: number;
  children: ReactNode;
};

function TooltipProvider({ delayDuration = 0, children }: TooltipProviderProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const show = () => {
  timeoutRef.current = setTimeout(() => {
    setOpen(true);
  }, delayDuration);
};

const hide = () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  setOpen(false);
};

  return (
    <TooltipContext.Provider value={{ open, show, hide }}>
      {children}
    </TooltipContext.Provider>
  );
}

/* ---------------------------------- */
/* Tooltip */
/* ---------------------------------- */
type TooltipProps = {
  children: ReactNode;
};

function Tooltip({ children }: TooltipProps) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

/* ---------------------------------- */
/* TooltipTrigger */
/* ---------------------------------- */
type TooltipTriggerProps = {
  children: ReactNode;
};

function TooltipTrigger({ children }: TooltipTriggerProps) {
  const ctx = useContext(TooltipContext);
  if (!ctx) return null;

  const handlePressIn = (_: GestureResponderEvent) => {
    ctx.show();
  };

  const handlePressOut = (_: GestureResponderEvent) => {
    ctx.hide();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* TooltipContent */
/* ---------------------------------- */
type TooltipContentProps = {
  children: ReactNode;
};

function TooltipContent({ children }: TooltipContentProps) {
  const ctx = useContext(TooltipContext);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (ctx?.open) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [ctx?.open]);

  if (!ctx?.open) return null;

  return (
    <Modal transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={styles.text}>{children}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontSize: 12,
  },
});

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
