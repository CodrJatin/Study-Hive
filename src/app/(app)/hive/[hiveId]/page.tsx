import React from "react";
import { HiveOverviewCard } from "@/components/hive/HiveOverviewCard";
import { CreateAnnouncementAction } from "@/components/modals/CreateAnnouncementAction";
import { AnnouncementCard } from "@/components/hive/AnnouncementCard";
import { DeadlineItem } from "@/components/hive/DeadlineItem";
import { announcementsData } from "@/lib/data";
import { ManageDeadlinesAction } from "@/components/modals/ManageDeadlinesAction";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HiveGeneralPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;
  
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  const [hive, dbUser] = await Promise.all([
    prisma.hive.findUnique({
      where: { id: hiveId },
      include: {
        announcements: {
          orderBy: { createdAt: "desc" },
          include: { author: true },
        },
        members: true,
        deadlines: {
          orderBy: { dueDate: "asc" },
        },
        units: {
          include: {
            topics: true,
          },
        },
      },
    }),
    authUser ? prisma.user.findUnique({ where: { id: authUser.id } }) : null
  ]);

  if (!hive) return notFound();

  // Calculate progress
  const totalTopics = hive.units.reduce((sum, u) => sum + u.topics.length, 0);
  const completedTopics = hive.units.reduce(
    (sum, u) => sum + u.topics.filter((t: any) => t.status === "COMPLETED").length,
    0
  );
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const rawDeadlines = hive.deadlines;

  const mappedDeadlines = rawDeadlines.map((d: any) => {
    const diff = new Date(d.dueDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    let dueDateText = "";
    let dueColor = "on-surface/40";
    let indicatorColor = "bg-outline-variant";

    if (days === 0) {
      dueDateText = "Due Today";
      dueColor = "error";
      indicatorColor = "bg-error";
    } else if (days === 1) {
      dueDateText = "Due Tomorrow";
      dueColor = "error";
      indicatorColor = "bg-error";
    } else if (days < 0) {
      dueDateText = "Overdue";
      dueColor = "error";
      indicatorColor = "bg-error";
    } else {
      dueDateText = `${days} days left`;
    }

    return {
      id: d.id,
      title: d.title,
      dueDate: dueDateText,
      dueColor,
      dateBadge: new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(d.dueDate)),
      indicatorColor
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Standalone Title Card */}
      <div className="bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 shadow-sm overflow-hidden clay-card">
        <HiveOverviewCard hive={hive} progress={progress} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Sidebar: Deadlines (Mobile: First, Desktop: Right) */}
        <section className="lg:order-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-headline font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-3xl" data-icon="event_busy">
                event_busy
              </span>
              Deadlines
            </h3>
            <ManageDeadlinesAction hiveId={hive.id} deadlines={rawDeadlines} />
          </div>
          
          <div className="bg-surface-container-low/30 rounded-[2.5rem] p-6 clay-inset space-y-4">
            {mappedDeadlines.map(deadline => (
              <DeadlineItem key={deadline.id} deadline={deadline} />
            ))}
            {mappedDeadlines.length === 0 && (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-on-surface-variant/10 text-5xl mb-2">event_available</span>
                <p className="text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">
                  All clear for now
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Main Column: Announcements (Mobile: Second, Desktop: Left) */}
        <section className="lg:col-span-2 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-headline font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="campaign">
                campaign
              </span>
              Announcements
            </h3>
            <CreateAnnouncementAction hiveId={hive.id} userName={dbUser?.name || "Member"} />
          </div>
          <div className="space-y-4">
            {hive.announcements.map((announcement: any) => (
              <AnnouncementCard key={announcement.id} announcement={{
                title: announcement.title,
                content: announcement.content,
                timeAgo: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(announcement.createdAt),
                authorInitials: announcement.author.name.charAt(0).toUpperCase(),
                authorName: announcement.author.name
              }} />
            ))}
            {hive.announcements.length === 0 && (
              <div className="bg-surface-container-low rounded-3xl p-10 border border-outline-variant/10 flex flex-col items-center justify-center gap-4 clay-inset">
                <span className="material-symbols-outlined text-on-surface-variant/10 text-6xl">campaign</span>
                <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-xs">No announcements yet</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
