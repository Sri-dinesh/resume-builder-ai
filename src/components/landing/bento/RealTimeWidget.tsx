"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const RealTimeWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const masterTL = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });

      gsap.set(".cursor", { opacity: 0 });
      gsap.set(
        ".input-char, .resume-char, .loc-char, .loc-resume-char, .bio-char, .bio-resume-char",
        { opacity: 0, y: 2 },
      );
      gsap.set(".sync-wave", { opacity: 0, scale: 0.8 });
      gsap.set(".status-indicator", { fill: "#e1dfd7" });
      gsap.set(".status-text", { opacity: 0.4 });
      gsap.set(".doc-section-reveal", { opacity: 0, y: 5 });

      tl.to(".cursor", { opacity: 1, duration: 0.2 })
        .to(".input-char", { opacity: 1, y: 0, duration: 0.02, stagger: 0.02 })
        .to(".cursor", { x: 68, duration: 0.4, ease: "none" }, "<")
        .to(
          ".resume-char",
          {
            opacity: 1,
            y: 0,
            duration: 0.02,
            stagger: 0.02,
            color: "rgb(217,119,87)",
          },
          "<0.1",
        )

        .to(".cursor", { x: 0, y: 44, duration: 0.3, ease: "power2.inOut" })
        .to(".loc-char", { opacity: 1, y: 0, duration: 0.02, stagger: 0.02 })
        .to(".cursor", { x: 55, duration: 0.4, ease: "none" }, "<")
        .to(
          ".loc-resume-char",
          { opacity: 1, y: 0, duration: 0.02, stagger: 0.02 },
          "<0.1",
        )

        .to(".cursor", { x: 0, y: 88, duration: 0.3, ease: "power2.inOut" })
        .to(".bio-char", { opacity: 1, y: 0, duration: 0.01, stagger: 0.01 })
        .to(".cursor", { x: 85, duration: 0.6, ease: "none" }, "<")
        .to(
          ".bio-resume-char",
          {
            opacity: 1,
            y: 0,
            duration: 0.01,
            stagger: 0.01,
            color: "rgb(217,119,87)",
          },
          "<0.1",
        )

        .to(
          ".status-indicator",
          { fill: "rgb(217,119,87)", duration: 0.2 },
          "<",
        )
        .to(
          ".status-text",
          { opacity: 1, color: "#141413", duration: 0.2 },
          "<",
        )
        .to(
          ".sync-wave",
          { opacity: 1, scale: 1.1, duration: 0.4, repeat: 1, yoyo: true },
          "<",
        )

        .to(
          ".doc-section-reveal",
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          ">-0.3",
        );

      gsap.to(".cursor", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });

      masterTL.current = tl;
    },
    { scope: container },
  );

  const renderText = (text: string, className: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={className}
        style={{
          display: "inline-block",
          whiteSpace: char === " " ? "pre" : "normal",
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div
      ref={container}
      className="group relative flex h-full w-full flex-col justify-between overflow-hidden p-6 transition-colors duration-300 hover:border-primary/30"
      onMouseEnter={() => masterTL.current?.play()}
      onMouseLeave={() => masterTL.current?.reverse()}
    >
      <div className="z-10 flex flex-col">
        <span className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 dark:text-muted-foreground/80">
          01 / Real-Time
        </span>
        <h3 className="font-['Syne'] text-[19px] font-bold leading-tight tracking-[-0.02em] text-foreground">
          Instant Mirroring.
        </h3>
        <p className="mt-2 max-w-[240px] text-[12.5px] font-light leading-relaxed text-muted-foreground">
          Edit details and watch your resume update instantly.
        </p>
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(217,119,87,0.12) 0%, transparent 75%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex h-[62%] items-center justify-center">
        <svg
          className="h-full w-full max-w-[340px]"
          viewBox="0 0 340 180"
          fill="none"
        >
          <g transform="translate(10, 10)">
            <rect
              width="150"
              height="160"
              rx="8"
              fill="rgb(253,252,249)"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />
            <rect width="28" height="160" rx="8" fill="rgb(250,249,245)" />

            <g transform="translate(8, 12)">
              <circle cx="6" cy="6" r="3" fill="rgb(217,119,87)" />
              {[18, 28, 38, 48].map((y) => (
                <rect
                  key={y}
                  y={y}
                  width="12"
                  height="2"
                  rx="1"
                  fill="rgb(225,223,215)"
                />
              ))}
            </g>

            <g transform="translate(40, 12)">
              <rect width="30" height="4" rx="2" fill="rgb(225,223,215)" />
              <rect
                y="10"
                width="100"
                height="22"
                rx="4"
                fill="white"
                stroke="rgb(240,238,230)"
                strokeWidth="1"
              />
              <foreignObject x="6" y="16" width="90" height="12">
                <div
                  {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                  className="flex items-center font-sans text-[7.5px] font-bold text-foreground"
                >
                  {renderText("Product Designer", "input-char")}
                </div>
              </foreignObject>

              <g transform="translate(0, 44)">
                <rect width="35" height="4" rx="2" fill="rgb(225,223,215)" />
                <rect
                  y="10"
                  width="100"
                  height="22"
                  rx="4"
                  fill="white"
                  stroke="rgb(240,238,230)"
                  strokeWidth="1"
                />
                <foreignObject x="6" y="16" width="90" height="12">
                  <div
                    {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                    className="flex items-center font-sans text-[7.5px] font-medium text-muted-foreground"
                  >
                    {renderText("San Francisco", "loc-char")}
                  </div>
                </foreignObject>
              </g>

              <g transform="translate(0, 88)">
                <rect width="40" height="4" rx="2" fill="rgb(225,223,215)" />
                <rect
                  y="10"
                  width="100"
                  height="34"
                  rx="4"
                  fill="white"
                  stroke="rgb(240,238,230)"
                  strokeWidth="1"
                />
                <foreignObject x="6" y="16" width="90" height="24">
                  <div
                    {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                    className="font-sans text-[6.5px] leading-[1.3] text-muted-foreground"
                  >
                    {renderText(
                      "Crafting elegant user experiences.",
                      "bio-char",
                    )}
                  </div>
                </foreignObject>
              </g>

              <rect
                className="cursor"
                x="6"
                y="16"
                width="1"
                height="9"
                fill="rgb(217,119,87)"
              />

              <g transform="translate(0, 135)">
                <circle
                  className="status-indicator"
                  cx="3"
                  cy="0"
                  r="3"
                  fill="#e1dfd7"
                />
                <text
                  className="status-text"
                  x="10"
                  y="2.5"
                  fill="#b0aea5"
                  fontSize="5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  LIVE SYNC ACTIVE
                </text>
              </g>
            </g>
          </g>

          <path
            className="sync-wave"
            d="M 165 90 Q 175 90 185 90"
            stroke="rgb(217,119,87)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          <g transform="translate(195, 10)">
            <rect
              width="135"
              height="160"
              rx="6"
              fill="white"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />
            <g transform="translate(14, 14)">
              <circle cx="14" cy="14" r="14" fill="rgb(245,244,240)" />
              <rect
                x="36"
                y="4"
                width="60"
                height="6"
                rx="3"
                fill="rgb(230,228,220)"
              />

              <foreignObject x="36" y="14" width="85" height="12">
                <div
                  {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                  className="font-sans text-[8px] font-bold text-primary"
                >
                  {renderText("Product Designer", "resume-char")}
                </div>
              </foreignObject>

              <foreignObject x="36" y="24" width="85" height="10">
                <div
                  {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                  className="font-sans text-[6px] text-muted-foreground"
                >
                  {renderText("San Francisco", "loc-resume-char")}
                </div>
              </foreignObject>

              <line
                y1="42"
                x2="107"
                y2="42"
                stroke="rgb(245,244,240)"
                strokeWidth="1"
              />

              <g transform="translate(0, 52)">
                <foreignObject width="107" height="100">
                  <div
                    {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                    className="flex flex-col gap-[8px] font-sans"
                  >
                    <div className="flex flex-col gap-[3px]">
                      <span className="text-[5.5px] font-bold text-foreground">
                        SUMMARY
                      </span>
                      <div className="text-[6px] leading-[1.3] text-muted-foreground">
                        {renderText(
                          "Crafting elegant user experiences.",
                          "bio-resume-char",
                        )}
                      </div>
                    </div>
                    <div className="doc-section-reveal flex flex-col gap-[3px]">
                      <span className="text-[5.5px] font-bold text-foreground">
                        EXPERIENCE
                      </span>
                      <div className="flex flex-col gap-[2px] text-[5px] text-muted-foreground">
                        <span>Led redesign of core user dashboard</span>
                        <span>Optimized mobile engagement by 20%</span>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RealTimeWidget;
