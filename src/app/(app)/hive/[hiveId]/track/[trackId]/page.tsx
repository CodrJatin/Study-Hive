import React, { Suspense } from "react";
import { MaterialTile } from "@/components/track/MaterialTile";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
// Async Widgets
// ─────────────────────────────────────────

async function TrackHeader({ trackId, userId, hiveId }: { trackId: string, userId: string, hiveId: string }) {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: {
      name: true,
      description: true,
      hiveId: true,
      trackTopics: {
        select: {
          topic: {
            select: {
              topicProgress: {
                where: { userId },
                select: { status: true }
              }
            }
          }
        }
      }
    }
  });

  if (!track || track.hiveId !== hiveId) return null;

  const totalTopics = track.trackTopics.length;
  const completedTopics = track.trackTopics.filter(
    tt => tt.topic.topicProgress?.[0]?.status === 'COMPLETED'
  ).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-2 gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">{track.name}</h1>
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
            <p className="text-xs font-bold text-primary uppercase tracking-tighter">Your Journey</p>
            <p className="text-lg font-bold text-on-surface">{progressPercent}% Completed</p>
          </div>
          <p className="text-sm font-medium text-stone-500">{completedTopics} of {totalTopics} tasks done</p>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-primary to-tertiary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

async function CurriculumList({ trackId, userId, hiveId }: { trackId: string, userId: string, hiveId: string }) {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: {
      trackTopics: {
        orderBy: { position: 'asc' },
        select: {
          topic: {
            select: {
              id: true,
              title: true,
              duration: true,
              topicProgress: {
                where: { userId },
                select: { status: true }
              }
            }
          }
        }
      }
    }
  });

  if (!track) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-on-surface-variant px-1">Active Curriculum</h2>

      {track.trackTopics.map((tt) => {
        const t = tt.topic;
        const isCompleted = t.topicProgress?.[0]?.status === 'COMPLETED';
        return (
          <MaterialTile key={t.id} material={{
            id: t.id,
            title: t.title,
            completed: isCompleted,
            type: "TOPIC",
            details: t.duration ? t.duration : "Unknown duration",
            instructions: "Study this topic thoroughly."
          }} hiveId={hiveId} />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function TrackDetailsPage({ params }: { params: Promise<{ hiveId: string, trackId: string }> }) {
  const { hiveId, trackId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Should be handled by layout/middleware

  const exists = await prisma.track.findUnique({ where: { id: trackId }, select: { id: true, hiveId: true } });
  if (!exists || exists.hiveId !== hiveId) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Suspense fallback={<TrackHeaderSkeleton />}>
        <TrackHeader trackId={trackId} userId={user.id} hiveId={hiveId} />
      </Suspense>

      <Suspense fallback={<CurriculumSkeleton />}>
        <CurriculumList trackId={trackId} userId={user.id} hiveId={hiveId} />
      </Suspense>

      {/* Bento Style Secondary Stats — Static for now, no fetch needed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="col-span-1 bg-tertiary-container/10 p-6 rounded-2xl border border-tertiary/10 flex flex-col justify-center">
          <span className="material-symbols-outlined text-tertiary mb-4">timer</span>
          <p className="text-xs font-bold text-tertiary uppercase tracking-widest">Est. Time Remaining</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">4.5 Hours</p>
        </div>
        <div className="col-span-1 bg-primary-container/10 p-6 rounded-2xl border border-primary/10 flex flex-col justify-center">
          <span className="material-symbols-outlined text-primary mb-4">groups</span>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Peers Active</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">12 Students</p>
        </div>
        <div className="col-span-1 bg-surface-container-low p-6 rounded-2xl clay-inset border-none">
          <div className="flex -space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300" />
            ))}
            <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold text-stone-500">
              +9
            </div>
          </div>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Join Study Session</p>
          <button className="mt-2 text-sm font-bold text-primary hover:underline transition-all">Enter Room &rarr;</button>
        </div>
      </div>
    </div>
  );
}
