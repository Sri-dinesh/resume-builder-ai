"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  shapeType?: number // -1: circle, 0: document, 1: gear, 2: code
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth
      canvas.height = innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      // Further reduce particle count for better performance
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.02), 40)

      for (let i = 0; i < particleCount; i++) {
        const isDark = theme === "dark"

        // Determine if this should be a special shaped particle (document, gear, etc)
        const isSpecialShape = Math.random() < 0.15 // 15% chance for special shapes
        const shapeType = isSpecialShape ? Math.floor(Math.random() * 3) : -1 // 0: document, 1: gear, 2: code

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isSpecialShape ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.2, // Reduced speed
          speedY: (Math.random() - 0.5) * 0.2, // Reduced speed
          opacity: Math.random() * 0.5 + 0.1,
          color: isDark
            ? `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
            : `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.05})`,
          shapeType: shapeType,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        if (particle.shapeType === -1) {
          // Regular circle particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        } else if (particle.shapeType === 0) {
          // Document shape
          ctx.fillStyle = particle.color
          ctx.fillRect(particle.x, particle.y, particle.size * 1.5, particle.size * 2)
          // Document lines
          ctx.beginPath()
          ctx.moveTo(particle.x + particle.size * 0.3, particle.y + particle.size * 0.5)
          ctx.lineTo(particle.x + particle.size * 1.2, particle.y + particle.size * 0.5)
          ctx.strokeStyle = particle.color
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(particle.x + particle.size * 0.3, particle.y + particle.size)
          ctx.lineTo(particle.x + particle.size * 1.2, particle.y + particle.size)
          ctx.stroke()
        } else if (particle.shapeType === 1) {
          // Gear/cog shape (simplified)
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.strokeStyle = particle.color
          ctx.stroke()
        } else if (particle.shapeType === 2) {
          // Code bracket shape
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size)
          ctx.lineTo(particle.x, particle.y + particle.size * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(particle.x + particle.size * 2, particle.y)
          ctx.lineTo(particle.x + particle.size * 3, particle.y + particle.size)
          ctx.lineTo(particle.x + particle.size * 2, particle.y + particle.size * 2)
          ctx.stroke()
        }

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })

      // Draw connections between nearby particles (optimized)
      // Only check every third particle to improve performance
      for (let i = 0; i < particles.length; i += 3) {
        for (let j = i + 3; j < particles.length; j += 3) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            // Reduced connection distance
            ctx.beginPath()
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 80)})`
                : `rgba(0, 0, 0, ${0.05 * (1 - distance / 80)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    // Check if device is low-powered (like mobile)
    const isLowPoweredDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Only run animation if not a low-powered device
    if (!isLowPoweredDevice) {
      drawParticles()
    } else {
      // For low-powered devices, just draw static particles without animation
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" aria-hidden="true" />
}

