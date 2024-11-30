import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export const buttonStyles = cva(["font-semibold", "rounded-full"], {
  variants: {
    intent: {
      primary: ["text-white", "border-transparent", "hover:opacity-90"],
      secondary: ["bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
    },
    size: {
      small: ["text-sm", "py-1", "px-4"],
      medium: ["text-base", "py-2", "px-6"],
      large: ["text-lg", "py-3", "px-8"],
    },
    textColor: {
      default: "text-white",
      gray: "text-gray-500",
      black: "text-black",
      blue: "text-blue-500",
    },
    bold: {
      true: "font-bold",
      false: "font-normal",
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "medium",
      class: "uppercase",
    },
  ],
  defaultVariants: {
    intent: "primary",
    size: "medium",
    textColor: "default",
    bold: "false",
  },
});

export interface ButtonProps
  extends VariantProps<typeof buttonStyles>,
    React.ComponentProps<typeof Pressable> {
  label: string;
  gradientColors?: string[];
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  intent,
  size,
  textColor,
  bold,
  label,
  className,
  gradientColors = ["#4c669f", "#3b5998", "#192f6a"],
  onPress,
  ...props
}) => {
  return (
    <Pressable onPress={onPress} {...props} className={className}>
      <LinearGradient
        colors={intent === "primary" ? gradientColors : ["#ffffff", "#f0f0f0"]}
        style={[
          {
            borderRadius: 9999,
            paddingVertical: size === "small" ? 8 : size === "large" ? 16 : 12,
            paddingHorizontal: size === "small" ? 16 : size === "large" ? 24 : 20,
            marginTop:5
          },
        ]}
      >
        <Text
          className={buttonStyles({ intent, size, textColor, bold })}
          style={{ textAlign: "center" ,color:"white",fontWeight:"bold"}}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};
