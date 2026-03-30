"use client";

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { MagneticButton } from "@/components/landing/ui/MagneticButton";
import { createCheckoutSession } from "./actions";

const proFeatures = [
  "Up to 3 resumes",
  "Basic design customization",
  "AI content generation",
];

const proPlusFeatures = [
  "Unlimited resumes",
  "Enhance old resumes",
  "Advanced customization",
];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePremiumClick(priceId: string, tier: string) {
    try {
      setLoading(tier);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!loading) setOpen(openState);
      }}
    >
      <DialogContent className="max-w-[420px] overflow-hidden border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden rounded-3xl border border-border/40 bg-card/95 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        >
          <div className="px-8 pt-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="font-serif text-2xl font-medium tracking-tight text-foreground"
            >
              Upgrade to Pro
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="mt-1.5 text-sm text-muted-foreground"
            >
              Unlock your full potential
            </motion.p>
          </div>

          <div className="mt-6 space-y-3 px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-background"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    Professional
                  </h3>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-[13px] font-medium text-muted-foreground">
                      $
                    </span>
                    <span className="font-serif text-[26px] font-semibold tracking-tight text-foreground">
                      9
                    </span>
                    <span className="text-[13px] font-medium text-muted-foreground">
                      .99
                    </span>
                    <span className="ml-0.5 text-[13px] font-medium text-muted-foreground">
                      /mo
                    </span>
                  </div>
                </div>
                <MagneticButton
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 text-[13px]"
                  isLoading={loading === "pro"}
                  onClick={() =>
                    handlePremiumClick(
                      env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                      "pro",
                    )
                  }
                >
                  Choose
                </MagneticButton>
              </div>

              <div className="mt-4 space-y-2">
                {proFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 text-[13px] text-foreground/80"
                  >
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                      strokeWidth={2}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-primary/40 bg-primary/[0.03] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    Professional Plus
                  </h3>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-[13px] font-medium text-muted-foreground">
                      $
                    </span>
                    <span className="font-serif text-[26px] font-semibold tracking-tight text-foreground">
                      19
                    </span>
                    <span className="text-[13px] font-medium text-muted-foreground">
                      .99
                    </span>
                    <span className="ml-0.5 text-[13px] font-medium text-muted-foreground">
                      /mo
                    </span>
                  </div>
                </div>
                <MagneticButton
                  variant="primary"
                  size="sm"
                  className="h-9 px-4 text-[13px]"
                  isLoading={loading === "pro-plus"}
                  onClick={() =>
                    handlePremiumClick(
                      env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                      "pro-plus",
                    )
                  }
                >
                  Choose
                </MagneticButton>
              </div>

              <div className="mt-4 space-y-2">
                {proPlusFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 text-[13px] font-medium text-foreground"
                  >
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-primary"
                      strokeWidth={2}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="mt-6 border-t border-border/30 px-8 py-4 text-center"
          >
            <p className="text-[11px] font-medium text-muted-foreground/70">
              Cancel anytime. 30-day money-back guarantee.
            </p>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
