import { clerkClient } from "@clerk/nextjs/server";
import { env } from "@/env";
import stripe from "@/lib/billing/stripe";
import prisma from "@/lib/db/client";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    logger.info(`Stripe webhook received: ${event.type}`, {
      route: "/api/stripe-webhook",
    });

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`, {
          route: "/api/stripe-webhook",
        });
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    logger.error("Stripe webhook error", {
      route: "/api/stripe-webhook",
      error: error instanceof Error ? error.message : String(error),
    });
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const subscriptionItem = subscription.items.data[0];

  if (!subscriptionItem) {
    throw new Error(`Subscription ${subscriptionId} has no items`);
  }

  if (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due"
  ) {
    await prisma.userSubscription.upsert({
      where: {
        userId: subscription.metadata.userId,
      },
      create: {
        userId: subscription.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscriptionItem.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscriptionItem.current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        stripePriceId: subscriptionItem.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscriptionItem.current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } else {
    await prisma.userSubscription.deleteMany({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });
}
