import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";

type SubscriptionRow = {
  status: string | null;
};

function normalizeStatus(value: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export async function requireActiveSubscription() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle<SubscriptionRow>();

  if (error) {
    redirect("/cuenta?subscription=error");
  }

  const normalizedStatus = normalizeStatus(subscription?.status ?? null);

  const hasAccess =
    normalizedStatus === "active" || normalizedStatus === "trialing";

  if (!hasAccess) {
    redirect("/cuenta?subscription=required");
  }

  return {
    user,
    subscriptionStatus: normalizedStatus,
  };
}
