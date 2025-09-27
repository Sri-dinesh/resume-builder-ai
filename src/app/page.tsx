"use client";

import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import ResumePreview from "@/components/ResumePreview";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import StickyCTA from "@/components/sticky-cta";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import ContactForm from "@/components/contact-form";

export default function Home() {
  // Enable smooth scrolling
  useEffect(() => {
    // Add smooth scrolling behavior for anchor links
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
          {/* <ResumePreview /> */}
          <Pricing />
          <Testimonials />
          <ContactForm />
        </main>
        {/* <StickyCTA /> */}
        <Footer />
      </div>
      {/* <div className="relative min-h-screen">
        <ParticleBackground />
      </div> */}
      <Toaster />

      {/* Structured data for SEO */}
      <Script
        id="schema-org"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ResumeAI",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "operatingSystem": "Web",
            "description": "AI-powered resume builder helping professionals land their dream jobs."
          }
        `}
      </Script>
    </>
  );
}
