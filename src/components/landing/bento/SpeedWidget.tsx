"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const SpeedWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const masterTL = useRef<gsap.core.Timeline | null>(null);
  const timerRef = useRef({ val: 300 });

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });

      gsap.set(".progress-ring", {
        strokeDashoffset: 150.8,
        rotation: -90,
        transformOrigin: "center",
      });
      gsap.set(".timer-hub", { x: 140, y: 80 });
      gsap.set(".doc-plate", {
        x: 75,
        opacity: 0,
        scale: 0.9,
        transformOrigin: "center center",
      });
      gsap.set(".frag", { opacity: 0, x: 20, scale: 0.8 });
      gsap.set(".success-check", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
      });
      gsap.set(".timer-content", { opacity: 1 });

      tl.to(".timer-hub", {
        x: 210,
        duration: 0.6,
        ease: "expo.inOut",
      })
        .to(
          ".doc-plate",
          {
            x: 30,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "expo.inOut",
          },
          "<",
        )

        .to(
          timerRef.current,
          {
            val: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
              const minutes = Math.floor(timerRef.current.val / 60);
              const seconds = Math.floor(timerRef.current.val % 60);
              const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
              const el = container.current?.querySelector(".timer-text");
              if (el) el.textContent = display;
            },
          },
          ">-0.2",
        )
        .to(
          ".progress-ring",
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "<",
        )

        .to(
          ".frag-1",
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" },
          "<0.1",
        )
        .to(
          ".frag-2",
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" },
          "<0.1",
        )
        .to(
          ".frag-3",
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" },
          "<0.1",
        )

        .to(".timer-content", { opacity: 0, scale: 0.5, duration: 0.2 }, ">")
        .to(
          ".success-check",
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
          "<",
        )
        .to(".progress-ring", { stroke: "rgb(217,119,87)", duration: 0.3 }, "<")
        .to(
          ".frag-bg",
          {
            fill: "rgba(217,119,87,0.05)",
            stroke: "rgba(217,119,87,0.2)",
            duration: 0.4,
          },
          "<",
        );

      masterTL.current = tl;
    },
    { scope: container },
  );

  const handleMouseEnter = () => {
    masterTL.current?.play();
  };

  const handleMouseLeave = () => {
    masterTL.current?.reverse();
  };

  return (
    <div
      ref={container}
      className="group relative flex h-full w-full flex-col justify-between overflow-hidden p-6 transition-colors duration-300 hover:border-primary/30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="z-10 flex flex-col">
        <span className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#b0aea5]">
          03 / Speed
        </span>
        <h3 className="font-['Syne'] text-[19px] font-bold leading-tight tracking-[-0.02em] text-[#141413]">
          Built in 5 Minutes.
        </h3>
        <p className="mt-2 max-w-[240px] text-[12.5px] font-light leading-relaxed text-[#66655f]">
          Professional resumes in record time. Engineering speed into every
          step.
        </p>
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(217,119,87,0.12) 0%, transparent 75%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex h-[65%] items-center justify-center pb-2">
        <svg
          className="h-full w-full max-w-[300px]"
          viewBox="0 0 280 160"
          fill="none"
        >
          <g className="doc-plate">
            <g transform="translate(0, 10)">
              <rect
                width="130"
                height="140"
                rx="6"
                fill="white"
                stroke="rgb(235,233,225)"
                strokeWidth="1"
              />

              <g transform="translate(12, 12)">
                <g className="frag frag-1" transform="translate(0, 0)">
                  <rect
                    className="frag-bg"
                    width="106"
                    height="28"
                    rx="4"
                    fill="rgb(250,249,245)"
                    stroke="rgb(240,238,230)"
                    strokeWidth="0.5"
                  />
                  <circle cx="14" cy="14" r="8" fill="rgb(235,233,225)" />
                  <text
                    x="28"
                    y="13"
                    fill="#141413"
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    John Doe
                  </text>
                  <text
                    x="28"
                    y="21"
                    fill="#66655f"
                    fontSize="5"
                    fontFamily="sans-serif"
                  >
                    Software Engineer
                  </text>
                </g>

                <g className="frag frag-2" transform="translate(0, 36)">
                  <rect
                    className="frag-bg"
                    width="106"
                    height="38"
                    rx="4"
                    fill="rgb(250,249,245)"
                    stroke="rgb(240,238,230)"
                    strokeWidth="0.5"
                  />
                  <text
                    x="8"
                    y="12"
                    fill="#141413"
                    fontSize="6"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Experience
                  </text>
                  <text
                    x="8"
                    y="22"
                    fill="#66655f"
                    fontSize="5"
                    fontFamily="sans-serif"
                  >
                    ● Led high-scale React apps
                  </text>
                  <text
                    x="8"
                    y="30"
                    fill="#66655f"
                    fontSize="5"
                    fontFamily="sans-serif"
                  >
                    ● Optimized build pipelines
                  </text>
                </g>

                <g className="frag frag-3" transform="translate(0, 82)">
                  <rect
                    className="frag-bg"
                    width="106"
                    height="34"
                    rx="4"
                    fill="rgb(250,249,245)"
                    stroke="rgb(240,238,230)"
                    strokeWidth="0.5"
                  />
                  <text
                    x="8"
                    y="12"
                    fill="#141413"
                    fontSize="6"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Technical Skills
                  </text>
                  <text
                    x="8"
                    y="22"
                    fill="#d97757"
                    fontSize="5"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    React, Node.js, AWS, SQL
                  </text>
                </g>
              </g>
            </g>
          </g>

          <g className="timer-hub">
            <circle
              r="32"
              fill="white"
              stroke="rgb(245,244,240)"
              strokeWidth="4"
            />
            <circle
              className="progress-ring"
              r="24"
              stroke="rgb(230,228,220)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="150.8"
              strokeDashoffset="150.8"
            />

            <g className="timer-content">
              <text
                className="timer-text"
                y="4"
                textAnchor="middle"
                fill="#141413"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                05:00
              </text>
            </g>

            <g className="success-check">
              <circle r="16" fill="rgba(217,119,87,0.1)" />
              <path
                d="M -5 0 L -1 4 L 5 -4"
                fill="none"
                stroke="rgb(217,119,87)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SpeedWidget;
