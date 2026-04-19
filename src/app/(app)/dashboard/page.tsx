import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getRecentHives, getUpcomingDeadlines } from "@/actions/dashboard";
import { getUserTasks } from "@/actions/tasks";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { TaskList } from "@/components/dashboard/TaskList";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch data concurrently
  const [recentHives, upcomingDeadlines, allTasks] = await Promise.all([
    getRecentHives(user.id),
    getUpcomingDeadlines(user.id),
    getUserTasks(user.id),
  ]);

  const quickTasks = allTasks.filter(
    (task) =>
      !task.isCompleted ||
      (task.dueDate &&
        new Date(task.dueDate).toDateString() === new Date().toDateString())
  ).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
      {/* Left Column (col-span-8) */}
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
          {recentHives.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant clay-inset rounded-3xl">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">science</span>
              <p className="font-bold">No hives yet.</p>
              <Link href="/dashboard/hives" className="text-primary hover:underline text-sm font-bold">
                Create your first hive
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentHives.map((hive) => {
                const nearestDeadline = hive.deadlines?.[0];
    
                // Calculate progress
                const allTopics = hive.units?.flatMap(u => u.topics) || [];
                const totalTopics = allTopics.length;
                const completedTopics = allTopics.filter(t => t.status === "COMPLETED").length;
                const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            
                // Calculate days left
                let daysLeft: number | null = null;
                if (nearestDeadline) {
                  const diff = nearestDeadline.dueDate.getTime() - new Date().getTime();
                  daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                } else if (hive.targetDate) {
                  const diff = hive.targetDate.getTime() - new Date().getTime();
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
                      progress,
                      daysLeft,
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Upcoming Tasks */}
        <section className="bg-[#F7F6F3] rounded-[24px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[24px] text-[#735A27]">check_circle</span>
            <h2 className="text-[22px] font-headline font-bold text-[#1A1A1A]">Upcoming Tasks</h2>
          </div>
          <TaskList initialTasks={quickTasks} />
        </section>

      </div>

      {/* Right Column (col-span-4) - Recent Curations (Deadlines) */}
      <div className="md:col-span-4">
        <section className="bg-[#F7F6F3] rounded-[24px] p-8 h-full sticky top-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-headline font-bold text-[#1A1A1A]">Deadline Central</h2>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:shadow-md">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">free_cancellation</span>
              <p className="font-bold">No upcoming deadlines.</p>
              <p className="text-sm">You're all clear!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {upcomingDeadlines.map((deadline) => {
                const due = new Date(deadline.dueDate);
                const diff = due.getTime() - new Date().getTime();
                const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                
                // Color mapping logic for border to mimic image aesthetic
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
          )}
        </section>
      </div>

    </div>
  );
}
