import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

/* Enable LayoutAnimation on Android */
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* =========================
   Accordion Root
========================= */

interface AccordionProps {
  children: React.ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <View>{children}</View>;
}

/* =========================
   Accordion Item
========================= */

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    setOpen(!open);
  };

  return (
    <View className="border-b border-slate-200">
      {/* Trigger */}
      <Pressable
        onPress={toggle}
        className="flex-row items-start justify-between py-4"
      >
        <Text className="text-sm font-medium text-slate-900 flex-1">
          {title}
        </Text>

        <ChevronDown
          size={16}
          color="#64748b"
          style={{
            transform: [{ rotate: open ? "180deg" : "0deg" }],
          }}
        />
      </Pressable>

      {/* Content */}
      {open && (
        <View className="pb-4">
          {typeof children === "string" ? (
            <Text className="text-sm text-slate-600">
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
}
