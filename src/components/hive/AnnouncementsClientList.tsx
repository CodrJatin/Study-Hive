"use client";

import React from "react";
import { AnnouncementCard } from "./AnnouncementCard";
import { useRealtime } from "@/hooks/useRealtime";

type AnnouncementType = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: { name: string };
};

export function AnnouncementsClientList({ 
  hiveId, 
  initialAnnouncements 
}: { 
  hiveId: string; 
  initialAnnouncements: AnnouncementType[];
}) {
  const liveData = useRealtime("Announcement", initialAnnouncements, { column: "hiveId", value: hiveId });

  return (
    <div className="space-y-4">
      {liveData.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={{
            title: announcement.title,
            content: announcement.content,
            timeAgo: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(announcement.createdAt)),
            authorInitials: announcement.author?.name ? announcement.author.name.charAt(0).toUpperCase() : "?",
            authorName: announcement.author?.name || "Unknown",
          }}
        />
      ))}
      {liveData.length === 0 && (
        <div className="bg-surface-container-low rounded-3xl p-10 border border-outline-variant/10 flex flex-col items-center justify-center gap-4 clay-inset">
          <span className="material-symbols-outlined text-on-surface-variant/10 text-6xl">campaign</span>
          <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-xs">No announcements yet</p>
        </div>
      )}
    </div>
  );
}
