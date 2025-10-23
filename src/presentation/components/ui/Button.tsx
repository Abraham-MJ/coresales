import React from "react";
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { Text } from "./Text";

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps) {

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 25,
      paddingVertical: size === "small" ? 12 : size === "large" ? 20 : 16,
      paddingHorizontal: 32,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "white",
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: "white",
          elevation: 0,
          shadowOpacity: 0,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case "primary":
        return "#00D4AA";
      case "secondary":
      case "outline":
      case "ghost":
        return "white";
      default:
        return "#00D4AA";
    }
  };

  const buttonStyle = [
    getButtonStyle(),
    disabled && styles.disabled,
    style,
  ];

  const finalTextStyle = [
    {
      color: getTextColor(),
      fontSize: size === "small" ? 14 : size === "large" ? 18 : 16,
      fontWeight: "600" as const,
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={finalTextStyle} >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
