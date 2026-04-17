"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/** Shape returned when an action fails. */
type AuthError = { error: string };

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
    return { error: error.message };
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
  _prevState: AuthError | null,
  formData: FormData
): Promise<AuthError | null> {
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

  // Supabase sign up
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          name: username,
          email: email,
        },
      });
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return { error: "Failed to initialize user profile." };
    }
  }

  // Supabase may require email confirmation depending on project settings.
  // If email confirmation is disabled the user is immediately logged in and
  // we redirect to the dashboard; otherwise they will receive a confirmation
  // email — either way we land them on the dashboard route which the
  // middleware will handle if they are not yet confirmed.
  redirect("/dashboard");
}

/**
 * Server Action — Sign the current user out.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
