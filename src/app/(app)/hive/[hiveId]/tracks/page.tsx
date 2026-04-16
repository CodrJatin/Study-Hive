import React from "react";
import Link from "next/link";
import { tracksData } from "@/lib/data";
import { TrackCard } from "@/components/tracks/TrackCard";

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
        {tracksData.map(track => (
          <TrackCard key={track.id} track={track} />
        ))}

        {/* Track Card - Add New */}
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
