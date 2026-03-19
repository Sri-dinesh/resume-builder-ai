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
    <section className="w-full py-12">
      <div className="mb-12 text-center md:text-left">
        <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Everything you need.{" "}
          <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Nothing you don&apos;t
          </span>
          .
        </h2>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Resume builder, cover letter generator, and scorer. All in one place.
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
