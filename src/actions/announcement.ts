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
        content: content || "", // Allow empty content
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
