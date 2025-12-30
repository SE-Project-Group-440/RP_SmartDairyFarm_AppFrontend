"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  Animated,
  Pressable,
  View,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type CollapsibleContextType = {
  open: boolean;
  toggle: () => void;
  animatedHeight: Animated.AnimatedInterpolation<number>;
  setContentHeight: (height: number) => void;
};

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

function useCollapsible() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(
      "Collapsible components must be used within <Collapsible />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* Collapsible Root */
/* ---------------------------------- */

type CollapsibleProps = {
  defaultOpen?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Collapsible({
  defaultOpen = false,
  children,
  style,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  const progress = useRef(
    new Animated.Value(defaultOpen ? 1 : 0)
  ).current;

  const contentHeight = useRef(0);

  const toggle = () => {
    Animated.timing(progress, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: false, // height animation = false
    }).start();

    setOpen(!open);
  };

  const setContentHeight = (height: number) => {
    contentHeight.current = height;
  };

  const animatedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight.current],
  });

  return (
    <CollapsibleContext.Provider
      value={{ open, toggle, animatedHeight, setContentHeight }}
    >
      <View style={style}>{children}</View>
    </CollapsibleContext.Provider>
  );
}

/* ---------------------------------- */
/* Collapsible Trigger */
/* ---------------------------------- */

type CollapsibleTriggerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function CollapsibleTrigger({ children, style }: CollapsibleTriggerProps) {
  const { toggle } = useCollapsible();

  return (
    <Pressable onPress={toggle} style={style}>
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* Collapsible Content */
/* ---------------------------------- */

type CollapsibleContentProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function CollapsibleContent({
  children,
  style,
}: CollapsibleContentProps) {
  const { animatedHeight, setContentHeight } = useCollapsible();

  const onLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  return (
    <Animated.View
      style={[
        {
          height: animatedHeight,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
}

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
