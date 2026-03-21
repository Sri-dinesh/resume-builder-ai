"use client";

import React, { useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { MagneticButtonProps } from "../types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      strength = 12, // Extremely subtle for a premium feel
      isLoading = false,
      leftIcon,
      rightIcon,
      style,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ultra-smooth spring physics
    const springConfig = { damping: 30, stiffness: 200, mass: 0.6 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!internalRef.current || isLoading) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = internalRef.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const pullX = (clientX - centerX) / (width / strength);
        const pullY = (clientY - centerY) / (height / strength);

        mouseX.set(pullX);
        mouseY.set(pullY);
      },
      [strength, mouseX, mouseY, isLoading]
    );

    const handleMouseLeave = useCallback(() => {
      mouseX.set(0);
      mouseY.set(0);
    }, [mouseX, mouseY]);

    const variants = {
      primary: cn(
        "bg-primary text-primary-foreground border-transparent",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.05)]",
        "hover:bg-primary/95 hover:shadow-[0_8px_16px_-4px_rgba(var(--primary),0.2)]",
        "active:scale-[0.985]"
      ),
      secondary: cn(
        "bg-secondary text-secondary-foreground border-transparent",
        "hover:bg-secondary/80",
        "active:scale-[0.985]"
      ),
      outline: cn(
        "border border-border bg-background text-foreground",
        "hover:border-primary/30 hover:bg-primary/[0.02]",
        "active:scale-[0.985]"
      ),
      ghost: cn(
        "bg-transparent text-foreground",
        "hover:bg-secondary/50",
        "active:scale-[0.985]"
      ),
    };

    const sizes = {
      sm: "h-10 px-5 text-xs font-medium rounded-lg",
      md: "h-12 px-7 text-sm font-medium rounded-xl tracking-tight",
      lg: "h-14 px-9 text-base font-medium rounded-2xl tracking-tight",
    };

    return (
      <motion.button
        ref={internalRef}
        className={cn(
          "group relative inline-flex items-center justify-center transition-all duration-200 select-none border whitespace-nowrap",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1",
          variants[variant],
          sizes[size],
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y, ...style }}
        {...props}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-inherit rounded-[inherit]">
            <Loader2 className="h-4 w-4 animate-spin opacity-70" />
          </div>
        )}

        {/* Content Wrapper */}
        <span className={cn(
          "relative z-10 flex items-center gap-2.5 transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100"
        )}>
          {leftIcon && (
            <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
              {rightIcon}
            </span>
          )}
        </span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
