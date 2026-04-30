import React from "react";
import { ProgressBar } from "@/components/hive/ProgressBar";

export function HiveOverviewCard({ 
  hive, 
  progress,
  isAdmin
}: { 
  hive: { title: string; description: string | null },
  progress: number;
  isAdmin: boolean;
}) {
  return (
    <>
        {/* Full-width Title & Mastery */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col">
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
                {hive.title}
              </h1>
              <p className="text-on-surface/50 font-medium mt-3 uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base" data-icon="school">
                  school
                </span>
                {hive.description || "Course Overview"}
              </p>
            </div>
            {!isAdmin && (
              <div className="flex gap-2 shrink-0">
                <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low rounded-xl text-error hover:bg-error-container hover:text-on-error-container transition-all border border-outline-variant/10" title="Leave Hive">
                  <span className="material-symbols-outlined text-xl" data-icon="logout">
                    logout
                  </span>
                </button>
              </div>
            )}
          </div>

          <ProgressBar progress={progress} label="Hive Mastery" labelSecondary="Course completion" />
        </div>
    </>
  );
}
