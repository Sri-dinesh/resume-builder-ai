"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTryFree = () => {
    toast({
      title: "Free trial activated!",
      description:
        "Welcome to SparkCV. Start building your professional resume now.",
      variant: "default",
    });
    router.push("/resumes");
  };

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-2 z-50 flex justify-center px-4 sm:top-4">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`pointer-events-auto w-fit max-w-full rounded-full transition-all duration-300 ${
          scrolled
            ? "border border-border/40 bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/80"
            : "bg-background/80 backdrop-blur-md"
        }`}
      >
        <div className="flex h-12 items-center px-3 sm:px-4 md:px-6">
          <Link
            href="/"
            className="group mr-2 flex items-center space-x-2 sm:mr-4"
            aria-label="SparkCV"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <motion.span
              className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-base font-bold text-transparent sm:text-lg"
              // whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              SparkCV
            </motion.span>
          </Link>

          <nav className="hidden items-center space-x-3 text-sm font-medium md:flex lg:space-x-4">
            {[
              { name: "Features", href: "#features" },
              { name: "Pricing", href: "#pricing" },
              // { name: "Testimonials", href: "#testimonials" },
              { name: "Contact", href: "#contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative rounded-md px-2 py-1 transition-colors hover:text-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span>{item.name}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* <div className="ml-auto flex items-center space-x-2">
            <motion.div
              className="hidden md:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="rounded-3xl bg-primary transition-all duration-300 hover:bg-primary/90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ml-4"
                onClick={handleTryFree}
              >
                Try Free
              </Button>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div> */}
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed left-4 right-4 top-16 z-50 rounded-lg border border-border/10 bg-background/95 shadow-lg backdrop-blur"
          >
            <div className="space-y-4 p-4">
              <nav className="flex flex-col space-y-2 text-sm font-medium">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Testimonials", href: "#testimonials" },
                  { name: "Contact", href: "#contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="rounded-md px-2 py-1.5 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border/10 pt-2">
                <Button
                  size="sm"
                  className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onClick={() => {
                    handleTryFree();
                    setMobileMenuOpen(false);
                  }}
                >
                  Try For Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
