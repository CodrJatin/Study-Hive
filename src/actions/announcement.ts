"use server";

import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";
import { CacheTags } from "@/lib/cache-tags";
import { createClient } from "@/utils/supabase/server";

export type AnnouncementActionError = { error: string };

export async function createAnnouncement(
  hiveId: string, 
  _prevState: AnnouncementActionError | null, 
  formData: FormData
): Promise<AnnouncementActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authorization required" };
  }

  const title = formData.get("title") as string;

  if (!title?.trim()) {
    return { error: "A title is required" };
  }

  // Verify membership and permission before writing
  const membership = await prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: user.id, hiveId } },
    select: { role: true },
  });

  if (!membership) return { error: "You are not a member of this hive" };

  const { Permissions } = await import("@/lib/permissions");
  if (!Permissions.canAddItems(membership.role)) {
    return { error: "You do not have permission to post announcements" };
  }

  try {
    await prisma.announcement.create({
      data: {
        title,
        hiveId,
        authorId: user.id,
      },
    });

    updateTag(CacheTags.hiveOverview(hiveId));
    return null;
  } catch (error) {
    console.error("Announcement Error:", error);
    return { error: "Failed to post announcement" };
  }
}

export async function deleteAnnouncement(
  hiveId: string,
  announcementId: string
): Promise<AnnouncementActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        hive: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!announcement) return { error: "Announcement not found" };

    const membership = announcement.hive.members[0];
    if (!membership) return { error: "You are not a member of this hive" };

    const { Permissions } = await import("@/lib/permissions");
    if (!Permissions.canEditOrDeleteItem(membership.role, announcement.authorId, user.id)) {
      return { error: "You do not have permission to delete this announcement" };
    }

    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    updateTag(CacheTags.hiveOverview(hiveId));
    return null;
  } catch (error) {
    console.error("Delete Announcement Error:", error);
    return { error: "Failed to delete announcement" };
  }
}
