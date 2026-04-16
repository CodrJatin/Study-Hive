import React from "react";
import Link from "next/link";
import { CreateAnnouncementAction } from "@/components/modals/CreateAnnouncementAction";
import { ProgressBar } from "@/components/hive/ProgressBar";
import { AnnouncementCard } from "@/components/hive/AnnouncementCard";
import { DeadlineItem } from "@/components/hive/DeadlineItem";
import { ActivityFeedItem } from "@/components/hive/ActivityFeedItem";
import { announcementsData, deadlinesData, activitiesData } from "@/lib/data";

export default function HiveGeneralPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* New Consolidated Hero Card */}
      <div className="mb-12 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col md:flex-row clay-card">
        {/* Left Side: Title & Mastery */}
        <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-outline-variant/10 flex flex-col">
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
                Organic Chemistry
              </h1>
              <p className="text-on-surface/50 font-medium mt-3 uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base" data-icon="school">
                  school
                </span>
                Winter Semester 2024
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low rounded-xl text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all border border-outline-variant/10">
                <span className="material-symbols-outlined text-xl" data-icon="share">
                  share
                </span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low rounded-xl text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all border border-outline-variant/10">
                <span className="material-symbols-outlined text-xl" data-icon="more_vert">
                  more_vert
                </span>
              </button>
            </div>
          </div>

          <ProgressBar progress={45} label="Hive Mastery" labelSecondary="Course completion" />
        </div>

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
            {deadlinesData.map(deadline => (
              <DeadlineItem key={deadline.id} deadline={deadline} />
            ))}
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
            <CreateAnnouncementAction />
          </div>
          <div className="space-y-4">
            {announcementsData.map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
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
