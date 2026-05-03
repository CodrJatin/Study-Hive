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

  // Verify membership and permission
  const membership = await prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: user.id, hiveId } },
    select: { role: true },
  });

  if (!membership) return { error: "You are not a member of this hive" };

  const { Permissions } = await import("@/lib/permissions");
  if (!Permissions.canAddItems(membership.role)) {
    return { error: "You do not have permission to add units" };
  }

  // Count existing units to set position
  const count = await prisma.unit.count({ where: { hiveId } });

  await prisma.unit.create({
    data: { hiveId, title: title.trim(), position: count, creatorId: user.id },
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

  // Derive hiveId from the unit — do not trust the client-supplied hiveId
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    select: { hiveId: true },
  });

  if (!unit) return { error: "Unit not found" };

  const derivedHiveId = unit.hiveId;

  // Verify membership and permission against the derived hiveId
  const membership = await prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: user.id, hiveId: derivedHiveId } },
    select: { role: true },
  });

  if (!membership) return { error: "You are not a member of this hive" };

  const { Permissions } = await import("@/lib/permissions");
  if (!Permissions.canAddItems(membership.role)) {
    return { error: "You do not have permission to add topics" };
  }

  const count = await prisma.topic.count({ where: { unitId } });

  await prisma.topic.create({
    data: { unitId, title: title.trim(), position: count, creatorId: user.id },
  });

  revalidatePath(`/hive/${derivedHiveId}/syllabus`);
  return null;
}

export async function deleteUnit(
  hiveId: string,
  unitId: string
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  try {
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
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

    if (!unit) return { error: "Unit not found" };

    const membership = unit.hive.members[0];
    if (!membership) return { error: "You are not a member of this hive" };

    const { Permissions } = await import("@/lib/permissions");
    if (!Permissions.canEditOrDeleteItem(membership.role, unit.creatorId || "", user.id)) {
      return { error: "You do not have permission to delete this unit" };
    }

    // Prisma's onDelete: Cascade on Unit.topics relation will delete all topics inside this unit
    await prisma.unit.delete({
      where: { id: unitId },
    });

    revalidatePath(`/hive/${hiveId}/syllabus`);
    return null;
  } catch (error) {
    console.error("Delete Unit Error:", error);
    return { error: "Failed to delete unit" };
  }
}

export async function deleteTopic(
  hiveId: string,
  topicId: string
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        unit: {
          include: {
            hive: {
              include: {
                members: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!topic) return { error: "Topic not found" };

    const membership = topic.unit.hive.members[0];
    if (!membership) return { error: "You are not a member of this hive" };

    const { Permissions } = await import("@/lib/permissions");
    if (!Permissions.canEditOrDeleteItem(membership.role, topic.creatorId || "", user.id)) {
      return { error: "You do not have permission to delete this topic" };
    }

    await prisma.topic.delete({
      where: { id: topicId },
    });

    revalidatePath(`/hive/${hiveId}/syllabus`);
    return null;
  } catch (error) {
    console.error("Delete Topic Error:", error);
    return { error: "Failed to delete topic" };
  }
}
