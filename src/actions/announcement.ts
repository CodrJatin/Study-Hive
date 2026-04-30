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
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content: content || "",
        hiveId,
        authorId: user.id,
      },
      include: {
        author: { select: { name: true } }
      }
    });

    revalidatePath(`/hive/${hiveId}`);
    return { error: "", data: newAnnouncement } as any;
  } catch (error) {
    console.error("Announcement Error:", error);
    return { error: "Failed to post announcement" };
  }
}
