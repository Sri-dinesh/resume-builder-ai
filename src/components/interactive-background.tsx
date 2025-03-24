// "use client";

// import { useRef, useEffect, useState } from "react";
// import { useTheme } from "next-themes";
// import { motion } from "framer-motion";
// import { useMousePosition } from "@/hooks/use-mouse-position";

// type BackgroundConfig = {
//   particleCount: number;
//   particleSize: [number, number];
//   particleSpeed: number;
//   connectionDistance: number;
//   colors: {
//     particles: string;
//     connections: string;
//     glowOrbs: string[];
//     accent1: string;
//     accent2: string;
//   };
// };

// export default function InteractiveBackground() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const { theme } = useTheme();
//   const mousePosition = useMousePosition();
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
//   const [reducedMotion, setReducedMotion] = useState(false);

//   // Check for reduced motion preference
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReducedMotion(mediaQuery.matches);

//     const handleChange = () => setReducedMotion(mediaQuery.matches);
//     mediaQuery.addEventListener("change", handleChange);
//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, []);

//   // Configure background based on theme
//   const getConfig = (): BackgroundConfig => {
//     return {
//       particleCount: Math.min(Math.floor(dimensions.width * 0.05), 120),
//       particleSize: [0.5, 2],
//       particleSpeed: reducedMotion ? 0.05 : 0.2,
//       connectionDistance: 120,
//       colors:
//         theme === "dark"
//           ? {
//               particles: "rgba(255, 255, 255, 0.2)",
//               connections: "rgba(255, 255, 255, 0.07)",
//               glowOrbs: [
//                 "rgba(125, 125, 255, 0.4)",
//                 "rgba(200, 100, 255, 0.3)",
//                 "rgba(90, 200, 255, 0.3)",
//               ],
//               accent1: "rgba(138, 43, 226, 0.2)",
//               accent2: "rgba(72, 61, 139, 0.2)",
//             }
//           : {
//               particles: "rgba(0, 0, 0, 0.1)",
//               connections: "rgba(0, 0, 0, 0.03)",
//               glowOrbs: [
//                 "rgba(100, 100, 255, 0.15)",
//                 "rgba(180, 80, 255, 0.1)",
//                 "rgba(70, 180, 255, 0.1)",
//               ],
//               accent1: "rgba(138, 43, 226, 0.1)",
//               accent2: "rgba(72, 61, 139, 0.1)",
//             },
//     };
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setDimensions({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || dimensions.width === 0) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Set canvas dimensions
//     canvas.width = dimensions.width;
//     canvas.height = dimensions.height;

//     const config = getConfig();

//     // Particle system
//     class Particle {
//       x: number;
//       y: number;
//       size: number;
//       speedX: number;
//       speedY: number;
//       originalSpeedX: number;
//       originalSpeedY: number;

//       constructor() {
//         this.x = Math.random() * canvas!.width;
//         this.y = Math.random() * canvas!.height;
//         this.size =
//           Math.random() * (config.particleSize[1] - config.particleSize[0]) +
//           config.particleSize[0];
//         this.speedX = (Math.random() - 0.5) * config.particleSpeed;
//         this.speedY = (Math.random() - 0.5) * config.particleSpeed;
//         this.originalSpeedX = this.speedX;
//         this.originalSpeedY = this.speedY;
//       }

//       update(mouseX: number, mouseY: number) {
//         // Basic movement
//         this.x += this.speedX;
//         this.y += this.speedY;

//         // Mouse influence (subtle attraction)
//         if (mouseX && mouseY && !reducedMotion) {
//           const dx = mouseX - this.x;
//           const dy = mouseY - this.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < 150) {
//             const angle = Math.atan2(dy, dx);
//             const force = (150 - distance) / 15000;
//             this.x += Math.cos(angle) * force * distance;
//             this.y += Math.sin(angle) * force * distance;
//           }
//         }

//         // Wrap around edges
//         if (this.x < 0) this.x = canvas!.width;
//         if (this.x > canvas!.width) this.x = 0;
//         if (this.y < 0) this.y = canvas!.height;
//         if (this.y > canvas!.height) this.y = 0;
//       }

//       draw() {
//         if (!ctx) return;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.fillStyle = config.colors.particles;
//         ctx.fill();
//       }
//     }

//     // Create particles
//     const particles: Particle[] = [];
//     for (let i = 0; i < config.particleCount; i++) {
//       particles.push(new Particle());
//     }

//     // Create glow orbs (larger, colored particles that move slowly)
//     const glowOrbs = Array.from({ length: 5 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       size: Math.random() * 100 + 50,
//       speedX: (Math.random() - 0.5) * 0.1,
//       speedY: (Math.random() - 0.5) * 0.1,
//       color:
//         config.colors.glowOrbs[
//           Math.floor(Math.random() * config.colors.glowOrbs.length)
//         ],
//     }));

//     // Animation loop
//     let animationFrameId: number;

//     const render = () => {
//       if (!ctx) return;

//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Draw glow orbs
//       glowOrbs.forEach((orb) => {
//         if (!ctx) return;

//         // Update position
//         orb.x += orb.speedX;
//         orb.y += orb.speedY;

//         // Wrap around edges
//         if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
//         if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
//         if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
//         if (orb.y > canvas.height + orb.size) orb.y = -orb.size;

//         // Draw glow
//         const gradient = ctx.createRadialGradient(
//           orb.x,
//           orb.y,
//           0,
//           orb.x,
//           orb.y,
//           orb.size,
//         );
//         gradient.addColorStop(0, orb.color);
//         gradient.addColorStop(1, "transparent");

//         ctx.beginPath();
//         ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
//         ctx.fillStyle = gradient;
//         ctx.fill();
//       });

//       // Update and draw particles
//       particles.forEach((particle) => {
//         particle.update(mousePosition.x, mousePosition.y);
//         particle.draw();
//       });

//       // Draw connections between nearby particles
//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const dx = particles[i].x - particles[j].x;
//           const dy = particles[i].y - particles[j].y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < config.connectionDistance) {
//             ctx.beginPath();
//             ctx.strokeStyle = config.colors.connections;
//             ctx.lineWidth = 0.5 * (1 - distance / config.connectionDistance);
//             ctx.moveTo(particles[i].x, particles[i].y);
//             ctx.lineTo(particles[j].x, particles[j].y);
//             ctx.stroke();
//           }
//         }
//       }

//       animationFrameId = requestAnimationFrame(render);
//     };

//     render();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, [dimensions, theme, mousePosition, reducedMotion]);

//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         className="pointer-events-none fixed inset-0 z-0"
//         aria-hidden="true"
//       />

//       {/* Accent shapes - fixed positioned decorative elements */}
//       <div className="animate-pulse-slow fixed left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
//       <div className="animate-pulse-slow animation-delay-2000 fixed bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl dark:bg-indigo-500/5" />

//       {/* Mouse follower effect */}
//       {!reducedMotion && mousePosition.x > 0 && (
//         <motion.div
//           className="pointer-events-none fixed z-0 rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 blur-3xl dark:to-indigo-500/10"
//           animate={{
//             x: mousePosition.x - 150,
//             y: mousePosition.y - 150,
//           }}
//           transition={{
//             type: "spring",
//             damping: 30,
//             stiffness: 200,
//             mass: 0.5,
//           }}
//           style={{
//             width: "300px",
//             height: "300px",
//           }}
//         />
//       )}
//     </>
//   );
// }
