"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

type DialogContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog components must be used within <Dialog />");
  }
  return ctx;
}

/* ---------------------------------- */
/* Dialog Root */
/* ---------------------------------- */

type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  children: ReactNode;
};

function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const open =
    controlledOpen !== undefined
      ? controlledOpen
      : uncontrolledOpen;

  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(v);
    }
    onOpenChange?.(v);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

/* ---------------------------------- */
/* Trigger */
/* ---------------------------------- */

type DialogTriggerProps = {
  children: ReactNode;
};

function DialogTrigger({ children }: DialogTriggerProps) {
  const { setOpen } = useDialog();

  return (
    <Pressable onPress={() => setOpen(true)}>
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* Portal */
/* ---------------------------------- */

type DialogPortalProps = {
  children: ReactNode;
};

function DialogPortal({ children }: DialogPortalProps) {
  return <>{children}</>;
}

/* ---------------------------------- */
/* Overlay */
/* ---------------------------------- */

type DialogOverlayProps = {
  children?: ReactNode;
};

function DialogOverlay({ children }: DialogOverlayProps) {
  const { setOpen } = useDialog();

  return (
    <Pressable
      style={styles.overlay}
      onPress={() => setOpen(false)}
    >
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* Content */
/* ---------------------------------- */

type DialogContentProps = {
  children: ReactNode;
};

function DialogContent({ children }: DialogContentProps) {
  const { open, setOpen } = useDialog();

  if (!open) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.modalRoot}>
        <DialogOverlay />
        <View style={styles.content}>
          {children}

          <DialogClose>
            <Text style={styles.close}>✕</Text>
          </DialogClose>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------------------------- */
/* Close */
/* ---------------------------------- */

type DialogCloseProps = {
  children: ReactNode;
};

function DialogClose({ children }: DialogCloseProps) {
  const { setOpen } = useDialog();

  return (
    <Pressable onPress={() => setOpen(false)}>
      {children}
    </Pressable>
  );
}

/* ---------------------------------- */
/* Header */
/* ---------------------------------- */

type DialogHeaderProps = {
  children: ReactNode;
};

function DialogHeader({ children }: DialogHeaderProps) {
  return <View style={styles.header}>{children}</View>;
}

/* ---------------------------------- */
/* Footer */
/* ---------------------------------- */

type DialogFooterProps = {
  children: ReactNode;
};

function DialogFooter({ children }: DialogFooterProps) {
  return <View style={styles.footer}>{children}</View>;
}

/* ---------------------------------- */
/* Title */
/* ---------------------------------- */

type DialogTitleProps = {
  children: ReactNode;
};

function DialogTitle({ children }: DialogTitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

/* ---------------------------------- */
/* Description */
/* ---------------------------------- */

type DialogDescriptionProps = {
  children: ReactNode;
};

function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <Text style={styles.description}>{children}</Text>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 10,
  },
  close: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 18,
    opacity: 0.6,
  },
  header: {
    gap: 6,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
