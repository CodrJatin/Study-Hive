"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { ensurePrismaUser } from "@/utils/auth-utils";

export async function getUserTasks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return prisma.task.findMany({
    where: { userId: user.id },
    include: {
      hive: { select: { title: true } },
      material: { select: { title: true } },
    },
    orderBy: [
      { isCompleted: "asc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function createTask(data: {
  title: string;
  dueDate?: Date;
  hiveId?: string;
  materialId?: string;
}) {
  if (!data.title?.trim()) {
    return { error: "Task title is required." };
  }

  try {
    const user = await ensurePrismaUser();

    const task = await prisma.task.create({
      data: {
        title: data.title,
        dueDate: data.dueDate,
        hiveId: data.hiveId,
        materialId: data.materialId,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tasks");

    return { task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task." };
  }
}

export async function toggleTaskComplete(taskId: string, isCompleted: boolean) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Authorization required." };

    // Verify ownership server-side — never trust the client's task ID alone
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { userId: true },
    });

    if (!task) return { error: "Task not found." };
    if (task.userId !== user.id) return { error: "Unauthorized." };

    await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tasks");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle task:", error);
    return { error: "Failed to update task." };
  }
}
