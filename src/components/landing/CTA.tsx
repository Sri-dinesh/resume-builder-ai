"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export const LandingCTA = () => {
  return (
    <section className="relative w-full overflow-hidden px-4 py-20 md:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card/30 p-8 backdrop-blur-sm md:rounded-[3rem] md:p-24">
        <InteractiveGridPattern
          className="opacity-40 dark:opacity-20"
          width={40}
          height={40}
          squares={[30, 30]}
          squaresClassName="hover:fill-primary/20"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary md:mb-8"
          >
            Make an Impact
          </motion.div>

          <motion.h2 className="mb-6 font-serif text-4xl font-light leading-none tracking-tight text-foreground md:mb-8 md:text-7xl lg:text-8xl">
            Ready for your <br />
            <span className="italic text-primary">next chapter?</span>
          </motion.h2>

          <p className="mb-8 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:mb-12 md:text-xl">
            Build a Resume. Land Interviews. Get Hired. It's That Simple.
          </p>

          <Link
            href="/resumes"
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-lg font-bold text-background shadow-2xl transition-all hover:scale-105 active:scale-95 md:px-10 md:py-5 md:text-xl"
          >
            <span className="relative z-10">Build Now</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5 md:h-6 md:w-6" />

            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
