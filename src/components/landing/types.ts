import React from "react";
import { HTMLMotionProps } from "framer-motion";

export interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  strength?: number;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  subtitle?: string;
}

export type Theme = {
  id: string;
  name: string;
  type: "dark" | "light";
  colors: {
    bg: string;
    surface: string;
    primary: string;
    textMain: string;
    textMuted: string;
    border: string;
  };
};
