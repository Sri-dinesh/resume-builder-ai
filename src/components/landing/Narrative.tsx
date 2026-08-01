"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

export const Narrative: React.FC = () => {
  return (
    <section className="relative w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={cn(
            "relative overflow-hidden rounded-[2rem] p-8 md:p-12",
            "border-border/80 from-card/60 to-card/30 border bg-gradient-to-b shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-sm",
            "dark:border-border/50 dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent dark:shadow-none",
          )}
        >
          <div className="bg-primary/5 absolute -top-4 -right-4 h-24 w-24 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-primary/60 mb-6 text-[10px] font-bold tracking-[0.4em] uppercase">
              The Reality
            </span>

            <h3 className="text-foreground mb-6 font-serif text-3xl leading-tight font-light tracking-tight md:text-5xl">
              The blank page is <br className="hidden sm:block" />
              <span className="text-primary/80 italic">lying to you.</span>
            </h3>

            <p className="text-muted-foreground mb-8 max-w-2xl text-base leading-relaxed md:text-lg">
              You&apos;re qualified, but an empty document makes you
              second-guess your value.
              <span className="text-foreground/80">
                {" "}
                Don&apos;t let the friction of starting be the barrier to your
                next big move.
              </span>
            </p>

            <div className="border-border/80 dark:border-border/50 grid w-full grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-primary/70 text-xs font-bold tracking-widest uppercase">
                  The Problem
                </span>
                <p className="text-muted-foreground text-sm">
                  Second-guessing your impact.
                </p>
              </div>
              <div className="sm:border-border/80 dark:sm:border-border/50 flex flex-col gap-1 sm:border-l sm:pl-6">
                <span className="text-primary/70 text-xs font-bold tracking-widest uppercase">
                  The Solution
                </span>
                <p className="text-muted-foreground text-sm">
                  AI that translates your talent.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
