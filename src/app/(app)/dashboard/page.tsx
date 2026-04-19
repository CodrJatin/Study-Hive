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

// ─────────────────────────────────────────
// Skeleton Fallbacks
// ─────────────────────────────────────────

function HiveCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] p-7 border border-[#E5E5E5] h-full flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-[#F0EDEA] rounded-xl" />
        <div className="w-20 h-6 bg-[#F0EDEA] rounded-lg" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-[#F0EDEA] rounded-lg w-3/4" />
        <div className="h-3 bg-[#F0EDEA] rounded-lg w-full" />
        <div className="h-3 bg-[#F0EDEA] rounded-lg w-5/6" />
      </div>
    </div>
  );
}

function RecentHivesSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-36 bg-[#F0EDEA] rounded-lg animate-pulse" />
        <div className="h-5 w-16 bg-[#F0EDEA] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <HiveCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function TasksSkeleton() {
  return (
    <section className="bg-[#F7F6F3] rounded-[24px] p-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-[#E5E0DB] rounded-full" />
        <div className="h-6 w-40 bg-[#E5E0DB] rounded-lg" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#E5E5E5] shrink-0" />
            <div className="flex-1 h-4 bg-[#F0EDEA] rounded-lg" />
            <div className="w-16 h-4 bg-[#F0EDEA] rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  );
}

function DeadlinesSkeleton() {
  return (
    <section className="bg-[#F7F6F3] rounded-[24px] p-8 animate-pulse">
      <div className="h-6 w-36 bg-[#E5E0DB] rounded-lg mb-8" />
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-[#E5E5E5]">
            <div className="border-l-4 border-[#E5E5E5] pl-4 space-y-2">
              <div className="h-4 bg-[#F0EDEA] rounded w-5/6" />
              <div className="h-3 bg-[#F0EDEA] rounded w-2/3" />
            </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {recentHives.map((hive) => {
        const nearestDeadline = hive.deadlines?.[0];
        let daysLeft: number | null = null;
        if (nearestDeadline) {
          const diff = nearestDeadline.dueDate.getTime() - Date.now();
          daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        } else if (hive.targetDate) {
          const diff = hive.targetDate.getTime() - Date.now();
          daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        }

        return (
          <HiveCard
            key={hive.id}
            hive={{
              id: hive.id,
              title: hive.title,
              description: hive.description || "No description provided.",
              nextDeadline: nearestDeadline
                ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(nearestDeadline.dueDate)
                : "No deadlines",
              daysLeft,
            }}
          />
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

async function DeadlineCentralWidget({ userId }: { userId: string }) {
  const upcomingDeadlines = await getUpcomingDeadlines(userId);

  if (upcomingDeadlines.length === 0) {
    return (
      <div className="text-center py-8 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">free_cancellation</span>
        <p className="font-bold">No upcoming deadlines.</p>
        <p className="text-sm">You&apos;re all clear!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {upcomingDeadlines.map((deadline) => {
        const due = new Date(deadline.dueDate);
        const diff = due.getTime() - Date.now();
        const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        const leftBorderStyle = daysLeft <= 3 ? "border-[#A05C00]" : "border-[#007A8A]";

        return (
          <li key={deadline.id} className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]">
            <div className={`border-l-4 ${leftBorderStyle} pl-4`}>
              <p className="font-bold text-[15px] text-[#1A1A1A] leading-snug line-clamp-2 mb-2">
                {deadline.title}
              </p>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#757575]">
                <span className="material-symbols-outlined text-[14px]">format_quote</span>
                <span className="truncate">{deadline.hive.title}</span>
                <span className="px-1 text-[#D1D1D1]">•</span>
                <span className={daysLeft === 0 ? "text-error" : ""}>
                  {daysLeft === 0 ? "Today" : `${daysLeft} days left`}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
      {/* Left Column */}
      <div className="md:col-span-8 space-y-10">

        {/* Active Hives */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[28px] font-headline font-bold text-on-background">Active Hives</h2>
            <Link
              href="/dashboard/hives"
              className="text-sm font-bold text-[#735A27] hover:underline flex items-center gap-1"
            >
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <Suspense fallback={<RecentHivesSkeleton />}>
            <RecentHivesWidget userId={user.id} />
          </Suspense>
        </section>

        {/* Upcoming Tasks */}
        <section className="bg-[#F7F6F3] rounded-[24px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[24px] text-[#735A27]">check_circle</span>
            <h2 className="text-[22px] font-headline font-bold text-[#1A1A1A]">Upcoming Tasks</h2>
          </div>
          <Suspense fallback={<TasksSkeleton />}>
            <UpcomingTasksWidget userId={user.id} />
          </Suspense>
        </section>

      </div>

      {/* Right Column */}
      <div className="md:col-span-4">
        <section className="bg-[#F7F6F3] rounded-[24px] p-8 h-full sticky top-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-headline font-bold text-[#1A1A1A]">Deadline Central</h2>
          </div>
          <Suspense fallback={<DeadlinesSkeleton />}>
            <DeadlineCentralWidget userId={user.id} />
          </Suspense>
        </section>
      </div>

    </div>
  );
}
