"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const CoverLetterWidget = () => {
  const container = useRef<HTMLDivElement>(null);
  const masterTL = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });

      gsap.set(".doc-wrap", { y: 50, scale: 0.95 });
      gsap.set(".envelope-group", { y: 0 });
      gsap.set(".env-flap", { transformOrigin: "80px 40px" });
      gsap.set(".env-flap-open", {
        transformOrigin: "80px 40px",
        rotationX: 90,
        opacity: 0,
      });
      gsap.set(".wax-seal", { transformOrigin: "0px 0px", scale: 1 });
      gsap.set(".cl-word", { opacity: 0, y: 3 });

      tl.to(".wax-seal", {
        opacity: 0,
        scale: 0,
        duration: 0.15,
        ease: "power2.in",
      })
        .to(
          ".env-flap",
          { rotationX: 90, duration: 0.15, ease: "power1.in" },
          "<0.05",
        )
        .set(".env-flap", { opacity: 0 })
        .set(".env-flap-open", { opacity: 1 })
        .to(".env-flap-open", {
          rotationX: 180,
          duration: 0.15,
          ease: "power1.out",
        })
        .to(
          ".envelope-group",
          { y: 60, duration: 0.6, ease: "power2.inOut" },
          "<0.05",
        )
        .to(
          ".doc-wrap",
          { y: -120, scale: 1, duration: 0.6, ease: "back.out(1.1)" },
          "<",
        )
        .to(
          ".cl-word",
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.03,
            ease: "power2.out",
          },
          "<0.2",
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
      className="group relative flex h-full w-full flex-col justify-between overflow-hidden p-6 transition-colors duration-300"
      ref={container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="z-10 flex flex-col">
        <span className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 dark:text-muted-foreground/80">
          06 / Cover Letter
        </span>
        <h3 className="font-['Syne'] text-[19px] font-bold leading-tight tracking-[-0.02em] text-foreground">
          Context-Aware Letters.
        </h3>
        <p className="mt-2 max-w-[240px] text-[12.5px] font-light leading-relaxed text-muted-foreground">
          Instantly generate highly personalized cover letters perfectly matched
          to the job description.
        </p>
      </div>

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(217,119,87,0.12) 0%, transparent 75%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex h-[62%] items-end justify-center pb-2">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes env-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
          .float-wrapper { animation: env-float 4s ease-in-out infinite; }
        `,
          }}
        />
        <svg
          className="h-full w-full max-w-[300px]"
          viewBox="0 0 280 260"
          fill="none"
          style={{ perspective: "400px" }}
        >
          <clipPath id="letter-clip-box">
            <rect x="-20" y="-150" width="200" height="285" />
          </clipPath>

          <g transform="translate(60, 30)">
            <g className="float-wrapper">
              <g className="envelope-group">
                <path
                  d="M0,40 L160,40 L160,135 L0,135 Z"
                  fill="rgb(240,238,230)"
                />

                <g className="env-flap-open">
                  <path
                    d="M0,40 L80,105 L160,40 Z"
                    fill="rgb(235,233,225)"
                    stroke="rgb(230,228,220)"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </g>

                <g clipPath="url(#letter-clip-box)">
                  <g className="doc-wrap">
                    <rect
                      x="6"
                      y="0"
                      width="148"
                      height="200"
                      rx="6"
                      fill="rgb(255,255,255)"
                      stroke="rgb(230,228,220)"
                      strokeWidth="1"
                    />

                    <circle cx="26" cy="20" r="8" fill="rgb(240,238,230)" />
                    <rect
                      x="42"
                      y="16"
                      width="45"
                      height="4"
                      rx="2"
                      fill="rgb(225,223,215)"
                    />
                    <rect
                      x="42"
                      y="24"
                      width="30"
                      height="3"
                      rx="1.5"
                      fill="rgb(240,238,230)"
                    />
                    <line
                      x1="16"
                      y1="36"
                      x2="144"
                      y2="36"
                      stroke="rgb(245,244,240)"
                      strokeWidth="1"
                    />

                    <foreignObject x="12" y="44" width="136" height="200">
                      <div
                        {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
                        className="flex flex-col gap-[8px] font-sans"
                      >
                        <div className="flex flex-wrap items-center gap-x-[3px] gap-y-[3px]">
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            Dear
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            Hiring
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            Manager,
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-[3px] gap-y-[3px]">
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            I&apos;m
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            excited
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            to
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            apply
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            for
                          </span>
                          <span className="cl-word inline-block rounded-[2px] border border-primary/20 dark:border-primary/30 bg-primary/10 dark:bg-primary/20 px-[3px] py-[1px] text-[8px] font-bold text-primary">
                            Senior Frontend
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            role.
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            My
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            skills
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            in
                          </span>
                          <span className="cl-word inline-block rounded-[2px] border border-primary/20 dark:border-primary/30 bg-primary/10 dark:bg-primary/20 px-[3px] py-[1px] text-[8px] font-bold text-primary">
                            React ecosystem
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            align
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            perfectly.
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-[3px] gap-y-[3px]">
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            I
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            recently
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            led
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            a
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            team
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            to
                          </span>
                          <span className="cl-word inline-block rounded-[2px] border border-primary/20 dark:border-primary/30 bg-primary/10 dark:bg-primary/20 px-[3px] py-[1px] text-[8px] font-bold text-primary">
                            scale architecture
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            for
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            1M+
                          </span>
                          <span className="cl-word inline-block text-[8px] text-muted-foreground">
                            MAU.
                          </span>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                </g>

                <path
                  d="M0,40 L80,105 L160,40 L160,135 L0,135 Z"
                  fill="rgb(253,252,249)"
                  stroke="rgb(230,228,220)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />

                <g className="env-flap">
                  <path
                    d="M0,40 L80,105 L160,40 Z"
                    fill="rgb(250,249,245)"
                    stroke="rgb(230,228,220)"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <g className="wax-seal" transform="translate(80, 105)">
                    <circle r="8" fill="rgb(217,119,87)" />
                    <path
                      d="M0,-3 L2,-1 L4,0 L2,1 L0,3 L-2,1 L-4,0 L-2,-1 Z"
                      fill="white"
                      opacity="0.9"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default CoverLetterWidget;
