"use client";

import { useAuth } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  User,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MagneticButton } from "./ui/MagneticButton";

const TypingText = ({
  text,
  delay = 0,
  className = "",
  speed = 0.02,
  as: Component = "div",
}: {
  text: string;
  delay?: number;
  className?: string;
  speed?: number;
  as?: React.ElementType;
}) => {
  return (
    <Component className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * speed, duration: 0 }}
        >
          {char}
        </motion.span>
      ))}
    </Component>
  );
};

const useHydratedScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { scrollYProgress } = useScroll(
    isHydrated
      ? { target: containerRef, offset: ["start start", "end start"] }
      : undefined,
  );

  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return { y, scale, isHydrated };
};

export const LandingHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const { y, scale, isHydrated } = useHydratedScroll(containerRef);

  const handleBuildResume = async () => {
    setIsLoading(true);
    router.push("/editor");
  };

  const handleDashboard = () => {
    setDashboardLoading(true);
    router.push("/resumes");
  };

  if (!isHydrated) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden pb-10 pt-24 text-center lg:pb-16 lg:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md">
          <Award className="h-4 w-4 text-primary" />
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-foreground">
            AI Resume Builder
          </span>
        </div>
        <h1 className="mb-4 px-4 font-serif text-[40px] font-bold leading-none tracking-[-0.02em] text-foreground md:text-[64px]">
          <span className="mb-2 block text-foreground dark:text-white">
            Stop Getting{" "}
            <span className="text-primary opacity-90">Rejected.</span>
          </span>
          <span className="block text-foreground dark:text-white">
            Start Getting{" "}
            <span className="text-primary opacity-90">Interviews.</span>
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl px-6 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
          AI-powered resumes that beat the bots, grab recruiter attention, and
          land interviews. Build yours in 5 minutes.
        </p>
        <div className="relative z-20 mb-12 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            size="lg"
            variant="primary"
            className="opacity-50"
            disabled
          >
            Start Building
          </MagneticButton>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden pb-10 pt-24 text-center lg:pb-16 lg:pt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md transition-colors hover:bg-primary/20"
      >
        <Award className="h-4 w-4 text-primary" />
        <span className="font-display text-xs uppercase tracking-wide text-primary">
          AI Resume Builder
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 px-4 font-serif text-[40px] font-bold leading-none tracking-[-0.02em] text-foreground md:text-[64px]"
      >
        <span className="mb-2 block text-foreground dark:text-white">
          Stop Getting{" "}
          <span className="text-primary opacity-90">Rejected.</span>
        </span>
        <span className="block text-foreground dark:text-white">
          Start Getting{" "}
          <span className="text-primary opacity-90">Interviews.</span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mx-auto mb-8 max-w-2xl px-6 text-base font-light leading-relaxed text-muted-foreground md:text-lg"
      >
        AI-powered resumes that beat the bots, grab recruiter attention, and
        land interviews. Build yours in 5 minutes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 mb-12 flex flex-wrap items-center justify-center gap-4"
      >
        <div className="relative w-full sm:w-auto">
          <MagneticButton
            onClick={handleBuildResume}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            isLoading={isLoading}
            rightIcon={
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            }
          >
            Start Building
          </MagneticButton>
        </div>

        {isSignedIn && (
          <MagneticButton
            variant="outline"
            size="lg"
            onClick={handleDashboard}
            isLoading={dashboardLoading}
            disabled={isLoading}
            leftIcon={
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            }
          >
            Dashboard
          </MagneticButton>
        )}
      </motion.div>

      <motion.div
        style={{ y, scale }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-6xl px-4"
      >
        <div className="absolute left-1/2 top-1/3 -z-10 h-[400px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/15" />

        <div className="group relative overflow-hidden rounded-xl border border-white/60 bg-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_32px_rgba(0,0,0,0.04)] ring-1 ring-black/5 backdrop-blur-2xl transition-all hover:border-white/80 dark:border-white/10 dark:bg-black/40 dark:shadow-none dark:hover:shadow-none md:rounded-2xl">
          <div className="flex h-12 items-center justify-between border-b border-border/10 bg-card px-4 md:px-6">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full border border-red-500/30 bg-red-500/20 hover:bg-[#FF605C]" />
              <div className="h-3 w-3 rounded-full border border-yellow-500/30 bg-yellow-500/20 hover:bg-[#FFBD44]" />
              <div className="h-3 w-3 rounded-full border border-green-500/30 bg-green-500/20 hover:bg-[#00CA4E]" />
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border/10 bg-secondary px-4 py-1.5 shadow-sm md:flex">
              <Globe className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                SparkCV
              </span>
            </div>
            <div className="w-16" />
          </div>

          <div className="relative flex h-[500px] bg-card md:h-[600px]">
            <div className="hidden w-64 flex-col gap-2 border-r border-border/10 bg-card p-4 md:flex">
              <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sections
              </div>
              {[
                { icon: User, label: "Personal Info" },
                { icon: Layers, label: "Summary" },
                { icon: Briefcase, label: "Experience", active: true },
                { icon: GraduationCap, label: "Education" },
                { icon: Award, label: "Skills" },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={item.active}
                  aria-label={`Go to ${item.label} section`}
                  className={`relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-card ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.active && (
                    <motion.div
                      layoutId="active-pill"
                      className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}

              <div className="mt-auto rounded-xl border border-primary/10 bg-gradient-to-br from-primary/10 to-transparent p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    AI Score
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  92
                  <span className="text-sm font-normal text-muted-foreground">
                    /100
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[92%] rounded-full bg-primary" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> Top 5% of
                  candidates
                </div>
              </div>
            </div>

            <div className="relative flex flex-1 justify-center overflow-hidden bg-muted/30 p-8 md:p-12">
              <div
                className="absolute inset-0 z-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(hsl(var(--border) / 0.2) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex h-full w-full max-w-[700px] flex-col overflow-hidden rounded-sm border border-border/10 bg-card p-8 text-left shadow-md dark:shadow-none md:p-10"
              >
                <div className="mb-6 flex items-start justify-between border-b border-border/20 pb-6">
                  <div className="flex flex-col gap-1.5">
                    <TypingText
                      text="Alex Morgan"
                      delay={1}
                      className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl"
                      speed={0.05}
                      as="h1"
                    />
                    <TypingText
                      text="Senior Product Designer"
                      delay={1.8}
                      className="text-base font-medium text-primary md:text-lg"
                      speed={0.03}
                      as="h2"
                    />

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      className="mt-2 flex flex-wrap gap-3 text-[10px] font-medium text-muted-foreground md:text-xs"
                    >
                      <span className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                        <Mail className="h-3 w-3" /> alex.morgan@design.co
                      </span>
                      <span className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                        <MapPin className="h-3 w-3" /> San Francisco, CA
                      </span>
                      <span className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                        <Phone className="h-3 w-3" /> (555) 123-4567
                      </span>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 2, type: "spring" }}
                    className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/10 bg-secondary text-lg font-bold text-foreground/20 md:h-14 md:w-14"
                  >
                    AM
                  </motion.div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="border-b border-border/10 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Professional Summary
                    </h3>
                    <TypingText
                      text="Results-oriented Senior Product Designer with 6+ years of experience building accessible, user-centric digital products for enterprise SaaS."
                      delay={3}
                      className="text-xs leading-relaxed text-foreground/80 md:text-sm"
                      speed={0.01}
                      as="p"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="border-b border-border/10 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Experience
                    </h3>

                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.5 }}
                        className="absolute -left-4 top-0.5"
                      >
                        <Briefcase className="h-3 w-3 text-primary" />
                      </motion.div>

                      <div className="mb-1 flex items-baseline justify-between">
                        <TypingText
                          text="Senior Product Designer"
                          delay={4.5}
                          className="text-xs font-bold text-foreground md:text-sm"
                          as="h4"
                        />
                        <TypingText
                          text="Jan 2021 - Present"
                          delay={5}
                          className="text-[10px] font-medium text-muted-foreground"
                          as="span"
                        />
                      </div>
                      <TypingText
                        text="TechFlow Inc."
                        delay={4.8}
                        className="mb-2 block text-[10px] font-semibold text-primary md:text-xs"
                        as="div"
                      />

                      <ul className="list-disc space-y-1.5 pl-4 text-xs text-foreground/70 marker:text-primary/60">
                        <li>
                          <TypingText
                            text="Spearheaded the redesign of the core mobile application, resulting in a 45% increase in daily active users."
                            delay={5.5}
                            speed={0.015}
                            as="span"
                          />
                        </li>
                        <li>
                          <TypingText
                            text="Established a comprehensive design system used by 30+ designers and developers."
                            delay={8}
                            speed={0.015}
                            as="span"
                          />
                        </li>
                      </ul>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 10 }}
                    className="flex flex-col gap-2 opacity-80"
                  >
                    <h3 className="border-b border-border/10 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Figma",
                        "React",
                        "Design Systems",
                        "Prototyping",
                        "User Research",
                      ].map((skill, i) => (
                        <span
                          key={i}
                          className="cursor-default rounded-md border border-border/10 bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 5, duration: 0.5 }}
                  className="absolute bottom-6 right-6 z-20 w-48 rounded-xl border border-primary/20 bg-card/95 p-3 shadow-lg backdrop-blur dark:shadow-none md:w-56"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-foreground">
                      AI Assistant
                    </span>
                  </div>
                  <div className="text-[10px] leading-relaxed text-muted-foreground">
                    Optimizing bullet points for impact. Added metrics and
                    action verbs.
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
