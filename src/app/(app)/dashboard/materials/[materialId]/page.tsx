import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { StudyPlayer } from "@/components/materials/StudyPlayer";
import type { YouTubePlaylistItem } from "@/utils/youtube";

// ─────────────────────────────────────────────────────────────────
// Server-side helpers
// ─────────────────────────────────────────────────────────────────

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

function resolvePlayerVideos(
  material: {
    type: string;
    url: string | null;
    title: string;
    duration: number | null;
    videoRange: string | null;
    playlistData: unknown;
  }
): YouTubePlaylistItem[] {
  if (material.type === "VIDEO" && material.url) {
    let videoId = "";
    try {
      const u = new URL(material.url);
      videoId =
        u.searchParams.get("v") ??
        (u.hostname === "youtu.be" ? u.pathname.replace(/^\//, "") : "") ??
        u.pathname.match(/\/embed\/([^/?]+)/)?.[1] ??
        "";
    } catch {
      videoId = "";
    }
    return [
      {
        id: videoId,
        title: material.title,
        durationSeconds: material.duration ?? 0,
        position: 1,
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          : undefined,
      },
    ];
  }

  const allVideos = (material.playlistData ?? []) as YouTubePlaylistItem[];
  if (!allVideos.length) return [];

  if (material.videoRange) {
    const selectedPositions = parseVideoRange(material.videoRange);
    return allVideos
      .filter((v) => selectedPositions.includes(v.position))
      .sort(
        (a, b) =>
          selectedPositions.indexOf(a.position) -
          selectedPositions.indexOf(b.position)
      );
  }

  return [...allVideos].sort((a, b) => a.position - b.position);
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default async function PersonalMaterialPlayerPage({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) {
  const { materialId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch material — must belong to the user and have NO hive
  const material = await prisma.material.findFirst({
    where: { id: materialId, userId: user.id, hiveId: null },
    select: {
      id: true,
      title: true,
      type: true,
      url: true,
      duration: true,
      videoRange: true,
      playlistData: true,
      channelName: true,
    },
  });

  if (!material) return notFound();
  if (material.type !== "VIDEO" && material.type !== "PLAYLIST") return notFound();

  const videos = resolvePlayerVideos(material);

  const progressRecord = await prisma.userMaterialProgress.findUnique({
    where: { userId_materialId: { userId: user.id, materialId } },
    select: { completedPositions: true },
  });
  const initialCompletedPositions: number[] = progressRecord?.completedPositions ?? [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/materials"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          Back to My Materials
        </Link>
      </div>

      <StudyPlayer
        materialTitle={material.title}
        channelName={material.channelName ?? undefined}
        videos={videos}
        materialId={materialId}
        initialCompletedPositions={initialCompletedPositions}
      />
    </div>
  );
}
