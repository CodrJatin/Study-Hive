"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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
  const content = formData.get("content") as string;

  if (!title?.trim()) {
    return { error: "A title is required" };
  }

  try {
    await prisma.announcement.create({
      data: {
        title,
        content: content || "",
        hiveId,
        authorId: user.id,
      },
    });

    revalidatePath(`/hive/${hiveId}`);
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

    revalidatePath(`/hive/${hiveId}`);
    return null;
  } catch (error) {
    console.error("Delete Announcement Error:", error);
    return { error: "Failed to delete announcement" };
  }
}
