"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { MagneticButton } from "./ui/MagneticButton";

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
            Build a Resume. Land Interviews. Get Hired. It&apos;s That Simple.
          </p>

          <Link href="/resumes">
            <MagneticButton
              variant="primary"
              size="lg"
              className="px-12 md:px-14 font-semibold"
              rightIcon={<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />}
            >
              Build Now
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
