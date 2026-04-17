import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Next.js Middleware — runs on every matched request BEFORE page rendering.
 *
 * Responsibilities:
 * 1. Refresh the Supabase session (writes updated tokens back to cookies).
 * 2. Protect the /(app) route group: redirect unauthenticated users to /login.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Protect every route that lives under the /(app) route group.
  // These paths start with /dashboard, /hive, etc. — anything that is NOT
  // under /(auth) or the root marketing page.
  const isAppRoute =
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup") &&
    pathname !== "/";

  if (isAppRoute && !user) {
    // Build an absolute redirect URL that preserves the original host.
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Return the supabaseResponse — it already contains any refreshed cookies.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static  (static assets)
     *  - _next/image   (image optimisation)
     *  - favicon.ico, sitemap.xml, robots.txt
     *
     * This keeps the middleware light and avoids interfering with Next.js
     * internals or static file serving.
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
