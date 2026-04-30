"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ensurePrismaUser } from "@/utils/auth-utils";
import { getBaseUrl } from "@/utils/get-url";

/** Shape returned when an action fails. */
type AuthError = { error: string };

/** Shape returned when signup succeeds but email verification is pending. */
type SignupPending = { pending: "check_email"; email: string };

/**
 * Server Action — Log in with email + password.
 *
 * On success, redirects to /dashboard.
 * On failure, returns { error: string } so the Client Component can display
 * the message without crashing the app.
 *
 * Signature matches what useActionState expects:
 *   (prevState: AuthError | null, formData: FormData) => Promise<AuthError | null>
 */
export async function login(
  _prevState: AuthError | null,
  formData: FormData
): Promise<AuthError | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Please verify your email before signing in. Check your inbox for a confirmation link." };
    }
    return { error: error.message };
  }

  // Sync the Prisma user record with any latest user_metadata (e.g. username set at signup)
  try {
    await ensurePrismaUser();
  } catch {
    // Non-fatal: proceed to dashboard even if sync fails
  }

  // redirect() throws internally — it must be called OUTSIDE a try/catch.
  redirect("/dashboard");
}

/**
 * Server Action — Register a new account with email + password.
 *
 * On success, redirects to /dashboard.
 * On failure, returns { error: string }.
 */
export async function signup(
  _prevState: AuthError | SignupPending | null,
  formData: FormData
): Promise<AuthError | SignupPending | null> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !username || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  // Include the display name in user_metadata so ensurePrismaUser can pick it up
  // when the verification callback fires. We do NOT create a Prisma record yet —
  // the callback's ensurePrismaUser upsert handles that after email is confirmed.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: username },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is disabled in Supabase, the user is immediately
  // confirmed and we can redirect straight to the dashboard.
  if (data.user?.email_confirmed_at) {
    redirect("/dashboard");
  }

  // Email confirmation is required — tell the UI to show the "check email" screen.
  return { pending: "check_email", email };
}


/**
 * Server Action — Sign the current user out.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Server Action — Sign in with Google OAuth.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}
