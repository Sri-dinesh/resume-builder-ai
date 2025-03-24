"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past the hero section
      const scrollPosition = window.scrollY
      const heroHeight = window.innerHeight * 0.8

      setVisible(scrollPosition > heroHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGetStarted = () => {
    toast({
      title: "Let's get started!",
      description: "You're on your way to creating a professional resume.",
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 py-4 bg-background/80 backdrop-blur-md border-t border-border/50 shadow-lg"
          role="complementary"
          aria-label="Call to action"
        >
          <div className="absolute left-10 top-0 w-12 h-12 bg-primary/5 rounded-full blur-xl" aria-hidden="true"></div>
          <div
            className="absolute right-10 bottom-0 w-16 h-16 bg-violet-500/5 rounded-full blur-xl"
            aria-hidden="true"
          ></div>
          <div className="container px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <div className="text-center sm:text-left">
              <p className="font-medium">Ready to build your professional resume?</p>
              <p className="text-sm text-muted-foreground">Start for free, no credit card required</p>
            </div>

            <div
              className="hidden md:block absolute left-[15%] -top-3 w-6 h-8 border border-primary/20 rounded-sm rotate-12 opacity-30"
              aria-hidden="true"
            ></div>
            <div
              className="hidden md:block absolute right-[15%] -bottom-3 w-6 h-8 border border-primary/20 rounded-sm -rotate-6 opacity-30"
              aria-hidden="true"
            ></div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="relative overflow-hidden group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={handleGetStarted}
              >
                <span className="relative z-10 flex items-center">
                  Get Started Now
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 dark:to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

