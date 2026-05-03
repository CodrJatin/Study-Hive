import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CacheTags } from "@/lib/cache-tags";

/**
 * Full syllabus data for a hive (tracks, units, topics, user progress).
 * userId is part of the cache key (serialized argument) so each user
 * gets their own cached copy with their own progress data.
 */
export async function getSyllabusCached(hiveId: string, userId: string) {
  "use cache";
  cacheTag(CacheTags.hiveSyllabus(hiveId));
  cacheLife("minutes");

  const [tracks, units] = await Promise.all([
    prisma.track.findMany({
      where: { hiveId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        _count: { select: { trackTopics: true } },
      },
    }),
    prisma.unit.findMany({
      where: { hiveId },
      orderBy: { position: "asc" },
      include: {
        topics: {
          orderBy: { position: "asc" },
          include: {
            topicProgress: {
              where: { userId },
              select: { status: true },
            },
          },
        },
      },
    }),
  ]);

  return { tracks, units };
}
