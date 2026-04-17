import React from "react";
import { acceptInvite } from "@/actions/invite";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login and come back
  if (!user) {
    redirect(`/login?redirect=/join/${code}`);
  }

  // Attempt to accept the invite (will redirect on success)
  const result = await acceptInvite(code);

  // If we get here, there was an error
  const errorMessage = result?.error ?? "Something went wrong";

  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-4xl p-10 clay-card text-center space-y-6">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-error text-3xl">
            link_off
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">
            Invite Invalid
          </h1>
          <p className="text-on-surface-variant mt-2">{errorMessage}</p>
        </div>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3 cta-gradient text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined">home</span>
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
