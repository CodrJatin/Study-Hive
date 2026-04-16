import React from "react";
import Link from "next/link";

export default function TracksPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">
            Learning Ecosystem
          </span>
          <h1 className="headline text-4xl font-extrabold text-on-background tracking-tight">Active Tracks</h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Curated paths for your upcoming academic milestones.
          </p>
        </div>
      </header>

      {/* Tracks Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {/* Track Card 1 */}
        <div className="group bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-lowest transition-all duration-300 relative overflow-hidden clay-card">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-all group-hover:w-32 group-hover:h-32"></div>
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Priority
            </span>
          </div>
          <h3 className="headline text-xl font-bold mb-1">Mid-sem Prep</h3>
          <p className="text-xs text-on-surface-variant mb-6 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">person</span>
            Created by Jatin
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-on-surface">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full cta-gradient" style={{ width: "65%" }}></div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 text-xs font-medium text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">description</span> 12 Materials
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> 4 Days left
            </span>
          </div>
          <Link href="/hive/1/track/1" className="absolute inset-0 z-10" aria-label="Open Mid-sem Prep"></Link>
        </div>

        {/* Track Card 2 */}
        <div className="group bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-lowest transition-all duration-300 relative overflow-hidden clay-card">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full transition-all group-hover:w-32 group-hover:h-32"></div>
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">science</span>
            </div>
            <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Ongoing
            </span>
          </div>
          <h3 className="headline text-xl font-bold mb-1">Neuroscience Core</h3>
          <p className="text-xs text-on-surface-variant mb-6 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">person</span>
            Created by Sarah M.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-on-surface">
              <span>Progress</span>
              <span>20%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: "20%" }}></div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 text-xs font-medium text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">description</span> 28 Materials
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> 15 Days left
            </span>
          </div>
          <Link href="/hive/1/track/2" className="absolute inset-0 z-10" aria-label="Open Neuroscience Core"></Link>
        </div>

        {/* Track Card 3 - Add New */}
        <div className="group bg-surface-container-low rounded-[1.5rem] p-6 hover:bg-surface-container-lowest transition-all duration-300 relative overflow-hidden border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center clay-inset cursor-pointer min-h-[300px]">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h3 className="headline text-lg font-bold text-outline">New Study Track</h3>
          <p className="text-sm text-on-surface-variant/60 max-w-[150px] mt-2">
            Combine your materials into a focused path.
          </p>
          <button className="mt-6 text-primary font-bold text-sm hover:underline">Get Started</button>
        </div>
      </div>
    </div>
  );
}
