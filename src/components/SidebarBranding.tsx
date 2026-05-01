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
    </div>
  );
}
