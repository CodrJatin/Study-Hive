"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOCK_USER_ID = "cm0x_mock_user_1";

export async function createAnnouncement(hiveId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.announcement.create({
    data: {
      title,
      content,
      hiveId,
      authorId: MOCK_USER_ID,
    },
  });

  revalidatePath(`/hive/${hiveId}`);
}
