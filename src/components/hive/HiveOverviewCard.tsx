import React from "react";
import { ProgressBar } from "@/components/hive/ProgressBar";

export function HiveOverviewCard({ 
  hive, 
  progress,
}: { 
  hive: { title: string; description: string | null },
  progress: number;
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
          </div>

          <ProgressBar progress={progress} label="Hive Mastery" labelSecondary="Course completion" />
        </div>
    </>
  );
}
