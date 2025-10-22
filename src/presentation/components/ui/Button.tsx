import { ButtonProps, Button as UIKittenButton } from "@ui-kitten/components";
import React from "react";

interface CustomButtonProps extends Omit<ButtonProps, "children"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "tiny" | "small" | "medium" | "large" | "giant";
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  ...props
}: CustomButtonProps) {
  const getAppearance = () => {
    switch (variant) {
      case "secondary":
        return "filled";
      case "outline":
        return "outline";
      case "ghost":
        return "ghost";
      default:
        return "filled";
    }
  };

  const getStatus = () => {
    switch (variant) {
      case "secondary":
        return "basic";
      default:
        return "primary";
    }
  };

  return (
    <UIKittenButton
      appearance={getAppearance()}
      status={getStatus()}
      size={size}
      {...props}
    >
      {title}
    </UIKittenButton>
  );
}
