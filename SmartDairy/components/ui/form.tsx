"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

/* ---------------------------------- */
/* Form */
/* ---------------------------------- */

const Form = FormProvider;

/* ---------------------------------- */
/* Form Field Context */
/* ---------------------------------- */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

/* ---------------------------------- */
/* Form Field */
/* ---------------------------------- */

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/* ---------------------------------- */
/* Form Item Context */
/* ---------------------------------- */

type FormItemContextValue = {
  id: string;
};

const FormItemContext =
  React.createContext<FormItemContextValue | null>(null);

/* ---------------------------------- */
/* useFormField Hook */
/* ---------------------------------- */

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();

  if (!fieldContext || !itemContext) {
    throw new Error(
      "useFormField must be used within <FormField> and <FormItem>"
    );
  }

  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(
    fieldContext.name,
    formState
  );

  return {
    name: fieldContext.name,
    id: itemContext.id,
    ...fieldState,
  };
};

/* ---------------------------------- */
/* Form Item */
/* ---------------------------------- */

type FormItemProps = {
  children: React.ReactNode;
  style?: any;
};

function FormItem({ children, style }: FormItemProps) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.item, style]}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

/* ---------------------------------- */
/* Form Label */
/* ---------------------------------- */

type FormLabelProps = {
  children: React.ReactNode;
  style?: any;
};

function FormLabel({ children, style }: FormLabelProps) {
  const { error } = useFormField();

  return (
    <Text
      style={[
        styles.label,
        error && styles.labelError,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/* ---------------------------------- */
/* Form Control */
/* ---------------------------------- */
/**
 * This is a logical wrapper.
 * You pass your TextInput / Switch / etc as children.
 */

type FormControlProps = {
  children: React.ReactNode;
};

function FormControl({ children }: FormControlProps) {
  return <>{children}</>;
}

/* ---------------------------------- */
/* Form Description */
/* ---------------------------------- */

type FormDescriptionProps = {
  children: React.ReactNode;
  style?: any;
};

function FormDescription({
  children,
  style,
}: FormDescriptionProps) {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
}

/* ---------------------------------- */
/* Form Message */
/* ---------------------------------- */

type FormMessageProps = {
  children?: React.ReactNode;
  style?: any;
};

function FormMessage({
  children,
  style,
}: FormMessageProps) {
  const { error } = useFormField();

  const message =
    error?.message?.toString() ?? children;

  if (!message) return null;

  return (
    <Text style={[styles.message, style]}>
      {message}
    </Text>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  item: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  labelError: {
    color: "#dc2626",
  },
  description: {
    fontSize: 13,
    color: "#666",
  },
  message: {
    fontSize: 13,
    color: "#dc2626",
  },
});

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
