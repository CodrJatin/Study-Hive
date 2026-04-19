"use server";

import { prisma } from "@/lib/prisma";

/**
 * Fetches the 3 most recently accessed hives for a user.
 * Deliberately lean: no nested topics. Uses _count for a
 * quick topic count signal instead of loading full arrays.
 */
export async function getRecentHives(userId: string) {
  const memberships = await prisma.hiveMember.findMany({
    where: { userId },
    orderBy: { lastAccessedAt: "desc" },
    take: 3,
    select: {
      hive: {
        select: {
          id: true,
          title: true,
          description: true,
          targetDate: true,
          deadlines: {
            where: { dueDate: { gte: new Date() } },
            orderBy: { dueDate: "asc" },
            take: 1,
            select: { dueDate: true },
          },
        },
      },
    },
  });

  return memberships.map((m) => m.hive);
}

/**
 * Fetches the 5 nearest future deadlines across all hives
 * the user belongs to. Selects only essential display fields.
 */
export async function getUpcomingDeadlines(userId: string) {
  return prisma.deadline.findMany({
    where: {
      hive: { members: { some: { userId } } },
      dueDate: { gt: new Date() },
    },
    orderBy: { dueDate: "asc" },
    take: 5,
    select: {
      id: true,
      title: true,
      dueDate: true,
      hive: { select: { title: true } },
    },
  });
}
