"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const ATSScoreWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const masterTL = useRef<gsap.core.Timeline | null>(null);
  const proxy = useRef({ score: 0, key: 0, sec: 0, imp: 0 });

  useGSAP(
    () => {
      const q = gsap.utils.selector(container);

      gsap.set(".doc-highlights rect", {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "center",
      });
      gsap.set(".scan-laser-group", { opacity: 0, y: -15 });
      gsap.set(".dashboard-panel", { y: 56 });

      gsap.set(".score-ring", {
        strokeDashoffset: 150.8,
        stroke: "rgb(205,203,195)",
      });
      gsap.set(".metric-bar-1", { width: 0, fill: "rgb(205,203,195)" });
      gsap.set(".metric-bar-2", { width: 0, fill: "rgb(205,203,195)" });
      gsap.set(".metric-bar-3", { width: 0, fill: "rgb(205,203,195)" });

      const scoreText = q(".score-text");
      if (scoreText.length) {
        scoreText[0].textContent = "0";
        q(".metric-score-1")[0].textContent = "0/10";
        q(".metric-score-2")[0].textContent = "0/20";
        q(".metric-score-3")[0].textContent = "0/70";
      }
    },
    { scope: container },
  );

  const buildHoverTL = () => {
    const q = gsap.utils.selector(container);
    const tl = gsap.timeline();

    tl.set(".scan-laser-group", { y: -15, opacity: 0 })
      .to(".dashboard-panel", { y: 46, duration: 0.4, ease: "power2.out" })
      .to(".scan-laser-group", { opacity: 1, duration: 0.15 }, "<")
      .to(".scan-laser-group", { y: 140, duration: 0.8, ease: "linear" }, "<")
      .to(
        ".doc-highlights rect",
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: "back.out(2)",
        },
        "<0.2",
      )
      .to(".scan-laser-group", { opacity: 0, duration: 0.15 }, "<0.5");

    const tallyStart = "<0.1";

    tl.to(
      ".score-ring",
      {
        strokeDashoffset: 9,
        stroke: "rgb(217,119,87)",
        duration: 0.8,
        ease: "power3.out",
      },
      tallyStart,
    )
      .to(
        ".metric-bar-1",
        {
          width: 40,
          fill: "rgb(217,119,87)",
          duration: 0.8,
          ease: "power3.out",
        },
        tallyStart,
      )
      .to(
        ".metric-bar-2",
        {
          width: 40,
          fill: "rgb(217,119,87)",
          duration: 0.8,
          ease: "power3.out",
        },
        tallyStart,
      )
      .to(
        ".metric-bar-3",
        {
          width: 36,
          fill: "rgb(217,119,87)",
          duration: 0.8,
          ease: "power3.out",
        },
        tallyStart,
      );

    tl.to(
      proxy.current,
      {
        score: 94,
        key: 10,
        sec: 20,
        imp: 64,
        duration: 0.8,
        ease: "power3.out",
        onUpdate: () => {
          const els = q(".score-text");
          if (els.length) {
            els[0].textContent = Math.round(proxy.current.score).toString();
            q(".metric-score-1")[0].textContent = `${Math.round(
              proxy.current.key,
            )}/10`;
            q(".metric-score-2")[0].textContent = `${Math.round(
              proxy.current.sec,
            )}/20`;
            q(".metric-score-3")[0].textContent = `${Math.round(
              proxy.current.imp,
            )}/70`;
          }
        },
      },
      tallyStart,
    );

    return tl;
  };

  const buildLeaveTL = () => {
    const q = gsap.utils.selector(container);
    const tl = gsap.timeline();

    tl.to(".dashboard-panel", { y: 56, duration: 0.4, ease: "power2.out" })
      .to(
        ".doc-highlights rect",
        { opacity: 0, scale: 0.8, duration: 0.3, stagger: 0.04 },
        "<",
      )
      .to(
        ".score-ring",
        {
          strokeDashoffset: 150.8,
          stroke: "rgb(205,203,195)",
          duration: 0.6,
          ease: "power3.out",
        },
        "<",
      )
      .to(
        ".metric-bar-1",
        {
          width: 0,
          fill: "rgb(205,203,195)",
          duration: 0.6,
          ease: "power3.out",
        },
        "<",
      )
      .to(
        ".metric-bar-2",
        {
          width: 0,
          fill: "rgb(205,203,195)",
          duration: 0.6,
          ease: "power3.out",
        },
        "<",
      )
      .to(
        ".metric-bar-3",
        {
          width: 0,
          fill: "rgb(205,203,195)",
          duration: 0.6,
          ease: "power3.out",
        },
        "<",
      );

    tl.to(
      proxy.current,
      {
        score: 0,
        key: 0,
        sec: 0,
        imp: 0,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => {
          const els = q(".score-text");
          if (els.length) {
            els[0].textContent = Math.round(proxy.current.score).toString();
            q(".metric-score-1")[0].textContent = `${Math.round(
              proxy.current.key,
            )}/10`;
            q(".metric-score-2")[0].textContent = `${Math.round(
              proxy.current.sec,
            )}/20`;
            q(".metric-score-3")[0].textContent = `${Math.round(
              proxy.current.imp,
            )}/70`;
          }
        },
      },
      "<",
    );

    tl.set(".scan-laser-group", { opacity: 0, y: -15 });

    return tl;
  };

  const handleMouseEnter = () => {
    if (masterTL.current) masterTL.current.kill();
    masterTL.current = buildHoverTL();
  };

  const handleMouseLeave = () => {
    if (masterTL.current) masterTL.current.kill();
    masterTL.current = buildLeaveTL();
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
          05 / ATS Analysis
        </span>
        <h3 className="font-['Syne'] text-[19px] font-bold leading-tight tracking-[-0.02em] text-[#141413]">
          Beat the Bots.
        </h3>
        <p className="mt-2 max-w-[240px] text-[12.5px] font-light leading-relaxed text-[#66655f]">
          Real-time, in-depth scoring against industry-standard ATS algorithms.
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
          className="h-full w-full max-w-[300px]"
          viewBox="0 0 280 150"
          fill="none"
        >
          <defs>
            <linearGradient id="scan-laser-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(217,119,87,0)" />
              <stop offset="100%" stopColor="rgba(217,119,87,0.25)" />
            </linearGradient>
            <linearGradient id="scan-laser-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(217,119,87,0)" />
              <stop offset="20%" stopColor="rgba(217,119,87,0.8)" />
              <stop offset="80%" stopColor="rgba(217,119,87,0.8)" />
              <stop offset="100%" stopColor="rgba(217,119,87,0)" />
            </linearGradient>
          </defs>

          <g transform="translate(60, 4)">
            <rect
              x="0"
              y="0"
              width="160"
              height="136"
              rx="6"
              fill="rgb(255,255,255)"
              stroke="rgb(235,233,225)"
              strokeWidth="1.5"
            />

            <circle cx="28" cy="22" r="7" fill="rgb(235,233,225)" />
            <rect
              x="44"
              y="17"
              width="50"
              height="4"
              rx="2"
              fill="rgb(215,213,205)"
            />
            <rect
              x="44"
              y="25"
              width="30"
              height="3"
              rx="1.5"
              fill="rgb(235,233,225)"
            />

            <rect
              x="16"
              y="36"
              width="128"
              height="1"
              fill="rgb(245,244,240)"
            />

            <rect
              x="16"
              y="44"
              width="22"
              height="3"
              rx="1.5"
              fill="rgb(225,223,215)"
            />
            <rect
              x="16"
              y="52"
              width="120"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />
            <rect
              x="16"
              y="58"
              width="95"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />
            <rect
              x="16"
              y="64"
              width="105"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />

            <rect
              x="16"
              y="76"
              width="22"
              height="3"
              rx="1.5"
              fill="rgb(225,223,215)"
            />
            <rect
              x="16"
              y="84"
              width="110"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />
            <rect
              x="16"
              y="90"
              width="85"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />

            <rect
              x="16"
              y="102"
              width="22"
              height="3"
              rx="1.5"
              fill="rgb(225,223,215)"
            />
            <rect
              x="16"
              y="110"
              width="125"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />
            <rect
              x="16"
              y="116"
              width="80"
              height="3"
              rx="1.5"
              fill="rgb(240,238,230)"
            />

            <g className="doc-highlights">
              <rect
                x="46"
                y="50.5"
                width="20"
                height="6"
                rx="2"
                fill="rgba(217,119,87,0.15)"
                stroke="rgba(217,119,87,0.3)"
                strokeWidth="0.5"
              />
              <rect
                x="76"
                y="82.5"
                width="24"
                height="6"
                rx="2"
                fill="rgba(217,119,87,0.15)"
                stroke="rgba(217,119,87,0.3)"
                strokeWidth="0.5"
              />
              <rect
                x="28"
                y="108.5"
                width="18"
                height="6"
                rx="2"
                fill="rgba(217,119,87,0.15)"
                stroke="rgba(217,119,87,0.3)"
                strokeWidth="0.5"
              />
              <rect
                x="68"
                y="108.5"
                width="22"
                height="6"
                rx="2"
                fill="rgba(217,119,87,0.15)"
                stroke="rgba(217,119,87,0.3)"
                strokeWidth="0.5"
              />
            </g>

            <g className="scan-laser-group" opacity="0">
              <rect
                x="-10"
                y="-15"
                width="180"
                height="15"
                fill="url(#scan-laser-grad)"
              />
              <rect
                x="-10"
                y="0"
                width="180"
                height="1.5"
                fill="url(#scan-laser-line)"
              />
            </g>
          </g>

          <g className="dashboard-panel" transform="translate(32, 54)">
            <rect
              x="0"
              y="0"
              width="216"
              height="80"
              rx="12"
              fill="rgb(253,252,249)"
              stroke="rgb(235,233,225)"
              strokeWidth="1.5"
            />

            <line
              x1="82"
              y1="14"
              x2="82"
              y2="66"
              stroke="rgb(240,238,230)"
              strokeWidth="1"
            />

            <g transform="translate(41, 40)">
              <circle cx="0" cy="0" r="30" fill="rgb(255,255,255)" />
              <circle
                cx="0"
                cy="0"
                r="24"
                fill="none"
                stroke="rgb(240,238,230)"
                strokeWidth="4"
              />
              <circle
                className="score-ring"
                cx="0"
                cy="0"
                r="24"
                fill="none"
                stroke="rgb(205,203,195)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="150.8"
                strokeDashoffset="150.8"
                transform="rotate(-90)"
              />

              <text
                className="score-text"
                x="0"
                y="4"
                fill="rgb(20,20,19)"
                fontSize="18"
                fontFamily="sans-serif"
                fontWeight="800"
                textAnchor="middle"
                letterSpacing="-0.02em"
              >
                0
              </text>
              <text
                x="0"
                y="14"
                fill="rgb(170,168,160)"
                fontSize="5.5"
                fontFamily="monospace"
                textAnchor="middle"
                letterSpacing="0.08em"
                fontWeight="600"
              >
                ATS SCORE
              </text>
            </g>

            <g transform="translate(92, 11)">
              <g className="metric" transform="translate(0, 0)">
                <rect
                  x="0"
                  y="0"
                  width="116"
                  height="18"
                  rx="4"
                  fill="rgb(250,249,245)"
                  stroke="rgb(240,238,230)"
                  strokeWidth="0.5"
                />
                <text
                  x="8"
                  y="11.5"
                  fill="rgb(100,98,90)"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Keywords
                </text>
                <text
                  className="metric-score-1"
                  x="108"
                  y="11.5"
                  fill="rgb(20,20,19)"
                  fontSize="6"
                  fontFamily="monospace"
                  textAnchor="end"
                  fontWeight="600"
                >
                  0/10
                </text>
                <rect
                  x="52"
                  y="8"
                  width="40"
                  height="3"
                  rx="1.5"
                  fill="rgb(235,233,225)"
                />
                <rect
                  className="metric-bar-1"
                  x="52"
                  y="8"
                  width="0"
                  height="3"
                  rx="1.5"
                  fill="rgb(205,203,195)"
                />
              </g>

              <g className="metric" transform="translate(0, 20)">
                <rect
                  x="0"
                  y="0"
                  width="116"
                  height="18"
                  rx="4"
                  fill="rgb(250,249,245)"
                  stroke="rgb(240,238,230)"
                  strokeWidth="0.5"
                />
                <text
                  x="8"
                  y="11.5"
                  fill="rgb(100,98,90)"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Sections
                </text>
                <text
                  className="metric-score-2"
                  x="108"
                  y="11.5"
                  fill="rgb(20,20,19)"
                  fontSize="6"
                  fontFamily="monospace"
                  textAnchor="end"
                  fontWeight="600"
                >
                  0/20
                </text>
                <rect
                  x="52"
                  y="8"
                  width="40"
                  height="3"
                  rx="1.5"
                  fill="rgb(235,233,225)"
                />
                <rect
                  className="metric-bar-2"
                  x="52"
                  y="8"
                  width="0"
                  height="3"
                  rx="1.5"
                  fill="rgb(205,203,195)"
                />
              </g>

              <g className="metric" transform="translate(0, 40)">
                <rect
                  x="0"
                  y="0"
                  width="116"
                  height="18"
                  rx="4"
                  fill="rgb(250,249,245)"
                  stroke="rgb(240,238,230)"
                  strokeWidth="0.5"
                />
                <text
                  x="8"
                  y="11.5"
                  fill="rgb(100,98,90)"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Impact
                </text>
                <text
                  className="metric-score-3"
                  x="108"
                  y="11.5"
                  fill="rgb(20,20,19)"
                  fontSize="6"
                  fontFamily="monospace"
                  textAnchor="end"
                  fontWeight="600"
                >
                  0/70
                </text>
                <rect
                  x="52"
                  y="8"
                  width="40"
                  height="3"
                  rx="1.5"
                  fill="rgb(235,233,225)"
                />
                <rect
                  className="metric-bar-3"
                  x="52"
                  y="8"
                  width="0"
                  height="3"
                  rx="1.5"
                  fill="rgb(205,203,195)"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ATSScoreWidget;
