import { createBrowserClient } from "@supabase/ssr";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!envSupabaseUrl) {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
}

if (!envSupabasePublishableKey) {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

const supabaseUrl: string = envSupabaseUrl;
const supabasePublishableKey: string = envSupabasePublishableKey;

export function getSupabaseBrowser() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}