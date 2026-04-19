"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MaterialType } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { getYouTubeMetadata, parseYouTubeUrl, YouTubePlaylistItem } from "@/utils/youtube";

type ActionError = { error: string };

// ─────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────

function detectType(url?: string): MaterialType {
  if (!url) return MaterialType.LINK;
  if (/\.pdf$/i.test(url)) return MaterialType.PDF;
  if (/\.docx?$|docs\.google/i.test(url)) return MaterialType.DOC;
  return MaterialType.LINK;
}

/**
 * Parses a video range string like "1-5 10 12" into an array of 1-based indexes.
 * Supports:
 *   - Single numbers: "5" → [5]
 *   - Ranges: "1-5" → [1,2,3,4,5]
 *   - Mixed / space or comma delimited: "1-3 7, 9" → [1,2,3,7,9]
 */
function parseVideoRange(range: string): number[] {
  const indexes = new Set<number>();
  // Split on whitespace and/or commas
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
  hiveId: string,
  title: string,
  type: MaterialType,
  url?: string,
  sizeBytes?: number
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };
  if (!title.trim()) return { error: "Title is required" };

  const resolvedType = url ? detectType(url) : type;

  await prisma.material.create({
    data: { hiveId, title: title.trim(), type: resolvedType, url, sizeBytes },
  });

  revalidatePath(`/hive/${hiveId}/materials`);
  return null;
}

// ─────────────────────────────────────────────────────────────────
// Smart YouTube import — calls the YouTube API, caches playlist JSON
// ─────────────────────────────────────────────────────────────────

export async function createSmartMaterial(
  hiveId: string,
  url: string
): Promise<ActionError | { materialId: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };

  // Verify it's actually a YouTube link before hitting the API
  const parsed = parseYouTubeUrl(url);
  if (!parsed) return { error: "Not a valid YouTube video or playlist URL" };

  let metadata;
  try {
    metadata = await getYouTubeMetadata(url);
  } catch (err: any) {
    console.error("YouTube API error:", err);
    return { error: err?.message ?? "Failed to fetch YouTube metadata" };
  }

  const material = await prisma.material.create({
    data: {
      hiveId,
      title: metadata.title,
      channelName: metadata.channelName,
      // TypeScript knows metadata.type is strictly "video" | "playlist"
      type: metadata.type === "playlist"
        ? MaterialType.PLAYLIST
        : MaterialType.VIDEO,
      url,
      duration: metadata.totalDurationSeconds,
      // Same check here for the JSON data
      playlistData: metadata.type === "playlist"
        ? (metadata.playlistData as object[])
        : undefined,
    },
  });

  revalidatePath(`/hive/${hiveId}/materials`);
  return { materialId: material.id };
}

// ─────────────────────────────────────────────────────────────────
// Update an existing material (with optional video-range recalculation)
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };

  // Fetch current record for playlist cache + hiveId for revalidation
  const existing = await prisma.material.findUnique({
    where: { id: materialId },
    select: { hiveId: true, playlistData: true, duration: true },
  });
  if (!existing) return { error: "Material not found" };

  // ── Video range recalculation uses the JSON cache, never hits YouTube API ──
  let recalcDuration: number | undefined;
  let finalVideoRange: string | null | undefined;

  if (data.videoRange !== undefined) {
    if (!data.videoRange.trim()) {
      // Empty string = clear range, restore full playlist duration
      finalVideoRange = null;
      if (existing.playlistData) {
        const videos = existing.playlistData as YouTubePlaylistItem[];
        recalcDuration = videos.reduce((sum, v) => sum + v.durationSeconds, 0);
      }
    } else {
      const indexes = parseVideoRange(data.videoRange);
      if (indexes.length === 0) return { error: "Invalid video range format" };

      if (!existing.playlistData) {
        return { error: "Can only set a video range on a playlist material" };
      }

      const videos = existing.playlistData as YouTubePlaylistItem[];
      const maxPosition = videos.reduce((max, v) => Math.max(max, v.position), 0);
      const outOfRange = indexes.filter((i) => i < 1 || i > maxPosition);
      if (outOfRange.length > 0) {
        return {
          error: `Video positions ${outOfRange.join(", ")} are out of range (1–${maxPosition})`,
        };
      }

      const selectedVideos = videos.filter((v) => indexes.includes(v.position));
      recalcDuration = selectedVideos.reduce((sum, v) => sum + v.durationSeconds, 0);
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

  revalidatePath(`/hive/${existing.hiveId}/materials`);
  return null;
}

// ─────────────────────────────────────────────────────────────────
// Delete a material (+ optionally its Supabase storage file)
// ─────────────────────────────────────────────────────────────────

export async function deleteMaterial(
  hiveId: string,
  materialId: string
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };

  await prisma.material.delete({ where: { id: materialId } });
  revalidatePath(`/hive/${hiveId}/materials`);
  return null;
}

// ─────────────────────────────────────────────────────────────────
// Toggle a single video's completion state (per-user, per-material)
// ─────────────────────────────────────────────────────────────────

export async function toggleVideoProgress(
  materialId: string,
  hiveId: string,
  position: number,
  isCompleted: boolean // true = mark as done, false = mark as not done
): Promise<ActionError | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authorization required" };

  // Find existing record (if any) so we can merge positions
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

  revalidatePath(`/hive/${hiveId}/materials/${materialId}`);
  return null;
}
