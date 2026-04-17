"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HiveRole } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

/** Shape returned when a hive action fails. */
type HiveActionError = { error: string };

export async function createHive(
  formData: FormData
): Promise<HiveActionError | null> {
  // ── 1. Authenticate ────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return a structured error rather than throwing, so the caller can
    // surface a friendly message in the UI.
    return { error: "You must be signed in to create a Hive." };
  }

  // ── 2. Extract form data ────────────────────────────────────────────────────
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const subject = formData.get("subject") as string;

  if (!title?.trim()) {
    return { error: "A Hive title is required." };
  }

  // ── 3. Persist via Prisma ───────────────────────────────────────────────────
  try {
    await prisma.hive.create({
      data: {
        title,
        description,
        subject: subject || "General",
        members: {
          create: {
            // Use the real authenticated user's ID — no more mock IDs.
            userId: user.id,
            role: HiveRole.ADMIN,
          },
        },
      },
    });

    // Revalidate the dashboard so the new HiveCard appears instantly.
    revalidatePath("/dashboard");
    return null;
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to create Hive. Please try again." };
  }
}

export async function deleteHive(hiveId: string): Promise<HiveActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authorization required" };
  }

  try {
    // Verify user is an ADMIN of the hive
    const membership = await prisma.hiveMember.findUnique({
      where: {
        userId_hiveId: {
          userId: user.id,
          hiveId: hiveId,
        },
      },
    });

    if (!membership || membership.role !== HiveRole.ADMIN) {
      return { error: "Only admins can delete the hive" };
    }

    await prisma.hive.delete({
      where: { id: hiveId },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Failed to delete hive" };
  }

  redirect("/dashboard");
  return null;
}

export async function updateHive(
  hiveId: string,
  _prevState: HiveActionError | null,
  formData: FormData
): Promise<HiveActionError | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authorization required" };
  }

  const title = formData.get("title") as string;
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;

  if (!title?.trim()) {
    return { error: "Hive name is required" };
  }

  try {
    // Verify user is an ADMIN of the hive
    const membership = await prisma.hiveMember.findUnique({
      where: {
        userId_hiveId: {
          userId: user.id,
          hiveId: hiveId,
        },
      },
    });

    if (!membership || membership.role !== HiveRole.ADMIN) {
      return { error: "Only admins can update the hive details" };
    }

    await prisma.hive.update({
      where: { id: hiveId },
      data: {
        title,
        subject,
        description,
      },
    });

    revalidatePath(`/hive/${hiveId}/settings`);
    revalidatePath("/dashboard");
    
    // Success - return null to indicate no error
    return null;
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update hive details" };
  }
}

export async function addDeadline(
  hiveId: string,
  _prevState: HiveActionError | null,
  formData: FormData
): Promise<HiveActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  const title = formData.get("title") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!title?.trim() || !dueDateStr) {
    return { error: "Title and date are required" };
  }

  try {
    await prisma.deadline.create({
      data: {
        title,
        dueDate: new Date(dueDateStr),
        hiveId,
      },
    });

    revalidatePath(`/hive/${hiveId}`);
    return null;
  } catch (error) {
    console.error("Add Deadline Error:", error);
    return { error: "Failed to add deadline" };
  }
}

export async function deleteDeadline(
  hiveId: string,
  deadlineId: string
): Promise<HiveActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  try {
    await prisma.deadline.delete({
      where: { id: deadlineId },
    });

    revalidatePath(`/hive/${hiveId}`);
    return null;
  } catch (error) {
    console.error("Delete Deadline Error:", error);
    return { error: "Failed to delete deadline" };
  }
}

export async function removeMember(
  hiveId: string,
  memberId: string
): Promise<HiveActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  try {
    // 1. Verify caller is an ADMIN of this hive
    const callerMembership = await prisma.hiveMember.findUnique({
      where: {
        userId_hiveId: {
          userId: user.id,
          hiveId: hiveId,
        },
      },
    });

    if (!callerMembership || callerMembership.role !== HiveRole.ADMIN) {
      return { error: "Only admins can remove members" };
    }

    // 2. Prevent removing the last admin (caller themselves or another admin)
    // Actually, the UI already prevents showing the button for Admins.
    // For extra safety, we ensure target is not the caller.
    const targetMember = await prisma.hiveMember.findUnique({
      where: { id: memberId },
    });

    if (!targetMember) return { error: "Member not found" };
    if (targetMember.role === HiveRole.ADMIN) {
      return { error: "Admins cannot be removed via this action" };
    }

    // 3. Delete membership
    await prisma.hiveMember.delete({
      where: { id: memberId },
    });

    revalidatePath(`/hive/${hiveId}/settings`);
    return null;
  } catch (error) {
    console.error("Remove Member Error:", error);
    return { error: "Failed to remove member" };
  }
}