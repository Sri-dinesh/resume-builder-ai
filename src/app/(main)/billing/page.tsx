import { auth } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import stripe from "@/lib/billing/stripe";
import prisma from "@/lib/db/client";
import GetSubscriptionButton from "./GetSubscriptionButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import type { Metadata } from "next";
import type Stripe from "stripe";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const isExpired =
    subscription && subscription.stripeCurrentPeriodEnd < new Date();

  const activeSubscription = isExpired ? null : subscription;

  const priceInfo = activeSubscription
    ? await stripe.prices.retrieve(activeSubscription.stripePriceId, {
        expand: ["product"],
      })
    : null;



  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
        </span>
      </p>
      {activeSubscription ? (
        <>
          {activeSubscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will be canceled on{" "}
              {formatDate(activeSubscription.stripeCurrentPeriodEnd, "MMMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
