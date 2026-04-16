import React from "react";

export function AnnouncementCard({ announcement }: { announcement: any }) {
  return (
    <article className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 transition-all hover:bg-surface-container group cursor-pointer clay-card">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-headline font-bold text-on-background">{announcement.title}</h4>
        <span className="text-xs font-medium text-on-surface/40 bg-surface-container-high px-2 py-1 rounded">
          {announcement.timeAgo}
        </span>
      </div>
      <p className="text-on-surface/70 leading-relaxed mb-6">
        {announcement.content}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">
          {announcement.authorInitials}
        </div>
        <span className="text-sm font-semibold text-on-surface/80">{announcement.authorName}</span>
      </div>
    </article>
  );
}
