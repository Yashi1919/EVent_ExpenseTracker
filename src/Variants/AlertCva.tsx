import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { cva, type VariantProps } from "class-variance-authority";

export const alertStyles = cva(["rounded-md", "px-4", "py-3"], {
  variants: {
    type: {
      success: ["text-green-800", "bg-green-50", "border-green-500"],
      danger: ["text-red-800", "bg-red-50", "border-red-500"],
      warning: ["text-yellow-800", "bg-yellow-50", "border-yellow-500"],
      info: ["text-blue-800", "bg-blue-50", "border-blue-500"],
    },
    size: {
      small: ["text-sm", "py-2"],
      medium: ["text-base", "py-3"],
      large: ["text-lg", "py-4"],
    },
    align: {
      left: ["text-left"],
      center: ["text-center"],
      right: ["text-right"],
    },
  },
  defaultVariants: {
    type: "info",
    size: "medium",
    align: "left",
  },
});

export interface AlertProps
  extends VariantProps<typeof alertStyles> {
  gradientColors?: string[]; // Gradient background colors
  children?: React.ReactNode; // Allow nested content
}

export interface AlertHeaderProps {
  title: string; // Header title
}

export interface AlertDescriptionProps {
  description: string; // Description text
}

export const Alert: React.FC<AlertProps> = ({
  children,
  gradientColors = ["#4c669f", "#3b5998"],
  size,
  ...props
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      style={{
        borderRadius: 8,
        paddingVertical: size === "small" ? 8 : size === "large" ? 16 : 12,
        paddingHorizontal: 16,
      }}
    >
      <View className={alertStyles({ ...props })}>
        {children}
      </View>
    </LinearGradient>
  );
};

export const AlertHeader: React.FC<AlertHeaderProps> = ({ title }) => {
  return (
    <Text className="text-white font-bold text-lg mb-2">
      {title}
    </Text>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  description,
}) => {
  return (
    <Text className="text-white text-base">
      {description}
    </Text>
  );
};
