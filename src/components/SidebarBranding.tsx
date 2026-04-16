"use client";

import { useParams } from "next/navigation";
import { dashboardHivesData } from "@/lib/data";

export function SidebarBranding() {
  const params = useParams();
  const hiveId = params?.hiveId;

  // Find the hive title from our mock data
  const hive = dashboardHivesData.find((h) => h.id === hiveId);
  const hiveTitle = hive ? hive.title : "StudyHive";

  return (
    <div className="px-4 py-2 mb-2">
      <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
        {hiveTitle}
      </h2>
      {hiveId && (
        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Active Hive
        </p>
      )}
    </div>
  );
}
