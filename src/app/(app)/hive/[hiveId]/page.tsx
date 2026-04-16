import React from "react";
import Link from "next/link";
import { HiveOverviewCard } from "@/components/hive/HiveOverviewCard";
import { CreateAnnouncementAction } from "@/components/modals/CreateAnnouncementAction";
import { AnnouncementCard } from "@/components/hive/AnnouncementCard";
import { DeadlineItem } from "@/components/hive/DeadlineItem";
import { ActivityFeedItem } from "@/components/hive/ActivityFeedItem";
import { announcementsData, activitiesData } from "@/lib/data";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function HiveGeneralPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;
  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    include: {
      announcements: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      members: true,
      deadlines: {
        orderBy: { dueDate: "asc" },
      }
    },
  });

  if (!hive) return notFound();

  const mappedDeadlines = hive.deadlines.map((d: any) => {
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
    } else if (days < 7) {
      dueDateText = "This Week";
    } else {
      dueDateText = "Next Week";
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col md:flex-row clay-card">
        <HiveOverviewCard hive={hive} />

        {/* Right Side: Deadlines */}
        <div className="w-full md:w-[380px] bg-surface-container-low/50 p-8 md:p-10 flex flex-col clay-inset border-none rounded-none md:rounded-r-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-headline font-bold text-on-background uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-xl" data-icon="event_busy">
                event_busy
              </span>
              Deadlines
            </h3>
            <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
              View All{" "}
              <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="space-y-3">
            {mappedDeadlines.map(deadline => (
              <DeadlineItem key={deadline.id} deadline={deadline} />
            ))}
            {mappedDeadlines.length === 0 && (
              <p className="text-on-surface-variant/40 text-[10px] font-bold text-center py-4">
                No upcoming deadlines
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Announcements Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-headline font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" data-icon="campaign">
                campaign
              </span>
              Announcements
            </h3>
            <CreateAnnouncementAction hiveId={hive.id} />
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
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section>
          <h3 className="text-xl font-headline font-bold text-on-background mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" data-icon="history">
              history
            </span>
            Recent Activity
          </h3>
          <div className="bg-surface-container-low rounded-xl p-6 relative clay-inset">
            <div className="absolute left-[2.25rem] top-8 bottom-8 w-px bg-outline-variant/30"></div>
            <div className="space-y-8">
              {activitiesData.map(activity => (
                <ActivityFeedItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
