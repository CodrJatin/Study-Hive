import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Creates a Supabase client that is wired to both the incoming request
 * cookies (getAll) and the outgoing response cookies (setAll).
 * This is the ONLY client that can reliably refresh the Supabase session,
 * because it can write the updated tokens back to the response.
 *
 * Used exclusively inside `src/middleware.ts`.
 */
export async function updateSession(request: NextRequest) {
  // Start with a plain pass-through response so we can attach cookies to it.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First, write the cookies to the request so they are visible to
          // server components rendered in the same request cycle.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Recreate the response so later middleware can see the changes.
          supabaseResponse = NextResponse.next({ request });

          // Then write the cookies to the actual HTTP response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT write any business logic between createServerClient and
  // supabase.auth.getUser(). The session refresh happens inside getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
