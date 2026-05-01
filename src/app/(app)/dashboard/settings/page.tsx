import React from "react";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/settings/SettingsClient";

// ─────────────────────────────────────────
// Page — server component
// ─────────────────────────────────────────
export default async function AppSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      name: true,
      email: true,
      image: true,
      avatarColor: true,
      createdAt: true,
      theme: true,
      autoPlayHum: true,
      avatarType: true,
    },
  });

  if (!user) redirect("/login");

  const name = user.name ?? "Scholar";
  const email = user.email ?? authUser.email ?? "";
  const image = user.image ?? null;
  const avatarColor = user.avatarColor ?? "#fdc003";
  const avatarType = user.avatarType ?? "image";
  
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
 
  const joinedAt = user.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }).format(user.createdAt) + " IST"
    : "—";
 
  // Initial prefs from User table
  const initialPrefs = {
    theme: user.theme,
    autoPlayHum: user.autoPlayHum,
    avatarColor: avatarColor,
    avatarType: avatarType,
  };

  const profile = {
    name,
    email,
    image,
    avatarColor: avatarColor,
    avatarType: avatarType,
    initials,
    joinedAt,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 px-4">
      {/* ── Page header ─────────────────────────────── */}
      <div className="mt-8 md:mt-12">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">
          Settings
        </h1>
        <p className="text-on-surface-variant mt-1">
          Manage your account and app preferences.
        </p>
      </div>

      {/* ── Client Content ─────────────────────────── */}
      <SettingsClient initialPrefs={initialPrefs} profile={profile} />
    </div>
  );
}

