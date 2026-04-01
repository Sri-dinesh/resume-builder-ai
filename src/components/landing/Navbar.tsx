"use client";

import { cn } from "@/lib/utils";
import { Compass, Gem, LayoutGrid, Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type NavItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  targetId: string;
};

const navItems: NavItem[] = [
  {
    id: "home",
    icon: <Compass className="h-5 w-5" />,
    label: "Home",
    targetId: "home",
  },
  {
    id: "features",
    icon: <LayoutGrid className="h-5 w-5" />,
    label: "Features",
    targetId: "features",
  },
  {
    id: "pricing",
    icon: <Gem className="h-5 w-5" />,
    label: "Pricing",
    targetId: "pricing",
  },
  {
    id: "contact",
    icon: <Mail className="h-5 w-5" />,
    label: "Contact",
    targetId: "contact",
  },
];

export const LandingNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const observers: IntersectionObserver[] = [];

    navItems.forEach((item, index) => {
      const element = document.getElementById(item.targetId);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setActiveIndex(index);
            }
          },
          { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" },
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [mounted]);

  useLayoutEffect(() => {
    const limelight = limelightRef.current;
    const targetIndex =
      hoveredIndex !== null && hoveredIndex >= 0 ? hoveredIndex : activeIndex;
    const targetItem = navItemRefs.current[targetIndex];

    if (limelight && targetItem) {
      const newLeft =
        targetItem.offsetLeft +
        targetItem.offsetWidth / 2 -
        limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        requestAnimationFrame(() => setIsReady(true));
      }
    }
  }, [activeIndex, hoveredIndex, isReady]);

  const handleScroll = (targetId: string, index: number) => {
    setActiveIndex(index);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav
        onMouseLeave={() => setHoveredIndex(null)}
        className="pointer-events-auto relative inline-flex h-14 items-center rounded-2xl border border-border/20 bg-background/80 px-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:h-16 sm:px-3 md:h-20 md:px-4"
      >
        {navItems.map((item, index) => {
          const isActive = activeIndex === index;
          const isHovered = hoveredIndex === index;
          const showLabel = isActive || isHovered;

          return (
            <button
              key={item.id}
              ref={(el) => {
                navItemRefs.current[index] = el;
              }}
              className="group relative z-20 flex h-full w-12 cursor-pointer select-none flex-col items-center justify-center focus:outline-none sm:w-16 md:w-20"
              onClick={() => handleScroll(item.targetId, index)}
              onMouseEnter={() => setHoveredIndex(index)}
              aria-label={item.label}
            >
              <div
                className={cn(
                  "transform transition-all duration-300 ease-out",
                  showLabel
                    ? "-translate-y-1 sm:-translate-y-2 md:-translate-y-2.5"
                    : "translate-y-0",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {item.icon}
              </div>

              <div
                className={cn(
                  "absolute bottom-2 left-0 right-0 text-center transition-all duration-150 ease-out sm:bottom-2.5 md:bottom-3.5",
                  showLabel
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
              >
                <span className="text-[8px] font-bold uppercase tracking-wider text-foreground/90 sm:text-[9px] md:text-[10px]">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}

        <div className="mx-1 h-6 w-px bg-border/20 sm:mx-2 sm:h-8" />

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          onMouseEnter={() => setHoveredIndex(-1)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative z-20 flex h-full w-12 cursor-pointer select-none flex-col items-center justify-center focus:outline-none sm:w-16 md:w-20"
          aria-label="Toggle theme"
        >
          <div
            className={cn(
              "transform transition-all duration-300 ease-out",
              hoveredIndex === -1
                ? "-translate-y-1 sm:-translate-y-2 md:-translate-y-2.5"
                : "translate-y-0",
              "text-muted-foreground group-hover:text-foreground",
            )}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </div>

          <div
            className={cn(
              "absolute bottom-2 left-0 right-0 text-center transition-all duration-150 ease-out sm:bottom-2.5 md:bottom-3.5",
              hoveredIndex === -1
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0",
            )}
          >
            <span className="text-[8px] font-bold uppercase tracking-wider text-foreground/90 sm:text-[9px] md:text-[10px]">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </div>
        </button>

        <div
          ref={limelightRef}
          className={cn(
            "absolute top-0 z-10 h-[2px] w-8 rounded-b-lg bg-primary shadow-[0_2px_12px_0px_hsl(var(--primary)_/_0.5)] sm:h-[2.5px] sm:w-10 md:h-[3px] md:w-12",
            isReady
              ? "ease-[cubic-bezier(0.32\,0.72\,0\,1)] transition-[left] duration-300"
              : "opacity-0",
          )}
          style={{ left: "0px" }}
        >
          <div className="pointer-events-none absolute left-[-50%] top-[2px] h-8 w-[200%] bg-gradient-to-b from-primary/15 to-transparent blur-[8px] [clip-path:polygon(30%_0,70%_0,100%_100%,0%_100%)] sm:top-[2.5px] sm:h-10 md:top-[3px] md:h-12" />
        </div>
      </nav>
    </div>
  );
};
