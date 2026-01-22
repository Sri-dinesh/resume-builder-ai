import React from "react";

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
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
