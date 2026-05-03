import { Icon } from "@/components/ui/Icon";
import React, { Suspense } from "react";
import { MaterialTile } from "@/components/track/MaterialTile";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentSupabaseUser } from "@/lib/session";

// ─────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────

function TrackHeaderSkeleton() {
  return (
    <div className="mb-12 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-2 gap-4">
        <div className="h-10 w-64 bg-surface-container-high rounded-xl" />
        <div className="h-6 w-24 bg-surface-container-high rounded-full" />
      </div>
      <div className="h-4 w-full max-w-2xl bg-surface-container-high rounded mb-8" />
      
      <div className="bg-surface-container-low p-6 rounded-4xl space-y-3">
        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="h-3 w-20 bg-surface-container-high rounded" />
            <div className="h-6 w-32 bg-surface-container-high rounded" />
          </div>
          <div className="h-4 w-24 bg-surface-container-high rounded" />
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full" />
      </div>
    </div>
  );
}

function CurriculumSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-40 bg-surface-container-high rounded px-1" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 bg-surface-container-low rounded-2xl" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Async Widget — single query covers both header + curriculum
// ─────────────────────────────────────────

async function TrackContent({
  trackId,
  userId,
  hiveId,
}: {
  trackId: string;
  userId: string;
  hiveId: string;
}) {
  // One query: fetch all data needed by both the header and the curriculum list.
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: {
      name: true,
      description: true,
      hiveId: true,
      trackTopics: {
        orderBy: { position: "asc" },
        select: {
          topic: {
            select: {
              id: true,
              title: true,
              duration: true,
              topicProgress: {
                where: { userId },
                select: { status: true },
              },
            },
          },
        },
      },
    },
  });

  if (!track || track.hiveId !== hiveId) return null;

  const totalTopics = track.trackTopics.length;
  const completedTopics = track.trackTopics.filter(
    (tt) => tt.topic.topicProgress?.[0]?.status === "COMPLETED"
  ).length;
  const progressPercent =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <>
      {/* ── Header ─────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-2 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
            {track.name}
          </h1>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-auto">
            {progressPercent === 100 ? "Completed" : "In Progress"}
          </span>
        </div>
        <p className="text-stone-500 mb-8 max-w-2xl leading-relaxed">
          {track.description || "A curated study track designed to cover core materials."}
        </p>

        {/* Overall Progress */}
        <div className="bg-surface-container-low p-6 rounded-4xl clay-inset border-none">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                Your Journey
              </p>
              <p className="text-lg font-bold text-on-surface">
                {progressPercent}% Completed
              </p>
            </div>
            <p className="text-sm font-medium text-stone-500">
              {completedTopics} of {totalTopics} tasks done
            </p>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-tertiary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Curriculum List ─────────────────────────── */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-on-surface-variant px-1">
          Active Curriculum
        </h2>

        {track.trackTopics.map(({ topic: t }) => {
          const isCompleted = t.topicProgress?.[0]?.status === "COMPLETED";
          return (
            <MaterialTile
              key={t.id}
              material={{
                id: t.id,
                title: t.title,
                completed: isCompleted,
                type: "TOPIC",
                details: t.duration ? t.duration : "Unknown duration",
                instructions: "Study this topic thoroughly.",
              }}
              hiveId={hiveId}
            />
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function TrackDetailsPage({
  params,
}: {
  params: Promise<{ hiveId: string; trackId: string }>;
}) {
  const { hiveId, trackId } = await params;

  // Auth + track existence in parallel; layout already called getCurrentSupabaseUser()
  // so this is a cache()-memoized no-op on the auth side.
  const [user, track] = await Promise.all([
    getCurrentSupabaseUser(),
    prisma.track.findUnique({
      where: { id: trackId },
      select: { id: true, hiveId: true },
    }),
  ]);

  if (!user) return null;
  if (!track || track.hiveId !== hiveId) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Single Suspense boundary covers both header + curriculum — one fetch */}
      <Suspense
        fallback={
          <>
            <TrackHeaderSkeleton />
            <CurriculumSkeleton />
          </>
        }
      >
        <TrackContent trackId={trackId} userId={user.id} hiveId={hiveId} />
      </Suspense>

    </div>
  );
}
