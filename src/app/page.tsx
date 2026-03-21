"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import {
  LandingHero,
  Narrative,
  BentoGrid,
  LandingNavbar,
  LandingPricing,
  LandingCTA,
  LandingContact,
  LandingFooter,
  ScrollToTop,
} from "@/components/landing";

export default function Home() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        if (targetId && targetId !== "#") {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <>
      <div className="relative flex min-h-screen flex-col transition-colors duration-500 selection:bg-primary/30 selection:text-foreground">
        <LandingNavbar />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-grow flex-col px-6 md:px-12">
          <main className="flex flex-col gap-32 pb-20">
            <section id="home" className="scroll-mt-[120px]">
              <LandingHero />
            </section>

            <section id="narrative" className="scroll-mt-[100px]">
              <Narrative />
            </section>

            <section id="features" className="scroll-mt-20">
              <BentoGrid />
            </section>

            <section id="pricing" className="scroll-mt-[10px]">
              <LandingPricing />
            </section>

            <section id="contact" className="scroll-mt-31">
              <LandingContact />
            </section>

            <LandingCTA />
          </main>
        </div>

        <LandingFooter />
        <ScrollToTop />
      </div>
      <Toaster />
    </>
  );
}
