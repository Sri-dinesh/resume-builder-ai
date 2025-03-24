"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function ParallaxBackground() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const { scrollY } = useScroll()

  // Parallax transformations
  const y1 = useTransform(scrollY, [0, 3000], [0, -300])
  const y2 = useTransform(scrollY, [0, 3000], [0, -600])
  const y3 = useTransform(scrollY, [0, 3000], [0, -900])
  const opacity1 = useTransform(scrollY, [0, 1000], [0.6, 0])
  const opacity2 = useTransform(scrollY, [500, 1500], [0, 0.6])
  const opacity3 = useTransform(scrollY, [1500, 2500], [0, 0.6])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      {/* Parallax shapes */}
      <motion.div
        className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y1, opacity: opacity1 }}
      />

      <motion.div
        className="absolute top-[60%] right-[15%] w-80 h-80 rounded-full bg-violet-500/5 dark:bg-indigo-500/5 blur-3xl"
        style={{ y: y1, opacity: opacity1 }}
      />

      <motion.div
        className="absolute top-[120%] left-[25%] w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"
        style={{ y: y2, opacity: opacity2 }}
      />

      <motion.div
        className="absolute top-[150%] right-[20%] w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"
        style={{ y: y2, opacity: opacity2 }}
      />

      <motion.div
        className="absolute top-[220%] left-[15%] w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"
        style={{ y: y3, opacity: opacity3 }}
      />

      <motion.div
        className="absolute top-[250%] right-[10%] w-64 h-64 rounded-full bg-violet-500/5 blur-3xl"
        style={{ y: y3, opacity: opacity3 }}
      />
    </div>
  )
}

