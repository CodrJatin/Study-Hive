import React from "react";
import Link from "next/link";
import { CreateAnnouncementAction } from "@/components/modals/CreateAnnouncementAction";

export default function HiveGeneralPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* New Consolidated Hero Card */}
      <div className="mb-12 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col md:flex-row clay-card">
        {/* Left Side: Title & Mastery */}
        <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-outline-variant/10">
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

          <div className="mt-auto">
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl" data-icon="auto_graph">
                    auto_graph
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-headline font-bold text-on-background uppercase tracking-widest">
                    Hive Mastery
                  </h3>
                  <p className="text-[10px] text-on-surface/40 font-medium uppercase tracking-tight">
                    Course completion
                  </p>
                </div>
              </div>
              <span className="text-4xl font-headline font-extrabold text-primary">45%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[45%] rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(120,89,0,0.3)]"></div>
            </div>
          </div>
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
            {/* Deadline Item 1 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/5 group hover:border-primary/20 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-1.5 h-8 bg-error rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-on-surface truncate pr-2">Stereochemistry Assignment</h5>
                  <p className="text-[10px] text-error font-bold mt-0.5">Due Tomorrow</p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-on-surface/60 bg-surface-container-highest px-2 py-1 rounded">
                  24 Oct
                </span>
                <span className="material-symbols-outlined text-lg text-on-surface/20 group-hover:text-primary transition-colors" data-icon="chevron_right">
                  chevron_right
                </span>
              </div>
            </div>

            {/* Deadline Item 2 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/5 group hover:border-primary/20 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-1.5 h-8 bg-outline-variant rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-on-surface truncate pr-2">Quiz: Reaction Mechanisms</h5>
                  <p className="text-[10px] text-on-surface/40 font-bold mt-0.5">Next Week</p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-on-surface/60 bg-surface-container-highest px-2 py-1 rounded">
                  27 Oct
                </span>
                <span className="material-symbols-outlined text-lg text-on-surface/20 group-hover:text-primary transition-colors" data-icon="chevron_right">
                  chevron_right
                </span>
              </div>
            </div>
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
            {/* Announcement Card */}
            <article className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all hover:bg-surface-container group cursor-pointer clay-card">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-headline font-bold text-on-background">Lab Session Schedule Change</h4>
                <span className="text-xs font-medium text-on-surface/40 bg-surface-container-high px-2 py-1 rounded">
                  2h ago
                </span>
              </div>
              <p className="text-on-surface/70 leading-relaxed mb-6">
                The Tuesday lab session for Unit 4: Spectroscopic Analysis has been moved to Thursday at 3:00 PM due
                to equipment maintenance.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">
                  J
                </div>
                <span className="text-sm font-semibold text-on-surface/80">By Jatin</span>
              </div>
            </article>

            {/* Announcement Card */}
            <article className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all hover:bg-surface-container group cursor-pointer clay-card">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-headline font-bold text-on-background">Mid-sem Track Now Live</h4>
                <span className="text-xs font-medium text-on-surface/40 bg-surface-container-high px-2 py-1 rounded">
                  5h ago
                </span>
              </div>
              <p className="text-on-surface/70 leading-relaxed mb-6">
                I&apos;ve created a focused track for the upcoming mid-semester examinations. It covers the first three
                chapters.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">
                  J
                </div>
                <span className="text-sm font-semibold text-on-surface/80">By Jatin</span>
              </div>
            </article>
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
              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="upload_file">
                    upload_file
                  </span>
                </div>
                <div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold text-on-surface">Jatin</span> uploaded material in{" "}
                    <span className="text-primary font-semibold">Unit 3: Functional Groups</span>
                  </p>
                  <p className="text-xs text-on-surface/40 mt-1">Just now</p>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-on-secondary-container text-sm" data-icon="play_circle">
                    play_circle
                  </span>
                </div>
                <div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold text-on-surface">Jatin</span> started track{" "}
                    <span className="text-secondary font-semibold">Mid-sem Revision</span>
                  </p>
                  <p className="text-xs text-on-surface/40 mt-1">45 mins ago</p>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-on-tertiary-container text-sm" data-icon="person_add">
                    person_add
                  </span>
                </div>
                <div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold text-on-surface">Sarah</span> joined the Hive
                  </p>
                  <p className="text-xs text-on-surface/40 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
