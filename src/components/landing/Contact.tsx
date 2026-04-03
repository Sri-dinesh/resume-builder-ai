"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  type LucideIcon,
  Mail,
  MessageSquare,
  Send,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MagneticButton } from "./ui/MagneticButton";

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

const fadeSlideVariants = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-sm shadow-sm backdrop-blur-md",
        colorClasses,
      )}
      role={isError ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <span className="flex-1 font-medium leading-relaxed">{message}</span>
    </motion.div>
  );
});

StatusMessage.displayName = "StatusMessage";

const ContactMethodCard = ({
  icon: Icon,
  title,
  subtitle,
  href,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href?: string;
}) => {
  const CardContent = (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-card/30 p-6 transition-all duration-500 hover:border-primary/30 hover:bg-card/50 hover:shadow-[0_8px_30px_-10px_rgba(var(--primary),0.1)]"
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-[40px] transition-all duration-500 group-hover:bg-primary/10" />

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border/50 transition-transform duration-500 group-hover:scale-110 group-hover:ring-primary/30">
        <Icon className="h-5 w-5 text-foreground/80 transition-colors duration-500 group-hover:text-primary" />
      </div>
      <div>
        <h3 className="mb-1.5 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} className="block h-full">
      {CardContent}
    </a>
  ) : (
    <div className="h-full">{CardContent}</div>
  );
};

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
      } catch {
        setSubmitStatus("error");
        setSubmitError(
          "Failed to send the message. Please check your connection and try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form],
  );

  const isSuccess = submitStatus === "success";

  return (
    <section className="relative w-full py-12 md:py-16">
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 font-serif text-4xl font-light leading-none tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Let&apos;s build your <br className="md:hidden" />
            <span className="italic text-primary/90">next chapter.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
          >
            Whether you have a question, need support, or want to explore
            partnership opportunities, we&apos;re always ready to listen.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6 lg:col-span-4"
          >
            <ContactMethodCard
              icon={Mail}
              title="Email Us"
              subtitle="santhisridinesh@gmail.com"
              href="mailto:santhisridinesh@gmail.com"
            />
            <ContactMethodCard
              icon={MessageSquare}
              title="Support Chat"
              subtitle="Average response time: ~2 hours"
            />
            <ContactMethodCard
              icon={Zap}
              title="Feature Requests"
              subtitle="Got a cool idea? Let us know!"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-8"
          >
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:shadow-none sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:from-white/5" />
              <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative z-10 flex h-full flex-col justify-between space-y-6"
                  noValidate
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                              Your Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Jane Doe"
                                disabled={isSubmitting || isSuccess}
                                className="h-12 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
                                maxLength={100}
                              />
                            </FormControl>
                            <FormMessage className="text-xs opacity-90" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="jane@example.com"
                                disabled={isSubmitting || isSuccess}
                                className="h-12 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
                              />
                            </FormControl>
                            <FormMessage className="text-xs opacity-90" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="How can we help you today?"
                              disabled={isSubmitting || isSuccess}
                              className="h-12 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
                              maxLength={200}
                            />
                          </FormControl>
                          <FormMessage className="text-xs opacity-90" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                              Your Message
                            </FormLabel>
                            <span className="text-[10px] font-bold tracking-wider text-muted-foreground/50">
                              {form.watch("message")?.length || 0} / 2000
                            </span>
                          </div>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Share your thoughts, questions, or project details..."
                              disabled={isSubmitting || isSuccess}
                              className="min-h-[140px] resize-none rounded-xl border-border/50 bg-background/50 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/50 hover:border-border/80 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
                              maxLength={2000}
                            />
                          </FormControl>
                          <FormMessage className="text-xs opacity-90" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
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

                    <MagneticButton
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSuccess}
                      variant="primary"
                      size="lg"
                      className="w-full min-w-[200px] sm:w-auto"
                      rightIcon={
                        isSuccess ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Send className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                        )
                      }
                    >
                      {isSuccess ? "Message Sent" : "Send Message"}
                    </MagneticButton>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
