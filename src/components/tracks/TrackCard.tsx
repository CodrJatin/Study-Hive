import React from "react";
import Link from "next/link";

export function TrackCard({ track, hiveId }: { track: any, hiveId: string }) {
  return (
    <div className="group bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-lowest transition-all duration-300 relative overflow-hidden clay-card">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${track.colorScheme}/5 rounded-bl-full transition-all group-hover:w-32 group-hover:h-32`}></div>
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 bg-${track.colorScheme}-container rounded-lg flex items-center justify-center text-${track.colorScheme}`}>
          <span className="material-symbols-outlined">{track.icon}</span>
        </div>
        <span className={`bg-${track.statusColor}/10 text-${track.statusColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
          {track.statusBadge}
        </span>
      </div>
      <h3 className="headline text-xl font-bold mb-1">{track.title}</h3>
      <p className="text-xs text-on-surface-variant mb-6 flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">person</span>
        {track.creator}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-on-surface">
          <span>Progress</span>
          <span>{track.progress}%</span>
        </div>
        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className={track.colorScheme === 'primary' ? "h-full cta-gradient" : `h-full bg-${track.colorScheme}`} style={{ width: `${track.progress}%` }}></div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 text-xs font-medium text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">description</span> {track.materialsCount} Materials
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">schedule</span> {track.daysLeft} Days left
        </span>
      </div>
      <Link href={`/hive/${hiveId}/track/${track.id}`} className="absolute inset-0 z-10" aria-label={`Open ${track.title}`}></Link>
    </div>
  );
}
