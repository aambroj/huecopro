import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServer } from "@/lib/supabase-server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

if (!stripeSecretKey) {
  throw new Error("Falta STRIPE_SECRET_KEY");
}

if (!appUrl) {
  throw new Error("Falta NEXT_PUBLIC_APP_URL");
}

const stripe = new Stripe(stripeSecretKey);

type SubscriptionRow = {
  stripe_customer_id: string | null;
};

export async function POST() {
  try {
    const supabase = await getSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para abrir la facturación." },
        { status: 401 }
      );
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle<SubscriptionRow>();

    if (subscriptionError) {
      return NextResponse.json(
        { error: "No se pudo comprobar la suscripción." },
        { status: 500 }
      );
    }

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Todavía no hay un cliente de Stripe asociado a esta cuenta." },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/cuenta`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo abrir la facturación.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
