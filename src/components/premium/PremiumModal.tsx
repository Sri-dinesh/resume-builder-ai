"use client";

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Check, Zap, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { createCheckoutSession } from "./actions";

const premiumFeatures = [
  "Basic Design Customization",
  "Up to 3 resumes",
  "AI Features",
];
const premiumPlusFeatures = [
  "Everything in Premium",
  "Infinite resumes",
  "Design customizations",
];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] w-full max-w-4xl gap-0 overflow-y-auto p-0">
        {/* Header */}
        <div className="rounded-t-lg bg-purple-600 px-6 py-6 sm:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            SparkCV Premium
          </h1>
          <p className="mt-1 text-sm text-purple-100">
            Get a premium subscription to unlock more features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Premium Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Premium Pro
                </h3>
                <p className="mt-2 text-2xl font-bold text-purple-600">
                  $9.99<span className="text-sm text-gray-600">/mo</span>
                </p>
              </div>

              <div className="mb-6 space-y-2 sm:space-y-3">
                {premiumFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="flex-shrink-0 rounded-full bg-purple-100 p-1">
                      <Check className="h-3 w-3 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                  )
                }
                disabled={loading}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Get Premium"}
              </Button>
            </div>

            {/* Premium Plus Card */}
            <div className="relative rounded-lg border-2 border-purple-600 bg-purple-50 p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6">
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-purple-600 px-2.5 py-1 text-white shadow-md">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-bold">Popular</span>
              </div>

              <div className="mb-4 pr-20">
                <h3 className="text-lg font-bold text-purple-700 sm:text-xl">
                  Premium Plus
                </h3>
                <p className="mt-2 text-2xl font-bold text-purple-600">
                  $19.99<span className="text-sm text-gray-600">/mo</span>
                </p>
              </div>

              <div className="mb-6 space-y-2 sm:space-y-3">
                {premiumPlusFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="flex-shrink-0 rounded-full bg-purple-200 p-1">
                      <Check className="h-3 w-3 text-purple-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                disabled={loading}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Get Premium Plus"}
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              All plans include 30-day money back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
