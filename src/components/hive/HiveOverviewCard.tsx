import React from "react";
import { ProgressBar } from "@/components/hive/ProgressBar";

export function HiveOverviewCard({ hive }: { hive: { title: string; description: string | null } }) {
  return (
    <>
        {/* Left Side: Title & Mastery */}
        <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-outline-variant/10 flex flex-col">
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
    </>
  );
}
