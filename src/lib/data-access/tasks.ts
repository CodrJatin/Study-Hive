import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CacheTags } from "@/lib/cache-tags";

export async function getUserTasksCached(userId: string) {
  "use cache";
  cacheTag(CacheTags.userTasks(userId));
  cacheLife("minutes");

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
