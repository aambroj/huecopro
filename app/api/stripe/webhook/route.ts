import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("Falta STRIPE_SECRET_KEY");
}

if (!webhookSecret) {
  throw new Error("Falta STRIPE_WEBHOOK_SECRET");
}

const stripe = new Stripe(stripeSecretKey);
const stripeWebhookSecret: string = webhookSecret;

type SubscriptionRow = {
  user_id: string;
};

function toIsoDate(unixSeconds: number | null | undefined) {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

async function findUserIdForSubscription(
  subscription: Stripe.Subscription,
  customerId: string
) {
  const metadataUserId = subscription.metadata?.user_id?.trim();

  if (metadataUserId) {
    return metadataUserId;
  }

  const { data: bySubscription } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle<SubscriptionRow>();

  if (bySubscription?.user_id) {
    return bySubscription.user_id;
  }

  const { data: byCustomer } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle<SubscriptionRow>();

  if (byCustomer?.user_id) {
    return byCustomer.user_id;
  }

  const customer = await stripe.customers.retrieve(customerId);

  if (!customer.deleted) {
    const customerMetadataUserId = customer.metadata?.user_id?.trim();

    if (customerMetadataUserId) {
      return customerMetadataUserId;
    }
  }

  return null;
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const userId = await findUserIdForSubscription(subscription, customerId);

  if (!userId) return;

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id ?? null;
  const currentPeriodStart = firstItem?.current_period_start ?? null;
  const currentPeriodEnd = firstItem?.current_period_end ?? null;

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      price_id: priceId,
      plan: subscription.metadata?.plan || "autonomoagenda_monthly",
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      current_period_start: toIsoDate(currentPeriodStart),
      current_period_end: toIsoDate(currentPeriodEnd),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Falta la firma de Stripe." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Firma de Stripe no válida.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          session.mode === "subscription" &&
          typeof session.subscription === "string"
        ) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription
          );
          await syncSubscription(subscription);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo procesar el webhook.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}