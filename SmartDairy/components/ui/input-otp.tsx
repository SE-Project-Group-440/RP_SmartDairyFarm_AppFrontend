"use client";

import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type OTPSlot = {
  char: string;
  isActive: boolean;
};

type OTPContextValue = {
  value: string;
  length: number;
  slots: OTPSlot[];
  setChar: (index: number, char: string) => void;
  focusIndex: (index: number) => void;
};

const OTPContext = React.createContext<OTPContextValue | null>(
  null
);

function useOTP() {
  const ctx = React.useContext(OTPContext);
  if (!ctx) {
    throw new Error(
      "OTP components must be used within <InputOTP />"
    );
  }
  return ctx;
}

/* ---------------------------------- */
/* InputOTP (Root) */
/* ---------------------------------- */

type InputOTPProps = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  disabled?: boolean;
};

function InputOTP({
  value,
  onChange,
  length = 6,
  disabled,
}: InputOTPProps) {
  const inputs = React.useRef<TextInput[]>([]);
  const [activeIndex, setActiveIndex] =
    React.useState(0);

  const setChar = (index: number, char: string) => {
    const chars = value.split("");
    chars[index] = char;
    onChange(chars.join(""));
    if (char && index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const focusIndex = (index: number) => {
    setActiveIndex(index);
    inputs.current[index]?.focus();
  };

  const slots: OTPSlot[] = Array.from(
    { length },
    (_, i) => ({
      char: value[i] ?? "",
      isActive: i === activeIndex,
    })
  );

  return (
    <OTPContext.Provider
      value={{
        value,
        length,
        slots,
        setChar,
        focusIndex,
      }}
    >
      <View style={styles.container}>
        {slots.map((_, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              if (r) inputs.current[i] = r;
            }}
            value={value[i] ?? ""}
            onChangeText={(t) =>
              setChar(i, t.slice(-1))
            }
            onFocus={() => setActiveIndex(i)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!disabled}
            style={styles.hiddenInput}
          />
        ))}
      </View>
    </OTPContext.Provider>
  );
}

/* ---------------------------------- */
/* Group */
/* ---------------------------------- */

function InputOTPGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.group}>{children}</View>;
}

/* ---------------------------------- */
/* Slot */
/* ---------------------------------- */

type InputOTPSlotProps = {
  index: number;
};

function InputOTPSlot({ index }: InputOTPSlotProps) {
  const { slots, focusIndex } = useOTP();
  const slot = slots[index];

  return (
    <Pressable
      onPress={() => focusIndex(index)}
      style={[
        styles.slot,
        slot.isActive && styles.slotActive,
      ]}
    >
      <Text style={styles.char}>
        {slot.char}
      </Text>
    </Pressable>
  );
}

/* ---------------------------------- */
/* Separator */
/* ---------------------------------- */

function InputOTPSeparator() {
  return (
    <View style={styles.separator}>
      <Text style={styles.separatorText}>–</Text>
    </View>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    opacity: 0,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slot: {
    width: 40,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  slotActive: {
    borderColor: "#2563eb",
  },
  char: {
    fontSize: 18,
    fontWeight: "500",
  },
  separator: {
    marginHorizontal: 4,
  },
  separatorText: {
    fontSize: 18,
    opacity: 0.5,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
};
