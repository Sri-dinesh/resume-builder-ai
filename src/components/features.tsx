"use client";

import {
  Target,
  FileText,
  Layout,
  PenTool,
  Palette,
  Zap,
  Bot,
  FileCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, stagger } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "AI Content Generation",
    description: "Transform your experience into compelling bullet points.",
    icon: Bot,
    color:
      "from-blue-500/20 to-violet-500/20 dark:from-blue-500/10 dark:to-violet-500/10",
    decoration: (
      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-500/10 blur-md"></div>
    ),
  },
  {
    name: "ATS-Friendly Format",
    description: "Ensure your resume gets past Applicant Tracking Systems.",
    icon: FileCheck,
    color:
      "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
    decoration: (
      <div className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-green-500/10 blur-md"></div>
    ),
  },
  {
    name: "Job-Specific Targeting",
    description:
      "Customize your resume for specific job description with keyword optimization.",
    icon: Target,
    color:
      "from-red-500/20 to-orange-500/20 dark:from-red-500/10 dark:to-orange-500/10",
    decoration: (
      <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full border border-red-500/20"></div>
    ),
  },
  {
    name: "Multiple Format Export",
    description:
      "Export your resume in PDF, or print directly according to your need.",
    icon: FileText,
    color:
      "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10",
    decoration: (
      <div className="absolute -bottom-3 -left-3 h-10 w-10 rotate-12 rounded-md border border-purple-500/10"></div>
    ),
  },
  {
    name: "Smart Layout System",
    description:
      "Automatically organize your content with intelligent space management.",
    icon: Layout,
    color:
      "from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/10 dark:to-blue-500/10",
    decoration: (
      <div className="absolute bottom-2 right-2 h-4 w-4 rounded-sm bg-indigo-500/10"></div>
    ),
  },
  {
    name: "Real-Time Editing",
    description:
      "Edit and see changes in real-time with our interactive builder.",
    icon: PenTool,
    color:
      "from-amber-500/20 to-yellow-500/20 dark:from-amber-500/10 dark:to-yellow-500/10",
    decoration: (
      <div className="absolute left-3 top-3 h-3 w-3 rounded-full bg-amber-500/10"></div>
    ),
  },
  {
    name: "Quick Generation",
    description: "Create a professional resume in less than 10 minutes.",
    icon: Zap,
    color:
      "from-teal-500/20 to-green-500/20 dark:from-teal-500/10 dark:to-green-500/10",
    decoration: (
      <div className="absolute -right-2 top-2 h-7 w-7 rounded-full border border-teal-500/10"></div>
    ),
  },
  {
    name: "Custom Styling",
    description:
      "Personalize colors, fonts, and layouts to match your personal brand.",
    icon: Palette,
    color:
      "from-fuchsia-500/20 to-purple-500/20 dark:from-fuchsia-500/10 dark:to-purple-500/10",
    decoration: (
      <div className="absolute -left-1 bottom-1 h-6 w-6 rotate-45 rounded-md bg-fuchsia-500/10"></div>
    ),
  },
];

function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <motion.h2
            id="features-heading"
            variants={fadeIn}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Powerful Features for Your Perfect Resume
          </motion.h2>
          <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
            Our AI-powered platform provides all the tools you need to create
            professional, ATS-friendly resumes that get you noticed.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative h-full overflow-hidden border-border/50 transition-colors duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-lg bg-gradient-to-br opacity-80",
                        feature.color,
                      )}
                      aria-hidden="true"
                    />
                    <feature.icon
                      className="relative z-10 h-6 w-6 text-foreground"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold">{feature.name}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <div
                  className="h-1 w-0 bg-gradient-to-r from-primary to-violet-500 transition-all duration-300 group-hover:w-full dark:to-indigo-500"
                  aria-hidden="true"
                />
                {feature.decoration && (
                  <div aria-hidden="true">{feature.decoration}</div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
