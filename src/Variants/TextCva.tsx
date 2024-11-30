import React from "react";
import Svg, { Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg";
import { cva, type VariantProps } from "class-variance-authority";

export const textStyles = cva(["font-medium"], {
  variants: {
    size: {
      small: ["text-sm"],
      medium: ["text-base"],
      large: ["text-lg"],
    },
    weight: {
      light: ["font-light"],
      normal: ["font-normal"],
      bold: ["font-bold"],
      extrabold: ["font-extrabold"],
    },
    align: {
      left: ["text-left"],
      center: ["text-center"],
      right: ["text-right"],
    },
  },
  defaultVariants: {
    size: "medium",
    weight: "normal",
    align: "left",
  },
});

export interface GradientTextProps
  extends VariantProps<typeof textStyles> {
  colors?: string[]; // Gradient colors
  fontSize?: number; // Custom font size
  fontWeight?: string; // Custom font weight
  children: string; // Text content
  width?: number; // Text width for alignment
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  size,
  weight,
  align = "left",
  colors = ["#4c669f", "#3b5998", "#192f6a"],
  fontSize = 16,
  fontWeight = "normal",
  width = 200,
  ...props
}) => {
  return (
    <Svg height={fontSize * 1.5} width={width}>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {colors.map((color, index) => (
            <Stop key={index} offset={`${(index / (colors.length - 1)) * 100}%`} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <SvgText
        fill="url(#gradient)" // Apply gradient as text color
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor={align === "center" ? "middle" : align === "right" ? "end" : "start"}
        x={align === "center" ? width / 2 : align === "right" ? width : 0}
        y={fontSize}
        {...props}
      >
        {children}
      </SvgText>
    </Svg>
  );
};
