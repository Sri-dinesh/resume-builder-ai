"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Zap } from "lucide-react";
import { useRef, useState } from "react";

const RealTimeWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 });

      gsap.set(".input-typing", { width: 0, opacity: 1 });
      gsap.set(".cursor", { opacity: 1, x: 0 });
      gsap.set(".sync-dot", { opacity: 0, scale: 0, x: 0 });
      gsap.set(".resume-update", {
        scaleX: 0,
        transformOrigin: "left",
        opacity: 0.3,
      });

      tl.to(".cursor", { opacity: 0, duration: 0.2, repeat: 3, yoyo: true })
        .to(".input-typing", {
          width: 80,
          duration: 1.2,
          ease: "steps(12)",
        })
        .to(".cursor", { x: 80, duration: 1.2, ease: "steps(12)" }, "<")

        .to(".sync-dot", { opacity: 1, scale: 1, duration: 0.2 })
        .to(".sync-dot", {
          x: 45,
          duration: 0.6,
          ease: "power2.inOut",
        })
        .to(".sync-dot", { scale: 0, opacity: 0, duration: 0.1 })

        .to(
          ".resume-update",
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.5)",
            stagger: 0.1,
          },
          "-=0.1",
        )

        .to({}, { duration: 2 });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="flex h-full w-full flex-col justify-between overflow-hidden p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-1 items-center justify-center p-2">
        <svg
          className="w-full max-w-[340px] overflow-visible"
          viewBox="0 0 240 120"
          fill="none"
        >
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            }}
          >
            <rect
              x="0"
              y="10"
              width="100"
              height="100"
              rx="6"
              className="fill-card stroke-border/40"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.06))" }}
            />
            <circle cx="12" cy="22" r="2.5" className="fill-red-500/40" />
            <circle cx="22" cy="22" r="2.5" className="fill-yellow-500/40" />
            <circle cx="32" cy="22" r="2.5" className="fill-green-500/40" />
            <line
              x1="0"
              y1="32"
              x2="100"
              y2="32"
              className="stroke-border/20"
              strokeWidth="1"
            />

            <rect
              x="12"
              y="42"
              width="30"
              height="4"
              rx="2"
              className="fill-muted-foreground/30"
            />

            <rect
              x="12"
              y="52"
              width="76"
              height="18"
              rx="3"
              className="fill-muted/30 stroke-border/50"
              strokeWidth="1"
            />

            <g transform="translate(18, 59)">
              <rect
                className="input-typing fill-foreground"
                x="0"
                y="0"
                width="0"
                height="4"
                rx="2"
              />
              <line
                className="cursor stroke-primary"
                x1="0"
                y1="-1"
                x2="0"
                y2="5"
                strokeWidth="1.5"
              />
            </g>

            <rect
              x="12"
              y="78"
              width="40"
              height="4"
              rx="2"
              className="fill-muted-foreground/20"
            />
            <rect
              x="12"
              y="86"
              width="76"
              height="12"
              rx="3"
              className="fill-muted/20"
            />
          </g>

          <g>
            <path
              d="M 100 60 C 115 60, 125 60, 140 60"
              className="stroke-primary/20 transition-all duration-500"
              strokeWidth={isHovered ? 4 : 0}
              strokeLinecap="round"
            />
            <path
              d="M 100 60 C 115 60, 125 60, 140 60"
              className="stroke-border/50"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx="100"
              cy="60"
              r="3"
              className="sync-dot fill-primary shadow-[0_0_8px_hsl(var(--primary))]"
            />
          </g>

          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? "translateY(4px)" : "translateY(0)",
            }}
          >
            <rect
              x="140"
              y="5"
              width="90"
              height="110"
              rx="4"
              className="fill-background stroke-border/50"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.08))" }}
            />

            <rect
              x="150"
              y="15"
              width="24"
              height="24"
              rx="12"
              className="fill-muted-foreground/10"
            />
            <rect
              x="180"
              y="18"
              width="40"
              height="4"
              rx="2"
              className="fill-muted-foreground/30"
            />
            <rect
              x="180"
              y="26"
              width="30"
              height="3"
              rx="1.5"
              className="fill-muted-foreground/20"
            />
            <rect
              x="180"
              y="33"
              width="20"
              height="3"
              rx="1.5"
              className="fill-muted-foreground/20"
            />
            <line
              x1="150"
              y1="45"
              x2="220"
              y2="45"
              className="stroke-border/20"
              strokeWidth="1"
            />

            <rect
              x="150"
              y="55"
              width="20"
              height="3"
              rx="1.5"
              className="fill-muted-foreground/30"
            />
            <rect
              x="150"
              y="63"
              width="60"
              height="3"
              rx="1.5"
              className="fill-muted-foreground/10"
            />
            <rect
              x="150"
              y="70"
              width="50"
              height="3"
              rx="1.5"
              className="fill-muted-foreground/10"
            />

            <rect
              x="156"
              y="82"
              width="58"
              height="4"
              rx="2"
              className="resume-update fill-foreground"
            />
            <rect
              x="156"
              y="90"
              width="40"
              height="4"
              rx="2"
              className="resume-update fill-primary/80"
            />

            <circle
              cx="152"
              cy="84"
              r="1.5"
              className="resume-update fill-primary"
            />
            <circle
              cx="152"
              cy="92"
              r="1.5"
              className="resume-update fill-primary"
            />
          </g>
        </svg>
      </div>

      <div className="mt-4">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <motion.div
            animate={{ rotate: isHovered ? 15 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Zap className="h-4 w-4 text-primary" />
          </motion.div>
          Interview Ready
        </h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Update details and see resume evolve instantly - fast, efficient,
          effortless.
        </p>
      </div>
    </div>
  );
};

export default RealTimeWidget;
