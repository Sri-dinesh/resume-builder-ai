"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  Check,
  AlertCircle,
  Loader2,
  MessageSquare,
  Clock,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  subject: z.string().max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const SUCCESS_MESSAGE_DURATION = 5000;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

const fadeSlideVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
} as const;

interface StatusMessageProps {
  type: "error" | "success";
  message: string;
}

const StatusMessage = React.memo<StatusMessageProps>(({ type, message }) => {
  const isError = type === "error";
  const Icon = isError ? AlertCircle : Check;
  const colorClasses = isError
    ? "bg-destructive/10 text-destructive border-destructive/20"
    : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm shadow-sm backdrop-blur-sm",
        colorClasses,
      )}
      role={isError ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <span className="flex-1 leading-relaxed">{message}</span>
    </motion.div>
  );
});

StatusMessage.displayName = "StatusMessage";

const FeatureItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <motion.div variants={itemVariants} className="flex items-start gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-snug text-muted-foreground">
        {description}
      </p>
    </div>
  </motion.div>
);

const ContactInfo = React.memo(() => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="flex h-full flex-col lg:pr-10"
  >
    <div className="mb-10">
      <motion.h2
        variants={itemVariants}
        className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
      >
        Let&apos;s start a <br />
        <span className="text-primary">conversation</span>
      </motion.h2>
    </div>

    <div className="mb-10 grid gap-8">
      <FeatureItem
        icon={MessageSquare}
        title="Chat to support"
        description="Speak to our friendly team."
      />
      <FeatureItem
        icon={Zap}
        title="Feature Requests"
        description="Have an idea? We'd love to hear it."
      />
      <FeatureItem
        icon={Clock}
        title="Fast Response"
        description="We aim to respond to all inquiries within 24 hours."
      />
    </div>

    <motion.div variants={itemVariants} className="mt-auto pt-4">
      <a
        href="mailto:santhisridinesh@gmail.com"
        className="group inline-flex w-full items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-sm ring-1 ring-border/50 transition-transform group-hover:scale-105">
          <Mail className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-sm font-medium text-muted-foreground">
            Email us at
          </p>
          <p className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            santhisridinesh@gmail.com
          </p>
        </div>
      </a>
    </motion.div>
  </motion.div>
));

ContactInfo.displayName = "ContactInfo";

export const LandingContact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const onSubmit = useCallback(
    async (data: ContactFormValues) => {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitStatus("idle");

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
            name: data.firstName,
            email: data.email,
            subject:
              data.subject || "New Contact Form Submission from Spark CV",
            message: data.message,
            from_name: "Spark CV Contact Form",
            replyto: data.email,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitStatus("success");
          form.reset();
        } else {
          setSubmitStatus("error");
          setSubmitError(
            result.message || "Something went wrong. Please try again.",
          );
        }
      } catch (error) {
        setSubmitStatus("error");
        setSubmitError(
          "Failed to send the message. Please check your connection and try again.",
        );
        console.error("Contact form error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form],
  );

  const isSuccess = submitStatus === "success";

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-border/20 bg-background/40 p-6 shadow-xl sm:p-10 lg:p-14">
        <div className="relative z-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactInfo />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="w-full"
          >
            <div className="rounded-2xl border border-border/30 bg-card p-6 shadow-sm sm:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John Doe"
                              disabled={isSubmitting || isSuccess}
                              className="h-11 rounded-lg border-border/40 bg-background/50 px-4 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                              maxLength={100}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="john@example.com"
                              disabled={isSubmitting || isSuccess}
                              className="h-11 rounded-lg border-border/40 bg-background/50 px-4 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="How can we help?"
                            disabled={isSubmitting || isSuccess}
                            className="h-11 rounded-lg border-border/40 bg-background/50 px-4 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                            maxLength={200}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell us about your project or questions..."
                            disabled={isSubmitting || isSuccess}
                            className="min-h-[140px] resize-none rounded-lg border-border/40 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                            maxLength={2000}
                            rows={6}
                          />
                        </FormControl>
                        <div className="flex items-center justify-end">
                          <p className="text-xs text-muted-foreground">
                            {form.watch("message")?.length || 0} / 2000
                          </p>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <AnimatePresence mode="wait">
                    {submitError && (
                      <StatusMessage type="error" message={submitError} />
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {isSuccess && (
                      <StatusMessage
                        type="success"
                        message="Your message has been sent successfully! We'll get back to you soon."
                      />
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        <span>Sent Successfully</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
