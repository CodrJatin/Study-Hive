import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CacheTags } from "@/lib/cache-tags";

/**
 * Hive overview data: announcements, deadlines, member count, description.
 * Used by the hive overview page (hive/[hiveId]/page.tsx).
 */
export async function getHiveOverviewCached(hiveId: string) {
  "use cache";
  cacheTag(CacheTags.hiveOverview(hiveId));
  cacheLife("minutes");

  const [hive, announcements, deadlines, memberCount] = await Promise.all([
    prisma.hive.findUnique({
      where: { id: hiveId },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        targetDate: true,
      },
    }),
    prisma.announcement.findMany({
      where: { hiveId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        author: { select: { name: true, image: true, avatarColor: true, avatarType: true } },
      },
    }),
    prisma.deadline.findMany({
      where: { hiveId },
      orderBy: { dueDate: "asc" },
      select: {
        id: true,
        title: true,
        dueDate: true,
        creatorId: true,
      },
    }),
    prisma.hiveMember.count({ where: { hiveId } }),
  ]);

  return { hive, announcements, deadlines, memberCount };
}

/**
 * Hive settings data: members and invites.
 */
export async function getHiveSettingsCached(hiveId: string) {
  "use cache";
  cacheTag(CacheTags.hiveSettings(hiveId));
  cacheLife("minutes");

  const [members, invites] = await Promise.all([
    prisma.hiveMember.findMany({
      where: { hiveId },
      include: {
        user: {
          select: { name: true, email: true, image: true, avatarColor: true, avatarType: true },
        },
      },
      orderBy: { role: "asc" },
    }),
    prisma.hiveInvite.findMany({
      where: { hiveId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { members, invites };
}
