import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UnitAccordion } from "@/components/syllabus/UnitAccordion";
import { AddUnitForm } from "@/components/syllabus/AddUnitForm";

// ─────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────

function ProgressHeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-surface-container-high rounded-xl" />
        <div className="h-4 w-40 bg-surface-container-high rounded-lg" />
      </div>
      <div className="space-y-2 min-w-[180px]">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-surface-container-high rounded" />
          <div className="h-3 w-8 bg-surface-container-high rounded" />
        </div>
        <div className="h-2.5 w-full bg-surface-container-high rounded-full" />
        <div className="h-3 w-24 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

function UnitSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="clay-card bg-surface-container-low rounded-xl p-5 flex items-center gap-4">
          <div className="w-6 h-6 bg-surface-container-high rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-surface-container-high rounded-lg w-1/3" />
          </div>
          <div className="h-4 w-16 bg-surface-container-high rounded" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Async Widgets
// ─────────────────────────────────────────

async function SyllabusHeader({ hiveId, userId }: { hiveId: string; userId: string }) {
  const [hive, totalTopics, completedTopics] = await Promise.all([
    prisma.hive.findUnique({
      where: { id: hiveId },
      select: {
        title: true,
        _count: { select: { units: true } },
      },
    }),
    prisma.topic.count({ where: { unit: { hiveId } } }),
    prisma.userTopicProgress.count({
      where: { userId, status: "COMPLETED", topic: { unit: { hiveId } } },
    }),
  ]);

  if (!hive) return null;

  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl font-headline font-extrabold text-on-background tracking-tight mb-2">
          {hive.title}
        </h1>
        <p className="text-on-surface-variant text-sm">
          {hive._count.units} unit{hive._count.units !== 1 ? "s" : ""} · {totalTopics} topic{totalTopics !== 1 ? "s" : ""}
        </p>
      </div>
      {totalTopics > 0 && (
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-on-surface-variant">Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-tertiary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant/60">
            {completedTopics} / {totalTopics} completed
          </p>
        </div>
      )}
    </div>
  );
}

async function SyllabusList({ hiveId, userId }: { hiveId: string; userId: string }) {
  const units = await prisma.unit.findMany({
    where: { hiveId },
    orderBy: { position: "asc" },
    select: {
      id: true,
      title: true,
      position: true,
      createdAt: true,
      updatedAt: true,
      hiveId: true,
      topics: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          duration: true,
          resourceCount: true,
          createdAt: true,
          updatedAt: true,
          unitId: true,
          topicProgress: {
            where: { userId },
            select: { status: true },
          },
        },
      },
    },
  });

  if (units.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-container-low rounded-3xl clay-inset border border-dashed border-outline-variant/20">
        <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4 block">
          account_tree
        </span>
        <h3 className="text-xl font-headline font-bold text-on-surface mb-1">No Units Yet</h3>
        <p className="text-on-surface-variant text-sm">Add your first unit below to start building your syllabus.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {units.map((unit, index) => (
        <UnitAccordion key={unit.id} unit={unit} index={index} hiveId={hiveId} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function SyllabusPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Verify the hive exists with a minimal query before rendering shell
  const exists = await prisma.hive.findUnique({ where: { id: hiveId }, select: { id: true } });
  if (!exists) return notFound();

  const userId = user?.id ?? "";

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
          Syllabus
        </span>
        <Suspense fallback={<ProgressHeaderSkeleton />}>
          <SyllabusHeader hiveId={hiveId} userId={userId} />
        </Suspense>
      </div>

      {/* Syllabus Tree */}
      <Suspense fallback={<UnitSkeleton />}>
        <SyllabusList hiveId={hiveId} userId={userId} />
      </Suspense>

      {/* Add Unit Form — always visible */}
      <div className="mt-4">
        <AddUnitForm hiveId={hiveId} />
      </div>
    </div>
  );
}