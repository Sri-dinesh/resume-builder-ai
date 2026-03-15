"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const CustomizationWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const masterTL = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });

      // Clean setup to prevent React strict mode re-render bugs
      gsap.set(".doc-block-1, .doc-block-2", { y: 0 });
      gsap.set(".toolbar-btn", { scale: 1, transformOrigin: "center" });
      gsap.set(".cursor", { x: 120, y: 150, opacity: 0 });
      gsap.set(".color-indicator", { fill: "rgb(205,203,195)" });
      gsap.set(".font-serif-wrapper", { opacity: 0 });
      gsap.set(".font-sans-wrapper", { opacity: 1 });
      gsap.set(".accent-bg", { backgroundColor: "rgb(240,238,230)" });
      gsap.set(".accent-text", { color: "transparent" });

      tl.to(".cursor", { opacity: 1, duration: 0.2, ease: "power2.out" })
        // Move to Layout Button
        .to(".cursor", { x: 218, y: 38, duration: 0.5, ease: "power3.inOut" })
        .to(".btn-layout", {
          scale: 0.85,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to(
          ".doc-block-1",
          { y: 36, duration: 0.6, ease: "back.out(1.2)" },
          ">",
        )
        .to(
          ".doc-block-2",
          { y: -36, duration: 0.6, ease: "back.out(1.2)" },
          "<",
        )
        // Move to Color Button
        .to(
          ".cursor",
          { x: 218, y: 58, duration: 0.4, ease: "power2.inOut" },
          ">",
        )
        .to(".btn-color", {
          scale: 0.85,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to(
          ".color-indicator",
          { fill: "rgb(217,119,87)", duration: 0.3 },
          ">",
        )
        .to(
          ".accent-bg",
          { backgroundColor: "rgb(217,119,87)", duration: 0.3 },
          "<",
        )
        .to(".accent-text", { color: "#ffffff", duration: 0.3 }, "<")
        // Move to Font Button
        .to(
          ".cursor",
          { x: 218, y: 78, duration: 0.4, ease: "power2.inOut" },
          ">",
        )
        .to(".btn-font", {
          scale: 0.85,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to(".font-sans-wrapper", { opacity: 0, duration: 0.3 }, ">")
        .to(".font-serif-wrapper", { opacity: 1, duration: 0.3 }, "<")
        // Cursor leaves viewport
        .to(".cursor", {
          x: 240,
          y: 150,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });

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
          05 / Customization
        </span>
        <h3 className="font-['Syne'] text-[19px] font-bold leading-tight tracking-[-0.02em] text-[#141413]">
          Pixel Perfect.
        </h3>
        <p className="mt-2 max-w-[240px] text-[12.5px] font-light leading-relaxed text-[#66655f]">
          Personalize your brand. Change layouts, colors, and typography
          instantly.
        </p>
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(217,119,87,0.12) 0%, transparent 75%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex h-[62%] items-center justify-center pb-2">
        <svg
          className="h-full w-full max-w-[300px]"
          viewBox="0 0 280 150"
          fill="none"
        >
          {/* Main Resume Document Canvas */}
          <g transform="translate(40, 6)">
            <foreignObject x="0" y="0" width="144" height="136">
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                className="relative flex h-full w-full flex-col overflow-hidden rounded-[6px] border border-[#ebe9e1] bg-white p-3 font-sans"
              >
                {/* Header Profile Section */}
                <div className="mb-2.5 flex items-center gap-[8px]">
                  <div className="accent-bg flex h-7 w-7 items-center justify-center rounded-full bg-[#f0eee6] transition-colors">
                    <span className="accent-text text-[9px] font-bold tracking-tighter text-transparent">
                      JS
                    </span>
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <div className="h-[4px] w-16 rounded-full bg-[#d2cfc6]"></div>
                    <div className="h-[3px] w-10 rounded-full bg-[#e4e2da]"></div>
                  </div>
                </div>

                <div className="mb-2.5 h-px w-full bg-[#f5f4f0]"></div>

                {/* Content Layout Wrapper */}
                <div className="relative w-full flex-1">
                  {/* SANS SERIF LAYER */}
                  <div className="font-sans-wrapper absolute inset-0">
                    <div className="doc-block-1 absolute left-0 top-0 w-full">
                      <h4 className="mb-[3px] text-[7.5px] font-bold leading-none text-[#141413]">
                        Experience
                      </h4>
                      <p className="text-[6px] font-medium leading-[1.3] text-[#66655f]">
                        Senior Software Engineer
                        <br />
                        Built interactive web apps.
                      </p>
                    </div>
                    <div className="doc-block-2 absolute left-0 top-[36px] w-full">
                      <h4 className="mb-[3px] text-[7.5px] font-bold leading-none text-[#141413]">
                        Education
                      </h4>
                      <p className="text-[6px] font-medium leading-[1.3] text-[#66655f]">
                        B.S. in Computer Science
                        <br />
                        University of Technology
                      </p>
                    </div>
                  </div>

                  {/* SERIF LAYER */}
                  <div className="font-serif-wrapper absolute inset-0 opacity-0">
                    <div className="font-serif">
                      <div className="doc-block-1 absolute left-0 top-0 w-full">
                        <h4 className="mb-[3px] text-[8.5px] font-bold leading-none text-[#141413]">
                          Experience
                        </h4>
                        <p className="text-[6.5px] font-medium leading-[1.3] text-[#66655f]">
                          Senior Software Engineer
                          <br />
                          Built interactive web apps.
                        </p>
                      </div>
                      <div className="doc-block-2 absolute left-0 top-[36px] w-full">
                        <h4 className="mb-[3px] text-[8.5px] font-bold leading-none text-[#141413]">
                          Education
                        </h4>
                        <p className="text-[6.5px] font-medium leading-[1.3] text-[#66655f]">
                          B.S. in Computer Science
                          <br />
                          University of Technology
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* Editor Toolbar */}
          <g transform="translate(196, 20)">
            <rect
              x="0"
              y="0"
              width="44"
              height="84"
              rx="8"
              fill="rgb(253,252,249)"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />

            <g className="toolbar-btn btn-layout" transform="translate(12, 10)">
              <rect
                x="0"
                y="0"
                width="20"
                height="16"
                rx="4"
                fill="rgb(250,249,245)"
                stroke="rgb(235,233,225)"
                strokeWidth="0.5"
              />
              <rect
                x="5"
                y="4"
                width="10"
                height="3"
                rx="1"
                fill="rgb(180,178,170)"
              />
              <rect
                x="5"
                y="9"
                width="10"
                height="3"
                rx="1"
                fill="rgb(180,178,170)"
              />
            </g>

            <g className="toolbar-btn btn-color" transform="translate(12, 30)">
              <rect
                x="0"
                y="0"
                width="20"
                height="16"
                rx="4"
                fill="rgb(250,249,245)"
                stroke="rgb(235,233,225)"
                strokeWidth="0.5"
              />
              <circle
                className="color-indicator"
                cx="10"
                cy="8"
                r="4"
                fill="rgb(205,203,195)"
              />
            </g>

            <g className="toolbar-btn btn-font" transform="translate(12, 50)">
              <rect
                x="0"
                y="0"
                width="20"
                height="16"
                rx="4"
                fill="rgb(250,249,245)"
                stroke="rgb(235,233,225)"
                strokeWidth="0.5"
              />
              <text
                x="10"
                y="11"
                fill="rgb(180,178,170)"
                fontSize="8"
                fontFamily="serif"
                fontWeight="bold"
                textAnchor="middle"
              >
                Aa
              </text>
            </g>
          </g>

          {/* Mouse Cursor SVG */}
          <g className="cursor">
            <path
              d="M0,0 L0,14 L3,11 L6,16 L8,15 L5,10 L10,10 Z"
              fill="rgb(20,20,19)"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default CustomizationWidget;
