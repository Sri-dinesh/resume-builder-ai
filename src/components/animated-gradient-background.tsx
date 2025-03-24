"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export default function AnimatedGradientBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {/* Base background color */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated gradient blobs */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 dark:opacity-20"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, rgba(138, 43, 226, 0) 70%)"
                  : "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, rgba(138, 43, 226, 0) 70%)",
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 dark:opacity-20"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(72, 61, 139, 0.3) 0%, rgba(72, 61, 139, 0) 70%)"
                  : "radial-gradient(circle, rgba(72, 61, 139, 0.15) 0%, rgba(72, 61, 139, 0) 70%)",
            }}
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 5,
            }}
          />

          <motion.div
            className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 rounded-full opacity-20 dark:opacity-15"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(123, 97, 255, 0.3) 0%, rgba(123, 97, 255, 0) 70%)"
                  : "radial-gradient(circle, rgba(123, 97, 255, 0.15) 0%, rgba(123, 97, 255, 0) 70%)",
            }}
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          />

          <motion.div
            className="absolute -bottom-1/3 left-1/4 w-1/2 h-1/2 rounded-full opacity-20 dark:opacity-15"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(90, 120, 255, 0.3) 0%, rgba(90, 120, 255, 0) 70%)"
                  : "radial-gradient(circle, rgba(90, 120, 255, 0.15) 0%, rgba(90, 120, 255, 0) 70%)",
            }}
            animate={{
              x: [0, 60, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 22,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 7,
            }}
          />
        </>
      )}

      {/* Static gradient for reduced motion */}
      {reducedMotion && (
        <>
          <div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 dark:opacity-20"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, rgba(138, 43, 226, 0) 70%)"
                  : "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, rgba(138, 43, 226, 0) 70%)",
            }}
          />

          <div
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 dark:opacity-20"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(72, 61, 139, 0.3) 0%, rgba(72, 61, 139, 0) 70%)"
                  : "radial-gradient(circle, rgba(72, 61, 139, 0.15) 0%, rgba(72, 61, 139, 0) 70%)",
            }}
          />
        </>
      )}

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

