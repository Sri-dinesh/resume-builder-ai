"use client";

import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import ContactForm from "@/components/contact-form";

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
      <div className="relative z-10 flex flex-col items-center justify-center">
        <Navbar />
        <main className="">
          <Hero />
          <Features />
          <Pricing />
          <ContactForm />
        </main>
        {/* <StickyCTA /> */}
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
