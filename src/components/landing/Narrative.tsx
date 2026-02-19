"use client";

import React from "react";
import { motion } from "framer-motion";
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
            "border border-border/80 bg-gradient-to-b from-card/60 to-card/30 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-sm",
            "dark:border-border/50 dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent dark:shadow-none",
          )}
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">
              The Reality
            </span>

            <h3 className="mb-6 font-serif text-3xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
              The blank page is <br className="hidden sm:block" />
              <span className="italic text-primary/80">lying to you.</span>
            </h3>

            <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              You&apos;re qualified, but an empty document makes you
              second-guess your value.
              <span className="text-foreground/80">
                {" "}
                Don&apos;t let the friction of starting be the barrier to your
                next big move.
              </span>
            </p>

            <div className="grid w-full grid-cols-1 gap-6 border-t border-border/80 pt-8 dark:border-border/50 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
                  The Problem
                </span>
                <p className="text-sm text-muted-foreground">
                  Second-guessing your impact.
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:border-l sm:border-border/80 sm:pl-6 dark:sm:border-border/50">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
                  The Solution
                </span>
                <p className="text-sm text-muted-foreground">
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
