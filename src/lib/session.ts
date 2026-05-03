import "server-only";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { HiveRole } from "@/types/client-prisma";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type SessionUser = {
  id: string;
  email: string | undefined;
};

export type PrismaUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  avatarColor: string | null;
  avatarType: string;
  autoPlayHum: boolean;
  theme: string | null;
  createdAt: Date;
};

export type HiveMembership = {
  role: HiveRole;
  hiveId: string;
  userId: string;
};

// ─────────────────────────────────────────────────────────────────
// getCurrentSupabaseUser()
//
// Memoized within a single request. Returns null if not logged in.
// Use this when you want to handle the unauthenticated case yourself.
// ─────────────────────────────────────────────────────────────────
export const getCurrentSupabaseUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
});

// ─────────────────────────────────────────────────────────────────
// requireUser()
//
// Same as getCurrentSupabaseUser() but redirects to /login if
// unauthenticated. Use in page/layout shells that must be protected.
// ─────────────────────────────────────────────────────────────────
export const requireUser = cache(async (): Promise<SessionUser> => {
  const user = await getCurrentSupabaseUser();
  if (!user) redirect("/login");
  return user;
});

// ─────────────────────────────────────────────────────────────────
// getCurrentPrismaUser()
//
// Returns the full Prisma user row for the current session user.
// Memoized per request. Returns null if not logged in or not found.
// ─────────────────────────────────────────────────────────────────
export const getCurrentPrismaUser = cache(async (): Promise<PrismaUser | null> => {
  const sessionUser = await getCurrentSupabaseUser();
  if (!sessionUser) return null;

  return prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      avatarColor: true,
      avatarType: true,
      autoPlayHum: true,
      theme: true,
      createdAt: true,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
// getHiveMembership(hiveId)
//
// Returns the current user's HiveMember row for a given hive, or
// null if not a member or not logged in. Memoized per (request, hiveId).
// ─────────────────────────────────────────────────────────────────
export const getHiveMembership = cache(async (hiveId: string): Promise<HiveMembership | null> => {
  const sessionUser = await getCurrentSupabaseUser();
  if (!sessionUser) return null;

  return prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: sessionUser.id, hiveId } },
    select: { role: true, hiveId: true, userId: true },
  });
});

// ─────────────────────────────────────────────────────────────────
// requireHiveMembership(hiveId)
//
// Like getHiveMembership() but redirects to /dashboard if the user
// is not a member. Use in hive page/layout shells.
// ─────────────────────────────────────────────────────────────────
export const requireHiveMembership = cache(async (hiveId: string): Promise<HiveMembership> => {
  const membership = await getHiveMembership(hiveId);
  if (!membership) redirect("/dashboard");
  return membership;
});
