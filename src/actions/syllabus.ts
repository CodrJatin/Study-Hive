"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TopicStatus } from "@prisma/client";

export async function toggleTopicStatus(topicId: string, currentStatus: TopicStatus, hiveId: string) {
  const nextStatus = currentStatus === TopicStatus.COMPLETED 
    ? TopicStatus.NOT_STARTED 
    : TopicStatus.COMPLETED;

  await prisma.topic.update({
    where: { id: topicId },
    data: { status: nextStatus }
  });

  revalidatePath(`/hive/${hiveId}/syllabus`);
  return nextStatus;
}
