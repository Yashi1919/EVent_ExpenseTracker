import React from "react";
import { TextInput, View, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

export const inputStyles = cva(["rounded-md", "border", "px-4", "py-2"], {
  variants: {
    size: {
      small: ["text-sm", "h-10"],
      medium: ["text-base", "h-12"],
      large: ["text-lg", "h-14"],
    },
    intent: {
      default: ["border-gray-300", "bg-white", "text-gray-800"],
      primary: [
        "border-blue-500",
        "bg-blue-50",
        "text-blue-800",
        "focus:ring-2",
        "focus:ring-blue-500",
      ],
      danger: [
        "border-red-500",
        "bg-red-50",
        "text-red-800",
        "focus:ring-2",
        "focus:ring-red-500",
      ],
    },
    theme: {
      light: ["bg-white", "text-gray-800", "border-gray-300"],
      dark: ["bg-gray-800", "text-white", "border-gray-600"],
      custom: [], // For custom themes, styles can be added via `className`
    },
    disabled: {
      true: ["bg-gray-100", "text-gray-500", "border-gray-300"],
      false: [],
    },
    hasError: {
      true: ["border-red-500", "text-red-800", "bg-red-50"],
      false: [],
    },
  },
  defaultVariants: {
    size: "medium",
    intent: "default",
    theme: "light",
    disabled: "false",
    hasError: "false",
  },
});

export interface InputProps
  extends VariantProps<typeof inputStyles>,
    React.ComponentProps<typeof TextInput> {
  label?: string; // Optional label for the input
  errorMessage?: string; // Error message to display
  theme?: "light" | "dark" | "custom"; // Theme variant
}

export const Input: React.FC<InputProps> = ({
  size,
  intent,
  theme,
  disabled,
  hasError,
  label,
  errorMessage,
  style,
  className,
  ...props
}) => {
  return (
    <>
      <TextInput
        editable={!disabled}
        className={inputStyles({ size, intent, theme, disabled, hasError, className })}
        style={style}
        {...props}
      />
      {hasError && errorMessage && (
        <Text className="mt-1 text-sm text-red-500">{errorMessage}</Text>
      )}
      </>
  );
};
