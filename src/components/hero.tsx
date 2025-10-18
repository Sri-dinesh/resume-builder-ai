"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, stagger } from "@/lib/animations";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LightRays from "./LightRays"; 

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);


  const benefits = [
    "AI-powered content generation",
    "ATS-friendly format",
    "Real-time preview",
  ];

  if (!mounted) {
    return null;
  }

  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 pb-12 pt-24 sm:px-6 md:pt-32 lg:px-8 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#6366f1"
          raysSpeed={0.5}
          lightSpread={1}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.05}
          distortion={0.03}
          pulsating={true}
          fadeDistance={0.9}
          saturation={0.9}
          className="w-full h-full"
        />
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="flex max-w-3xl flex-col items-center space-y-6 text-center"
      >
        <motion.div variants={fadeIn}>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            <Sparkles
              className="mr-2 h-4 w-4 animate-[pulse_2s_ease-in-out_infinite]"
              aria-hidden="true"
            />
            <span className="text-white">AI-Powered Resume Builder</span>
          </span>
        </motion.div>

        <motion.h1
          id="hero-heading"
          variants={fadeIn}
          style={{ maxWidth: '85ch', lineHeight: '1.1' }}
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"

        >
          Create a{" "}
          <span className="bg-gradient-to-r from-primary to-violet-100 bg-clip-text text-transparent dark:to-indigo-300">
            professional resume
          </span>{" "}
          in minutes with AI
        </motion.h1>

        <motion.p
          variants={fadeIn}
          className="text-base text-muted-foreground sm:text-lg"
        >
          Stand out from the crowd with our AI-powered resume builder. Get hired
          faster with tailored content and ATS-optimized templates.
        </motion.p>

        <motion.div variants={fadeIn} className="pt-2">
          <Button
            size="lg"
            onClick={() => router.push("/editor")}
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="relative z-10 flex items-center">
              Build Your Resume
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-indigo-500"
              aria-hidden="true"
            />
          </Button>
        </motion.div>

        <motion.div variants={fadeIn} className="pt-4">
          <ul className="flex flex-wrap justify-center gap-4 text-sm sm:gap-6">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}