"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleMaterialComplete(materialId: string, completed: boolean) {
  // In a real app, you would verify the user's session and update the DB here
  // await prisma.topic.update({ ... })
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  revalidatePath('/hive/[hiveId]/track/[trackId]', 'page');
}
