"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, CircleDollarSign, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MagneticButton } from "./ui/MagneticButton";

const PricingCard = ({
  title,
  price,
  period,
  features,
  isPopular = false,
  description,
  buttonText = "Get Started",
  delay = 0,
  className,
  tilt = 0,
  elevation = 0,
}: {
  title: string;
  price: string;
  period?: string;
  features: { text: string; isNew?: boolean }[];
  isPopular?: boolean;
  description: string;
  buttonText?: string;
  delay?: number;
  className?: string;
  tilt?: number;
  elevation?: number;
}) => {
  const [isMobile, setIsMobile] = React.useState(true);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: isMobile ? 0 : elevation }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        transform: !isMobile
          ? `perspective(2000px) rotateY(${tilt}deg)`
          : "none",
      }}
      className={cn(
        "group relative flex flex-col rounded-[2.5rem] border p-8 transition-all duration-700 md:p-10",
        isPopular
          ? "z-20 border-primary/40 bg-card shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] md:scale-105"
          : "z-10 border-border/40 bg-card/30 hover:border-border/60 dark:bg-card/10",
        className,
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg">
            <Award className="h-3 w-3" />
            Gold Standard
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col items-center text-center">
        <h3
          className={cn(
            "mb-4 font-serif text-2xl italic tracking-tight transition-colors",
            isPopular ? "text-foreground" : "text-foreground/70",
          )}
        >
          {title}
        </h3>

        <div className="mb-4 flex items-start justify-center">
          <span className="mt-2 font-serif text-3xl font-light text-foreground/40">
            $
          </span>
          <span className="font-serif text-7xl font-light tracking-tighter text-foreground md:text-8xl">
            {price.replace("$", "").replace(",", "")}
          </span>
          {period && (
            <span className="ml-1 mt-auto pb-4 text-sm font-medium text-foreground/30">
              {period}
            </span>
          )}
        </div>

        <p className="max-w-[180px] text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mb-10 flex-1 space-y-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm font-light text-foreground/80"
          >
            <div
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                isPopular ? "bg-primary" : "bg-foreground/20",
              )}
            />
            <span className="leading-tight">{feature.text}</span>
            {feature.isNew && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[8px] font-bold uppercase text-primary">
                New
              </span>
            )}
          </div>
        ))}
      </div>

      <Link href="/billing" className="w-full">
        <MagneticButton
          variant={isPopular ? "primary" : "outline"}
          size="md"
          className="w-full"
        >
          {buttonText}
        </MagneticButton>
      </Link>
    </motion.div>
  );
};

export const LandingPricing = () => {
  return (
    <section className="relative z-10 w-full overflow-visible py-32">
      <div className="relative z-10 mx-auto mb-10 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          <CircleDollarSign className="h-3 w-3" />
          Pricing Plans
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl"
        >
          Elevate your career. <br />
          <span className="italic text-muted-foreground/60">
            Choose your plan.
          </span>
        </motion.h2>
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-8">
          {/* Free Plan */}
          <PricingCard
            title="Starter"
            price="0"
            period="/mo"
            features={[
              { text: "1 Resume Creation" },
              { text: "Basic PDF Export" },
              { text: "Cover Letter Generator" },
            ]}
            description="Perfect for exploring our platform's power."
            buttonText="Try Now"
            delay={0.1}
            tilt={8}
            elevation={20}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Professional"
            price="9"
            period="/mo"
            features={[
              { text: "3 Resumes Creation" },
              { text: "Design Customization" },
              { text: "AI Content Generation" },
            ]}
            description="The gold standard for job seekers."
            isPopular={true}
            buttonText="Begin"
            delay={0}
            elevation={10}
          />

          {/* Pro Plus Plan */}
          <PricingCard
            title="Executive"
            price="19"
            period="/mo"
            features={[
              { text: "Unlimited Resumes Creation" },
              { text: "Enhance Old Resumes" },
              { text: "Advanced Design Customization" },
            ]}
            description="Ultimate power for serious career moves."
            buttonText="Get Started"
            delay={0.2}
            tilt={-8}
            elevation={20}
          />
        </div>
      </div>
    </section>
  );
};
