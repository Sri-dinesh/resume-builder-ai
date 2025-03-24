"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, stagger } from "@/lib/animations";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Spline from "@splinetool/react-spline";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [fallbackShown, setFallbackShown] = useState(false);

  const router = useRouter();

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  // Fallback for Spline if it takes too long to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!splineLoaded) {
        setFallbackShown(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [splineLoaded]);

  const benefits = [
    "AI-powered content generation",
    "ATS-friendly format",
    "Real-time preview",
  ];

  return (
    <section
      className="relative overflow-hidden pb-12 pt-24 md:pb-20 md:pt-32 lg:pb-24 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className={cn(
            "absolute inset-0 opacity-80",
            "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
            "from-primary/20 via-background to-background",
          )}
        />
        <div className="absolute -z-10">
          {/* Abstract document shapes */}
          <div
            className="absolute right-[10%] top-20 hidden h-16 w-12 rotate-12 rounded-md border-2 border-primary/20 opacity-40 lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute right-[8%] top-32 hidden h-14 w-10 -rotate-6 rounded-md border-2 border-violet-500/20 opacity-30 lg:block"
            aria-hidden="true"
          />

          {/* AI nodes */}
          <div
            className="absolute bottom-20 left-[5%] h-3 w-3 animate-pulse rounded-full bg-primary/30"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-28 left-[8%] h-2 w-2 animate-pulse rounded-full bg-violet-500/30"
            style={{ animationDelay: "0.5s" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-24 left-[12%] h-4 w-4 animate-pulse rounded-full bg-indigo-500/30"
            style={{ animationDelay: "1s" }}
            aria-hidden="true"
          />

          {/* Connecting lines */}
          <div
            className="absolute bottom-24 left-[6%] hidden h-[1px] w-[100px] rotate-[30deg] bg-primary/20 md:block"
            aria-hidden="true"
          />
          <div
            className="bottom-26 absolute left-[9%] hidden h-[1px] w-[60px] rotate-[-20deg] bg-violet-500/20 md:block"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column - Text content */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col space-y-6 text-center lg:text-left"
          >
            <motion.div
              variants={fadeIn}
              className="flex justify-center lg:justify-start"
            >
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
              className="mx-auto max-w-md text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              Stand out from the crowd with our AI-powered resume builder. Get
              hired faster with tailored content and ATS-optimized templates.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
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
              {/* <Button
                variant="outline"
                size="lg"
                className="group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                View Templates
              </Button> */}
            </motion.div>

            <motion.div variants={fadeIn} className="pt-4">
              <ul className="flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-8 lg:justify-start">
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

          {/* Right column - 3D Spline Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bottom-12 mx-auto hidden h-[700px] w-full lg:block"
          >
            <div
              className="absolute right-5 top-5 z-10 flex animate-pulse items-center space-x-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>SparK</span>
            </div>

            {/* Loading placeholder */}
            {!splineLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: splineLoaded ? 0 : 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-lg border border-primary/20 bg-gradient-to-tr from-primary/5 to-violet-500/5"
                aria-hidden="true"
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading 3D Resume...</p>
                </div>
              </motion.div>
            )}

            {/* Fallback image if Spline takes too long to load */}
            {fallbackShown && !splineLoaded && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg border border-primary/20">
                <Image
                  src="/placeholder.svg?height=500&width=500&text=Resume+Preview"
                  alt="Resume preview"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            )}

            {/* Spline 3D model */}
            <div
              className={`absolute inset-0 overflow-hidden rounded-lg transition-opacity duration-500 ${
                splineLoaded ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!splineLoaded}
            >
              <Spline
                scene="https://prod.spline.design/1ae0GADE6VCYShP1/scene.splinecode"
                onLoad={() => setSplineLoaded(true)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
