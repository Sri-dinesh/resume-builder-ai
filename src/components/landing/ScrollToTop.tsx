"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll();

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const toggleVisibility = () => {
      if (typeof window !== "undefined") {
        setIsVisible(window.scrollY > 400);
      }
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } =
      buttonRef.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    mouseX.set((clientX - centerX) * 0.35);
    mouseY.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <motion.button
            ref={buttonRef}
            style={{
              x: magneticX,
              y: magneticY,
            }}
            whileTap={{ scale: 0.85 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={scrollToTop}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              "bg-background/40 backdrop-blur-2xl",
              "border border-primary/20",
              "shadow-[0_15px_35px_-5px_rgba(0,0,0,0.2),0_5px_15px_-5px_rgba(0,0,0,0.1)]",
              "dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(var(--primary),0.05)]",
              "group overflow-hidden transition-colors duration-500",
              "hover:border-primary/50",
            )}
            aria-label="Scroll to top"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-primary/5 dark:text-primary/10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ pathLength }}
                className="text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
              />
            </svg>

            <div className="pointer-events-none absolute inset-[1px] rounded-full border border-white/20 dark:border-white/5" />

            <motion.div
              className="relative z-10"
              animate={isHovered ? { y: -4 } : { y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowUp
                  className="h-6 w-6 text-foreground/80 transition-colors duration-300 group-hover:text-primary"
                  strokeWidth={1.5}
                />
              </motion.div>
            </motion.div>

            <div className="absolute inset-0 translate-x-[-100%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
