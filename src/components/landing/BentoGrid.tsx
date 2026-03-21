"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

import AIContentWidget from "./bento/AIContentWidget";
import RealTimeWidget from "./bento/RealTimeWidget";
import CustomizationWidget from "./bento/CustomizationWidget";
import CoverLetterWidget from "./bento/CoverLetterWidget";
import ATSScoreWidget from "./bento/ATSScoreWidget";
import SpeedWidget from "./bento/SpeedWidget";

const BentoCard = ({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/20 bg-card backdrop-blur-sm",
        colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
        rowSpan === 2 ? "md:row-span-2" : "md:row-span-1",
        className,
      )}
    >
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

export const BentoGrid: React.FC = () => {
  return (
    <section className="w-full pb-24">
      <div className="mx-auto mb-16 text-center">
        <h2 className="font-['Syne'] text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Engineered for your{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            next move.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg lg:text-xl">
          Precision tools to craft, optimize, and land your next role instantly.
        </p>
      </div>

      <div className="grid auto-rows-[320px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BentoCard colSpan={2}>
          <RealTimeWidget />
        </BentoCard>
        <BentoCard>
          <AIContentWidget />
        </BentoCard>
        <BentoCard rowSpan={2}>
          <CoverLetterWidget />
        </BentoCard>
        <BentoCard>
          <SpeedWidget />
        </BentoCard>
        <BentoCard>
          <CustomizationWidget />
        </BentoCard>
        <BentoCard>
          <ATSScoreWidget />
        </BentoCard>
      </div>
    </section>
  );
};
