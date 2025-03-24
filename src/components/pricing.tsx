"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn, stagger } from "@/lib/animations";
import { useRouter } from "next/navigation";
const tiers = [
  {
    name: "Free",
    id: "tier-free",
    price: "$0",
    description: "Perfect for trying out our platform.",
    features: [
      "1 Resume Creation",
      "Basic AI Writing Assistance",
      "PDF Export",
      "ATS-Friendly Format",
      "24-hour Support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    id: "tier-pro",
    price: "$9.99",
    description: "Best for students and freshers.",
    features: [
      "3 Resumes Creation",
      "AI Features",
      "Advanced AI Content Generation",
      "Multiple Resume Versions",
      "Cover Letter Builder",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Pro Plus",
    id: "tier-enterprise",
    price: "$19.99",
    description: "Best for job seekers and professionals.",
    features: [
      "All Pro Features",
      "Infinite Resume Creation",
      "Design Customizations",
      "AI Features",
      "Bulk Resume Generation",
    ],
    cta: "Get Started",
  },
];

export default function Pricing() {
  const router = useRouter();

  return (
    <section
      id="pricing"
      className="container space-y-16 overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:px-8"
      aria-labelledby="pricing-heading"
    >
      <div
        className="absolute left-0 top-1/4 -z-10 h-24 w-24 rounded-full bg-primary/5 blur-xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-1/3 right-0 -z-10 h-32 w-32 rounded-full bg-violet-500/5 blur-xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-1/4 left-1/4 -z-10 h-16 w-16 rounded-full bg-indigo-500/5 blur-xl"
        aria-hidden="true"
      ></div>
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="mx-auto max-w-[58rem] text-center"
      >
        <motion.h2
          id="pricing-heading"
          variants={fadeIn}
          className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl"
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          variants={fadeIn}
          className="mt-4 text-muted-foreground sm:text-lg"
        >
          Choose the perfect plan according to your needs.
        </motion.p>
      </motion.div>
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            variants={fadeIn}
            custom={index}
            whileHover={{
              scale: tier.featured ? 1.03 : 1.05,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
          >
            <Card
              className={`flex flex-col transition-all duration-300 ${
                tier.featured
                  ? "relative border-primary shadow-lg before:absolute before:inset-0 before:scale-105 before:rounded-lg before:border before:border-primary before:opacity-10"
                  : "hover:border-primary/50 hover:shadow-md"
              } focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2`}
            >
              {tier.featured && (
                <motion.div
                  className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  aria-hidden="true"
                >
                  Popular
                </motion.div>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </motion.div>
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      className="flex items-center gap-2"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: [0, 15, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check
                          className="h-4 w-4 flex-shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      </motion.div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full transition-all duration-300 ${
                    tier.featured
                      ? "bg-primary hover:bg-primary/90 hover:shadow-md"
                      : "hover:bg-primary/10 hover:text-primary"
                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
                  variant={tier.featured ? "default" : "outline"}
                  onClick={() => router.push("/billing")}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
              {tier.name === "Free" && (
                <div
                  className="absolute right-6 top-6 opacity-10"
                  aria-hidden="true"
                ></div>
              )}
              {tier.name === "Pro" && (
                <div
                  className="absolute right-6 top-6 opacity-10"
                  aria-hidden="true"
                ></div>
              )}
              {tier.name === "Enterprise" && (
                <div
                  className="absolute right-6 top-6 opacity-10"
                  aria-hidden="true"
                ></div>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
