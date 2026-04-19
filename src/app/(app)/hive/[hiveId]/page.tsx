import React, { Suspense } from "react";
import { HiveOverviewCard } from "@/components/hive/HiveOverviewCard";
import { CreateAnnouncementAction } from "@/components/modals/CreateAnnouncementAction";
import { AnnouncementCard } from "@/components/hive/AnnouncementCard";
import { DeadlineItem } from "@/components/hive/DeadlineItem";
import { ManageDeadlinesAction } from "@/components/modals/ManageDeadlinesAction";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// ─────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────

function OverviewCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 clay-card animate-pulse p-12 md:p-16 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-12 w-80 bg-surface-container-high rounded-2xl" />
          <div className="h-4 w-48 bg-surface-container-high rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
          <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-surface-container-high rounded" />
          <div className="h-3 w-12 bg-surface-container-high rounded" />
        </div>
        <div className="h-4 w-full bg-surface-container-high rounded-full" />
        <div className="h-3 w-32 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

function AnnouncementSkeleton() {
  return (
    <div className="clay-card bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-surface-container-high" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-1/2 bg-surface-container-high rounded-lg" />
          <div className="h-3 w-1/4 bg-surface-container-high rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-surface-container-high rounded w-full" />
        <div className="h-3 bg-surface-container-high rounded w-5/6" />
      </div>
    </div>
  );
}

function DeadlineSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
          <div className="border-l-4 border-surface-container-high pl-4 space-y-2">
            <div className="h-4 bg-surface-container-high rounded w-5/6" />
            <div className="h-3 bg-surface-container-high rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Async Widgets
// ─────────────────────────────────────────

async function HiveOverviewWidget({ hiveId, userId }: { hiveId: string; userId: string | null }) {
  const [hive, totalTopics, completedTopics] = await Promise.all([
    prisma.hive.findUnique({
      where: { id: hiveId },
      select: { title: true, description: true },
    }),
    prisma.topic.count({ where: { unit: { hiveId } } }),
    userId
      ? prisma.userTopicProgress.count({
          where: { userId, status: "COMPLETED", topic: { unit: { hiveId } } },
        })
      : Promise.resolve(0),
  ]);

  if (!hive) return null;

  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return <HiveOverviewCard hive={hive} progress={progress} />;
}

async function AnnouncementsWidget({ hiveId, userName }: { hiveId: string; userName: string }) {
  const announcements = await prisma.announcement.findMany({
    where: { hiveId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, content: true, createdAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-headline font-bold text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">campaign</span>
          Announcements
        </h3>
        <CreateAnnouncementAction hiveId={hiveId} userName={userName} />
      </div>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={{
              title: announcement.title,
              content: announcement.content,
              timeAgo: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(announcement.createdAt),
              authorInitials: announcement.author.name.charAt(0).toUpperCase(),
              authorName: announcement.author.name,
            }}
          />
        ))}
        {announcements.length === 0 && (
          <div className="bg-surface-container-low rounded-3xl p-10 border border-outline-variant/10 flex flex-col items-center justify-center gap-4 clay-inset">
            <span className="material-symbols-outlined text-on-surface-variant/10 text-6xl">campaign</span>
            <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-xs">No announcements yet</p>
          </div>
        )}
      </div>
    </>
  );
}

async function DeadlinesWidget({ hiveId }: { hiveId: string }) {
  const rawDeadlines = await prisma.deadline.findMany({
    where: { hiveId },
    orderBy: { dueDate: "asc" },
    select: { id: true, title: true, dueDate: true },
  });

  const mappedDeadlines = rawDeadlines.map((d) => {
    const diff = new Date(d.dueDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const isOverdue = days < 0;

    return {
      id: d.id,
      title: d.title,
      dueDate: isOverdue ? "Overdue" : days === 0 ? "Due Today" : days === 1 ? "Due Tomorrow" : `${days} days left`,
      dueColor: isOverdue || days <= 1 ? "error" : "on-surface/40",
      dateBadge: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(d.dueDate)),
      indicatorColor: isOverdue || days <= 1 ? "bg-error" : "bg-outline-variant",
    };
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-headline font-bold text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-3xl">event_busy</span>
          Deadlines
        </h3>
        <ManageDeadlinesAction hiveId={hiveId} deadlines={rawDeadlines} />
      </div>
      <div className="bg-surface-container-low/30 rounded-[2.5rem] p-6 clay-inset space-y-4">
        {mappedDeadlines.map((deadline) => (
          <DeadlineItem key={deadline.id} deadline={deadline} />
        ))}
        {mappedDeadlines.length === 0 && (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant/10 text-5xl mb-2">event_available</span>
            <p className="text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">All clear for now</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function HiveGeneralPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  // Minimal existence check + user name in one fast parallel pair
  const [exists, dbUser] = await Promise.all([
    prisma.hive.findUnique({ where: { id: hiveId }, select: { id: true } }),
    authUser ? prisma.user.findUnique({ where: { id: authUser.id }, select: { name: true } }) : null,
  ]);

  if (!exists) return notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hive Overview Card */}
      <div className="bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 shadow-sm overflow-hidden clay-card">
        <Suspense fallback={<OverviewCardSkeleton />}>
          <HiveOverviewWidget hiveId={hiveId} userId={authUser?.id ?? null} />
        </Suspense>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Deadlines — Mobile: first, Desktop: right */}
        <section className="lg:order-2">
          <Suspense fallback={<DeadlineSkeleton />}>
            <DeadlinesWidget hiveId={hiveId} />
          </Suspense>
        </section>

        {/* Announcements — Mobile: second, Desktop: left */}
        <section className="lg:col-span-2 lg:order-1">
          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="h-8 w-48 bg-surface-container-high rounded-xl animate-pulse mb-6" />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
              </div>
            }
          >
            <AnnouncementsWidget hiveId={hiveId} userName={dbUser?.name ?? "Member"} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
