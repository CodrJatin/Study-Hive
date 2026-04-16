"use client";

import { useParams } from "next/navigation";

export function SidebarBranding({ hiveTitle }: { hiveTitle: string }) {
  const params = useParams();
  const hiveId = params?.hiveId;

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
