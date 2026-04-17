import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components.
 * The browser client manages its own session via localStorage / cookies.
 * Call this at the top of a Client Component or in a custom hook — it is
 * safe to create a new instance on every render because the underlying
 * client is a singleton per URL+key pair.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
