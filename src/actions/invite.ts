"use server";

import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";
import { CacheTags } from "@/lib/cache-tags";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Permissions } from "@/lib/permissions";

export type InviteActionError = { error: string };

// ─────────────────────────────────────────
// Create a new invite link
// ─────────────────────────────────────────
export async function createInvite(
  hiveId: string,
  expiresInHours: number | null
): Promise<InviteActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  // Verify caller is an ADMIN of this hive (canManageHive === ADMIN-only)
  const membership = await prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: user.id, hiveId } },
    select: { role: true },
  });

  if (!membership || !Permissions.canManageHive(membership.role)) {
    return { error: "Only hive admins can create invite links" };
  }

  const expiresAt = expiresInHours
    ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
    : null;

  try {
    await prisma.hiveInvite.create({
      data: {
        hiveId,
        creatorId: user.id,
        expiresAt,
      },
    });

    updateTag(CacheTags.hiveSettings(hiveId));
    return null;
  } catch (error) {
    console.error("createInvite error:", error);
    return { error: "Failed to create invite link" };
  }
}

// ─────────────────────────────────────────
// Delete / revoke an invite link
// ─────────────────────────────────────────
export async function deleteInvite(
  hiveId: string,
  inviteId: string
): Promise<InviteActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  // Verify caller is an ADMIN of this hive
  const membership = await prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: user.id, hiveId } },
    select: { role: true },
  });

  if (!membership || !Permissions.canManageHive(membership.role)) {
    return { error: "Only hive admins can revoke invite links" };
  }

  // Fetch the invite first to verify it belongs to this hive
  // (prevents cross-hive deletion by supplying an unrelated hiveId)
  const invite = await prisma.hiveInvite.findUnique({
    where: { id: inviteId },
    select: { hiveId: true },
  });

  if (!invite) return { error: "Invite not found" };
  if (invite.hiveId !== hiveId) return { error: "Invite does not belong to this hive" };

  try {
    await prisma.hiveInvite.delete({ where: { id: inviteId } });

    updateTag(CacheTags.hiveSettings(hiveId));
    return null;
  } catch (error) {
    console.error("deleteInvite error:", error);
    return { error: "Failed to revoke invite link" };
  }
}

// ─────────────────────────────────────────
// Accept an invite — join the hive
// ─────────────────────────────────────────
export async function acceptInvite(code: string): Promise<InviteActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to join a Hive" };

  const invite = await prisma.hiveInvite.findUnique({
    where: { code },
  });

  if (!invite) {
    return { error: "This invite link is invalid or has been revoked" };
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return { error: "This invite link has expired" };
  }

  try {
    // Upsert to handle duplicate joins gracefully
    await prisma.hiveMember.upsert({
      where: { userId_hiveId: { userId: user.id, hiveId: invite.hiveId } },
      create: { userId: user.id, hiveId: invite.hiveId, role: "MEMBER" },
      update: {},
    });
  } catch (error) {
    console.error("acceptInvite error:", error);
    return { error: "Failed to join the Hive. Please try again." };
  }

  redirect(`/hive/${invite.hiveId}`);
}
