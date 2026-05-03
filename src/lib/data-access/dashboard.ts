import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CacheTags } from "@/lib/cache-tags";

/**
 * Fetches the 3 most recently accessed hives for a user.
 * Deliberately lean: no nested topics.
 */
export async function getRecentHivesCached(userId: string) {
  "use cache";
  cacheTag(CacheTags.userHives(userId));
  cacheLife("minutes");

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
          icon: true,
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
 * the user belongs to.
 */
export async function getUpcomingDeadlinesCached(userId: string) {
  "use cache";
  cacheTag(CacheTags.userDeadlines(userId));
  cacheLife("minutes");

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

/**
 * Fetches all hives for a user.
 */
export async function getAllHivesCached(userId: string) {
  "use cache";
  cacheTag(CacheTags.userHives(userId));
  cacheLife("minutes");

  const memberships = await prisma.hiveMember.findMany({
    where: { userId },
    orderBy: { lastAccessedAt: "desc" },
    select: {
      hive: {
        select: {
          id: true,
          title: true,
          description: true,
          targetDate: true,
          icon: true,
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
