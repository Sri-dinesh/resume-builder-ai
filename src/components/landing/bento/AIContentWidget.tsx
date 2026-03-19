"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const AIContentWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const masterTL = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set(".gen-word", {
        opacity: 0,
        y: 3,
      });
      gsap.set(".gen-dot", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
      });
      gsap.set(".ai-glow", { opacity: 0 });
      gsap.set(".kw-bg", {
        fill: "rgb(250,249,245)",
        stroke: "rgb(235,233,225)",
      });
      gsap.set(".kw-icon", { fill: "rgb(180,178,170)" });
    },
    { scope: container },
  );

  const buildHoverTL = () => {
    const tl = gsap.timeline();

    tl.to(".ai-btn-bg", {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      transformOrigin: "center",
      ease: "power2.inOut",
    })
      .to(".ai-glow", { opacity: 1, duration: 0.3 }, "<")
      .to(
        ".kw-bg",
        {
          fill: "rgba(217,119,87,0.1)",
          stroke: "rgba(217,119,87,0.3)",
          duration: 0.2,
          stagger: 0.1,
        },
        ">",
      )
      .to(
        ".kw-icon",
        { fill: "rgb(217,119,87)", duration: 0.2, stagger: 0.1 },
        "<",
      )
      .to(
        ".summary-word",
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.04,
          ease: "power2.out",
        },
        ">0.1",
      )
      .to(
        ".gen-dot-1",
        { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" },
        ">0.1",
      )
      .to(
        ".bullet-1-word",
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.03,
          ease: "power2.out",
        },
        "<0.1",
      )
      .to(
        ".gen-dot-2",
        { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" },
        ">0.1",
      )
      .to(
        ".bullet-2-word",
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.03,
          ease: "power2.out",
        },
        "<0.1",
      );

    return tl;
  };

  const buildLeaveTL = () => {
    const tl = gsap.timeline();

    tl.to(
      ".gen-word",
      { opacity: 0, y: -2, duration: 0.15, stagger: -0.003 },
      0,
    )
      .to(".gen-dot", { scale: 0, opacity: 0, duration: 0.2 }, "<0.1")
      .to(
        ".kw-bg",
        {
          fill: "rgb(250,249,245)",
          stroke: "rgb(235,233,225)",
          duration: 0.3,
        },
        "<0.1",
      )
      .to(".kw-icon", { fill: "rgb(180,178,170)", duration: 0.3 }, "<")
      .to(".ai-glow", { opacity: 0, duration: 0.3 }, "<")
      .set(".gen-word", { y: 3 });

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
          02 / AI Writing
        </span>
        <h3 className="font-['Syne'] text-[19px] font-bold leading-tight tracking-[-0.02em] text-[#141413]">
          Instant Content.
        </h3>
        <p className="mt-2 max-w-[240px] text-[12.5px] font-light leading-relaxed text-[#66655f]">
          Input key skills. Instantly generate highly optimized, impactful
          bullet points.
        </p>
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(217,119,87,0.12) 0%, transparent 75%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex h-[62%] items-end justify-center pb-0">
        <svg
          className="h-full w-full max-w-[300px]"
          viewBox="0 0 280 150"
          fill="none"
        >
          <rect
            className="ai-glow"
            x="20"
            y="6"
            width="240"
            height="36"
            rx="8"
            fill="rgba(217,119,87,0.06)"
          />

          <g transform="translate(20, 8)">
            <rect
              x="0"
              y="0"
              width="240"
              height="32"
              rx="8"
              fill="rgb(255,255,255)"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />

            <path
              d="M 13 10 L 15 14 L 19 16 L 15 18 L 13 22 L 11 18 L 7 16 L 11 14 Z"
              fill="rgb(217,119,87)"
              opacity="0.8"
            />

            <g transform="translate(26, 9)">
              <g className="chip" transform="translate(0, 0)">
                <rect
                  className="kw-bg"
                  x="0"
                  y="0"
                  width="50"
                  height="14"
                  rx="4"
                  fill="rgb(250,249,245)"
                  stroke="rgb(235,233,225)"
                  strokeWidth="0.5"
                />
                <text
                  className="kw-icon"
                  x="25"
                  y="9.5"
                  fill="rgb(180,178,170)"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  React.js
                </text>
              </g>

              <g className="chip" transform="translate(56, 0)">
                <rect
                  className="kw-bg"
                  x="0"
                  y="0"
                  width="60"
                  height="14"
                  rx="4"
                  fill="rgb(250,249,245)"
                  stroke="rgb(235,233,225)"
                  strokeWidth="0.5"
                />
                <text
                  className="kw-icon"
                  x="30"
                  y="9.5"
                  fill="rgb(180,178,170)"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  Leadership
                </text>
              </g>

              <g className="chip" transform="translate(122, 0)">
                <rect
                  className="kw-bg"
                  x="0"
                  y="0"
                  width="44"
                  height="14"
                  rx="4"
                  fill="rgb(250,249,245)"
                  stroke="rgb(235,233,225)"
                  strokeWidth="0.5"
                />
                <text
                  className="kw-icon"
                  x="22"
                  y="9.5"
                  fill="rgb(180,178,170)"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  Node.js
                </text>
              </g>
            </g>

            <g transform="translate(204, 8)" className="ai-btn-group">
              <rect
                className="ai-btn-bg"
                x="0"
                y="0"
                width="28"
                height="16"
                rx="4"
                fill="rgb(217,119,87)"
              />
              <path
                d="M 14 4 C 14 6 15.5 7.5 17.5 7.5 C 15.5 7.5 14 9 14 11 C 14 9 12.5 7.5 10.5 7.5 C 12.5 7.5 14 6 14 4 Z"
                fill="white"
              />
            </g>
          </g>

          <g transform="translate(20, 48)">
            <rect
              x="0"
              y="0"
              width="240"
              height="102"
              rx="8"
              fill="rgb(255,255,255)"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />

            <line
              x1="0"
              y1="24"
              x2="6"
              y2="24"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="62"
              x2="6"
              y2="62"
              stroke="rgb(235,233,225)"
              strokeWidth="1"
            />

            <foreignObject x="16" y="10" width="216" height="84">
              <div
                {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                className="flex flex-col gap-[10px] font-sans"
              >
                <div className="flex flex-wrap items-center gap-x-[3px] gap-y-[3px]">
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    Senior
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    frontend
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    engineer
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    skilled
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    in
                  </span>
                  <span className="gen-word summary-word inline-block rounded-[2px] border border-[#d97757]/20 bg-[#d97757]/10 px-[3px] py-[1px] text-[6px] font-semibold text-[#d97757]">
                    React.js
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    and
                  </span>
                  <span className="gen-word summary-word inline-block rounded-[2px] border border-[#d97757]/20 bg-[#d97757]/10 px-[3px] py-[1px] text-[6px] font-semibold text-[#d97757]">
                    Node.js,
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    driving
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    scalable
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    solutions
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    with
                  </span>
                  <span className="gen-word summary-word inline-block text-[6.5px] text-[#66655f]">
                    strong
                  </span>
                  <span className="gen-word summary-word inline-block rounded-[2px] border border-[#d97757]/20 bg-[#d97757]/10 px-[3px] py-[1px] text-[6px] font-semibold text-[#d97757]">
                    Leadership.
                  </span>
                </div>

                <div className="mt-[1px] flex items-start gap-[5px]">
                  <span className="gen-dot gen-dot-1 mt-[0.5px] inline-block text-[7px] text-[#d97757]">
                    ●
                  </span>
                  <div className="flex flex-wrap items-center gap-x-[3px] gap-y-[3px]">
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      Spearheaded
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      the
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      migration
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      to
                    </span>
                    <span className="gen-word bullet-1-word inline-block rounded-[2px] border border-[#d97757]/20 bg-[#d97757]/10 px-[3px] py-[1px] text-[6px] font-semibold text-[#d97757]">
                      React.js
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      and
                    </span>
                    <span className="gen-word bullet-1-word inline-block rounded-[2px] border border-[#d97757]/20 bg-[#d97757]/10 px-[3px] py-[1px] text-[6px] font-semibold text-[#d97757]">
                      Node.js
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      architecture,
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      improving
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      performance
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] text-[#66655f]">
                      by
                    </span>
                    <span className="gen-word bullet-1-word inline-block text-[6.5px] font-medium text-[#141413]">
                      40%.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-[5px]">
                  <span className="gen-dot gen-dot-2 mt-[0.5px] inline-block text-[7px] text-[#d97757]">
                    ●
                  </span>
                  <div className="flex flex-wrap items-center gap-x-[3px] gap-y-[3px]">
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      Demonstrated
                    </span>
                    <span className="gen-word bullet-2-word inline-block rounded-[2px] border border-[#d97757]/20 bg-[#d97757]/10 px-[3px] py-[1px] text-[6px] font-semibold text-[#d97757]">
                      Leadership
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      by
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      mentoring
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      a
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      team
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      of
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] font-medium text-[#141413]">
                      5 developers
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      to
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      deliver
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      projects
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      ahead
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      of
                    </span>
                    <span className="gen-word bullet-2-word inline-block text-[6.5px] text-[#66655f]">
                      schedule.
                    </span>
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default AIContentWidget;
