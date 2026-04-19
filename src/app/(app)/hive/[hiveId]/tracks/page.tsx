import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TrackCard } from "@/components/tracks/TrackCard";
import { AddTrackCard } from "@/components/tracks/AddTrackCard";

// ─────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────

function TrackCardSkeleton() {
  return (
    <div className="clay-card bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/10 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-high" />
        <div className="w-20 h-6 bg-surface-container-high rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-surface-container-high rounded-lg w-2/3" />
        <div className="h-3 bg-surface-container-high rounded w-full" />
        <div className="h-3 bg-surface-container-high rounded w-4/5" />
      </div>
      <div className="h-2 bg-surface-container-high rounded-full w-full" />
    </div>
  );
}

function TracksGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[0, 1, 2].map((i) => <TrackCardSkeleton key={i} />)}
    </div>
  );
}

// ─────────────────────────────────────────
// Async Widgets
// ─────────────────────────────────────────

async function TracksGrid({ hiveId }: { hiveId: string }) {
  const [tracks, materials] = await Promise.all([
    prisma.track.findMany({
      where: { hiveId },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        progress: true,
        targetDate: true,
        _count: { select: { trackTopics: true } },
      },
    }),
    prisma.material.findMany({
      where: { hiveId },
      select: { id: true, title: true, type: true },
    }),
  ]);

  const mappedTracks = tracks.map((track) => ({
    id: track.id,
    title: track.name,
    description: track.description,
    creator: "Me",
    progress: track.progress || 0,
    colorScheme: track.type === "QUICK_ADD" ? "primary" : "secondary",
    icon: track.type === "QUICK_ADD" ? "route" : "work",
    statusBadge: track.type.replace("_", " "),
    statusColor: track.type === "QUICK_ADD" ? "primary" : "secondary",
    materialsCount: track._count.trackTopics * 2,
    daysLeft: track.targetDate
      ? Math.max(0, Math.ceil((new Date(track.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {mappedTracks.map((track) => (
        <TrackCard key={track.id} track={track} hiveId={hiveId} />
      ))}
      <AddTrackCard materials={materials} hiveId={hiveId} />
    </div>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function TracksPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;

  const exists = await prisma.hive.findUnique({ where: { id: hiveId }, select: { id: true } });
  if (!exists) return notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">
            Learning Ecosystem
          </span>
          <h1 className="font-headline text-4xl font-extrabold text-on-background tracking-tight">Active Tracks</h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Curated paths for your upcoming academic milestones.
          </p>
        </div>
      </header>

      <Suspense fallback={<TracksGridSkeleton />}>
        <TracksGrid hiveId={hiveId} />
      </Suspense>
    </div>
  );
}
