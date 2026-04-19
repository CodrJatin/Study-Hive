"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MaterialType } from "@prisma/client";
import { ensurePrismaUser } from "@/utils/auth-utils";
import { getYouTubeMetadata, parseYouTubeUrl, YouTubePlaylistItem } from "@/utils/youtube";

type ActionError = { error: string };

// ─────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────

function detectType(url?: string): MaterialType {
  if (!url) return MaterialType.LINK;
  if (/\.pdf$/i.test(url)) return MaterialType.PDF;
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(url)) return MaterialType.IMAGE;
  if (/\.docx?$|docs\.google/i.test(url)) return MaterialType.DOC;
  return MaterialType.LINK;
}

function parseVideoRange(range: string): number[] {
  const indexes = new Set<number>();
  const tokens = range.trim().split(/[\s,]+/);
  for (const token of tokens) {
    if (!token) continue;
    const dashMatch = token.match(/^(\d+)-(\d+)$/);
    if (dashMatch) {
      const start = parseInt(dashMatch[1], 10);
      const end = parseInt(dashMatch[2], 10);
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
        indexes.add(i);
      }
    } else if (/^\d+$/.test(token)) {
      indexes.add(parseInt(token, 10));
    }
  }
  return Array.from(indexes).sort((a, b) => a - b);
}

// ─────────────────────────────────────────────────────────────────
// Simple material creation (non-YouTube: files, links, docs)
// ─────────────────────────────────────────────────────────────────

export async function createMaterial(
  title: string,
  type: MaterialType,
  hiveId?: string,
  url?: string,
  sizeBytes?: number
): Promise<ActionError | null> {
  try {
    const user = await ensurePrismaUser();
    if (!title.trim()) return { error: "Title is required" };

    const resolvedType = url ? detectType(url) : type;

    await prisma.material.create({
      data: {
        userId: user.id,
        hiveId: hiveId ?? null,
        title: title.trim(),
        type: resolvedType,
        url,
        sizeBytes,
      },
    });

    if (hiveId) revalidatePath(`/hive/${hiveId}/materials`);
    revalidatePath(`/dashboard/materials`);
    return null;
  } catch (err: any) {
    console.error("createMaterial failed:", err);
    return { error: err.message || "Failed to create material" };
  }
}

// ─────────────────────────────────────────────────────────────────
// Smart YouTube import — calls the YouTube API, caches playlist JSON
// ─────────────────────────────────────────────────────────────────

export async function createSmartMaterial(
  url: string,
  hiveId?: string
): Promise<ActionError | { materialId: string } | null> {
  try {
    const user = await ensurePrismaUser();

    // Verify it's actually a YouTube link before hitting the API
    const parsed = parseYouTubeUrl(url);
    if (!parsed) return { error: "Not a valid YouTube video or playlist URL" };

    let metadata;
    try {
      metadata = await getYouTubeMetadata(url);
    } catch (apiErr: any) {
      console.error("YouTube API error:", apiErr);
      return { error: apiErr?.message ?? "Failed to fetch YouTube metadata" };
    }

    const material = await prisma.material.create({
      data: {
        userId: user.id,
        hiveId: hiveId ?? null,
        title: metadata.title,
        channelName: metadata.channelName,
        type: metadata.type === "playlist" ? MaterialType.PLAYLIST : MaterialType.VIDEO,
        url,
        duration: metadata.totalDurationSeconds,
        playlistData: metadata.type === "playlist" ? (metadata.playlistData as object[]) : undefined,
      },
    });

    if (hiveId) revalidatePath(`/hive/${hiveId}/materials`);
    revalidatePath(`/dashboard/materials`);
    return { materialId: material.id };
  } catch (err: any) {
    console.error("createSmartMaterial failed:", err);
    return { error: err.message || "Failed to create smart material" };
  }
}

// ─────────────────────────────────────────────────────────────────
// Update an existing material
// ─────────────────────────────────────────────────────────────────

