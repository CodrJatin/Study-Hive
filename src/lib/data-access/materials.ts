import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CacheTags } from "@/lib/cache-tags";

export async function getHiveMaterialsCached(hiveId: string) {
  "use cache";
  cacheTag(CacheTags.hiveMaterials(hiveId));
  cacheLife("minutes");

  return prisma.material.findMany({
    where: { hiveId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, type: true, url: true,
      sizeBytes: true, channelName: true, duration: true,
      videoRange: true, playlistData: true, userId: true,
      user: { select: { name: true } },
    },
  });
}

export async function getPersonalMaterialsCached(userId: string) {
  "use cache";
  cacheTag(CacheTags.userMaterials(userId));
  cacheLife("minutes");

  return prisma.material.findMany({
    where: { userId, hiveId: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, type: true, url: true,
      sizeBytes: true, channelName: true, duration: true,
      videoRange: true, playlistData: true, userId: true,
    },
  });
}
