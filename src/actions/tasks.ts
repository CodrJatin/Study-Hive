"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
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

export async function createTask(
  userId: string,
  data: {
    title: string;
    dueDate?: Date;
    hiveId?: string;
    materialId?: string;
  }
) {
  if (!data.title?.trim()) {
    return { error: "Task title is required." };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        dueDate: data.dueDate,
        hiveId: data.hiveId,
        materialId: data.materialId,
        userId,
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
