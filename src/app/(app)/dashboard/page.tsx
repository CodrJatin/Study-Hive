import React, { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  getRecentHives,
  getUpcomingDeadlines,
} from "@/actions/dashboard";
import { getUserTasks } from "@/actions/tasks";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { TaskList } from "@/components/dashboard/TaskList";

import { DeadlineItem } from "@/components/hive/DeadlineItem";

// ─────────────────────────────────────────
// Skeleton Fallbacks
// ─────────────────────────────────────────

function HiveCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-[24px] p-7 border border-outline-variant/10 h-full flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-surface-container-high rounded-xl" />
        <div className="w-20 h-6 bg-surface-container-high rounded-lg" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-surface-container-high rounded-lg w-3/4" />
        <div className="h-3 bg-surface-container-high rounded-lg w-full" />
        <div className="h-3 bg-surface-container-high rounded-lg w-5/6" />
      </div>
    </div>
  );
}

function RecentHivesSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-36 bg-surface-container-high rounded-lg animate-pulse" />
        <div className="h-5 w-16 bg-surface-container-high rounded animate-pulse" />
      </div>
      <div className="flex flex-col max-h-[580px] overflow-y-auto md:overflow-y-visible md:flex-row md:space-x-6 md:overflow-x-auto md:max-h-none pb-4 snap-x custom-scrollbar">
        {[0, 1, 2].map((i) => (
          <div key={i} className="min-w-full md:min-w-[380px] md:max-w-[380px] shrink-0 snap-start mb-6 md:mb-0">
            <HiveCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

function TasksSkeleton() {
  return (
    <section className="bg-surface-container-low rounded-[24px] p-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-surface-container-high rounded-full" />
        <div className="h-6 w-40 bg-surface-container-high rounded-lg" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-outline-variant/10 shrink-0" />
            <div className="flex-1 h-4 bg-surface-container-high rounded-lg" />
            <div className="w-16 h-4 bg-surface-container-high rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  );
}


// ─────────────────────────────────────────
// Async Widget Components
// ─────────────────────────────────────────

async function RecentHivesWidget({ userId }: { userId: string }) {
  const recentHives = await getRecentHives(userId);
  const now = Date.now();

  if (recentHives.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant clay-inset rounded-3xl">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">science</span>
        <p className="font-bold">No hives yet.</p>
        <Link href="/dashboard/hives" className="text-primary hover:underline text-sm font-bold">
          Create your first hive
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[580px] overflow-y-auto md:overflow-y-visible md:flex-row md:space-x-6 md:overflow-x-auto md:max-h-none pb-4 snap-x snap-mandatory custom-scrollbar">
      {recentHives.map((hive) => {
        const nearestDeadline = hive.deadlines?.[0];
        let daysLeft: number | null = null;
        if (nearestDeadline) {
          const diff = nearestDeadline.dueDate.getTime() - now;
          daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        } else if (hive.targetDate) {
          const diff = hive.targetDate.getTime() - now;
          daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        }

        return (
          <div key={hive.id} className="min-w-full md:min-w-[380px] md:max-w-[380px] shrink-0 snap-start mb-6 md:mb-0">
            <HiveCard
              hive={{
                id: hive.id,
                title: hive.title,
                description: hive.description || "No description provided.",
                daysLeft,
                icon: hive.icon,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

async function UpcomingTasksWidget({ userId }: { userId: string }) {
  const allTasks = await getUserTasks(userId);

  const quickTasks = allTasks
    .filter(
      (task) =>
        !task.isCompleted ||
        (task.dueDate &&
          new Date(task.dueDate).toDateString() === new Date().toDateString())
    )
    .slice(0, 5);

  return <TaskList initialTasks={quickTasks} />;
}


// ─────────────────────────────────────────
// Page Shell — only fetches user identity
// ─────────────────────────────────────────

export default async function DashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const upcomingDeadlines = await getUpcomingDeadlines(user.id);
  const hasDeadlines = upcomingDeadlines.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
      {/* Left Column */}
      <div className={`${hasDeadlines ? "md:col-span-8" : "md:col-span-12"} space-y-10`}>

        {/* Active Hives */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[28px] font-headline font-bold text-on-background">Active Hives</h2>
            <Link
              href="/dashboard/hives"
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <Suspense fallback={<RecentHivesSkeleton />}>
            <RecentHivesWidget userId={user.id} />
          </Suspense>
        </section>

        {/* Upcoming Tasks */}
        <section className="bg-surface-container-low rounded-[24px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[24px] text-primary">check_circle</span>
            <h2 className="text-[22px] font-headline font-bold text-on-background">Upcoming Tasks</h2>
          </div>
          <Suspense fallback={<TasksSkeleton />}>
            <UpcomingTasksWidget userId={user.id} />
          </Suspense>
        </section>

      </div>

      {/* Right Column */}
      {hasDeadlines && (
        <div className="md:col-span-4">
          <section className="bg-surface-container-low rounded-[24px] p-8 h-full sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[24px] text-error">event_busy</span>
              <h2 className="text-[20px] font-headline font-bold text-on-background">Deadline Central</h2>
            </div>
            <DeadlineCentralWidget upcomingDeadlines={upcomingDeadlines} />
          </section>
        </div>
      )}

    </div>
  );
}

interface UpcomingDeadline {
  id: string;
  title: string;
  dueDate: string | Date;
  hive: {
    title: string;
  };
}

async function DeadlineCentralWidget({ upcomingDeadlines }: { upcomingDeadlines: UpcomingDeadline[] }) {
  const now = Date.now();
  const mappedDeadlines = upcomingDeadlines.map((d) => {
    const diff = new Date(d.dueDate).getTime() - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const isOverdue = days < 0;

    return {
      id: d.id,
      title: d.title,
      hiveTitle: d.hive.title,
      dueDate: isOverdue ? "Overdue" : days === 0 ? "Due Today" : days === 1 ? "Due Tomorrow" : `${days} days left`,
      dueColor: isOverdue || days <= 1 ? "error" : "on-surface/40",
      dateBadge: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(d.dueDate)),
      indicatorColor: isOverdue || days <= 1 ? "bg-error" : "bg-outline-variant",
    };
  });

  return (
    <div className="space-y-3">
      {mappedDeadlines.map((deadline) => (
        <DeadlineItem key={deadline.id} deadline={deadline} />
      ))}
    </div>
  );
}