export async function updateMaterial(
  materialId: string,
  data: {
    title?: string;
    description?: string;
    url?: string;
    videoRange?: string;
  }
): Promise<ActionError | null> {
  try {
    const user = await ensurePrismaUser();

    const existing = await prisma.material.findUnique({
      where: { id: materialId },
      select: { hiveId: true, userId: true, playlistData: true },
    });

    if (!existing) return { error: "Material not found" };
    if (existing.userId !== user.id) return { error: "Unauthorized access" };

    let recalcDuration: number | undefined;
    let finalVideoRange: string | null | undefined;

    if (data.videoRange !== undefined) {
      if (!data.videoRange.trim()) {
        finalVideoRange = null;
        if (existing.playlistData) {
          const videos = existing.playlistData as YouTubePlaylistItem[];
          recalcDuration = videos.reduce((sum, v) => sum + v.durationSeconds, 0);
        }
      } else {
        const indexes = parseVideoRange(data.videoRange);
        if (indexes.length === 0) return { error: "Invalid video range format" };
        if (!existing.playlistData) return { error: "Can only set a video range on a playlist" };

        const videos = existing.playlistData as YouTubePlaylistItem[];
        const maxPos = videos.reduce((max, v) => Math.max(max, v.position), 0);
        const outOfRange = indexes.filter((i) => i < 1 || i > maxPos);
        if (outOfRange.length > 0) {
          return { error: `Positions ${outOfRange.join(", ")} out of range (1–${maxPos})` };
        }

        const selected = videos.filter((v) => indexes.includes(v.position));
        recalcDuration = selected.reduce((sum, v) => sum + v.durationSeconds, 0);
        finalVideoRange = data.videoRange.trim();
      }
    }

    await prisma.material.update({
      where: { id: materialId },
      data: {
        ...(data.title?.trim() ? { title: data.title.trim() } : {}),
        ...(data.url !== undefined ? { url: data.url } : {}),
        ...(finalVideoRange !== undefined ? { videoRange: finalVideoRange } : {}),
        ...(recalcDuration !== undefined ? { duration: recalcDuration } : {}),
        updatedAt: new Date(),
      },
    });

    if (existing.hiveId) revalidatePath(`/hive/${existing.hiveId}/materials`);
    revalidatePath(`/dashboard/materials`);
    return null;
  } catch (err: any) {
    console.error("updateMaterial failed:", err);
    return { error: err.message || "Failed to update material" };
  }
}

// ─────────────────────────────────────────────────────────────────
// Get personal (unassigned) materials
// ─────────────────────────────────────────────────────────────────

export async function getPersonalMaterials(userId: string) {
  return prisma.material.findMany({
    where: { userId, hiveId: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, type: true, url: true,
      sizeBytes: true, channelName: true, duration: true,
      videoRange: true, playlistData: true,
    },
  });
}

// ─────────────────────────────────────────────────────────────────
// Delete a material
// ─────────────────────────────────────────────────────────────────

export async function deleteMaterial(
  hiveId: string,
  materialId: string
): Promise<ActionError | null> {
  try {
    const user = await ensurePrismaUser();

    // Verification
    const existing = await prisma.material.findUnique({
      where: { id: materialId },
      select: { userId: true },
    });
    if (!existing) return { error: "Material not found" };
    if (existing.userId !== user.id) return { error: "Unauthorized" };

    await prisma.material.delete({ where: { id: materialId } });

    if (hiveId && hiveId !== "") revalidatePath(`/hive/${hiveId}/materials`);
    revalidatePath(`/dashboard/materials`);
    return null;
  } catch (err: any) {
    console.error("deleteMaterial failed:", err);
    return { error: err.message || "Failed to delete material" };
  }
}

// ─────────────────────────────────────────────────────────────────
// Toggle a single video's completion state
// ─────────────────────────────────────────────────────────────────

export async function toggleVideoProgress(
  materialId: string,
  hiveId: string,
  position: number,
  isCompleted: boolean
): Promise<ActionError | null> {
  try {
    const user = await ensurePrismaUser();

    const existing = await prisma.userMaterialProgress.findUnique({
      where: { userId_materialId: { userId: user.id, materialId } },
      select: { completedPositions: true },
    });

    const current: number[] = existing?.completedPositions ?? [];
    const next = isCompleted
      ? Array.from(new Set([...current, position])).sort((a, b) => a - b)
      : current.filter((p) => p !== position);

    await prisma.userMaterialProgress.upsert({
      where: { userId_materialId: { userId: user.id, materialId } },
      create: { userId: user.id, materialId, completedPositions: next },
      update: { completedPositions: next },
    });

    if (hiveId && hiveId !== "") {
      revalidatePath(`/hive/${hiveId}/materials/${materialId}`);
    } else {
      revalidatePath(`/dashboard/materials/${materialId}`);
    }
    return null;
  } catch (err: any) {
    console.error("toggleVideoProgress failed:", err);
    return { error: err.message || "Failed to update progress" };
  }
}
