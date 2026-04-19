"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TopicStatus } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

type ActionError = { error: string };

export async function toggleTopicStatus(topicId: string, currentStatus: TopicStatus, hiveId: string) {
  // Auth guard — every mutation must verify session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const nextStatus = currentStatus === TopicStatus.COMPLETED
    ? TopicStatus.NOT_STARTED
    : TopicStatus.COMPLETED;

  await prisma.userTopicProgress.upsert({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId: topicId,
      },
    },
    create: {
      userId: user.id,
      topicId: topicId,
      status: nextStatus,
    },
    update: {
      status: nextStatus,
    },
  });

  revalidatePath(`/hive/${hiveId}/syllabus`);
  revalidatePath(`/hive/${hiveId}`); // updates HiveOverviewCard mastery progress
  revalidatePath(`/dashboard`); // update dashboard overview
  revalidatePath(`/dashboard/hives`); // update dashboard hives
  return nextStatus;
}

export async function createUnit(
  hiveId: string,
  title: string
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };

  if (!title.trim()) return { error: "Title is required" };

  // Count existing units to set position
  const count = await prisma.unit.count({ where: { hiveId } });

  await prisma.unit.create({
    data: { hiveId, title: title.trim(), position: count },
  });

  revalidatePath(`/hive/${hiveId}/syllabus`);
  return null;
}

export async function createTopic(
  unitId: string,
  hiveId: string,
  title: string
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };

  if (!title.trim()) return { error: "Title is required" };

  const count = await prisma.topic.count({ where: { unitId } });

  await prisma.topic.create({
    data: { unitId, title: title.trim(), position: count },
  });

  revalidatePath(`/hive/${hiveId}/syllabus`);
  return null;
}
