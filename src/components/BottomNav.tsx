"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function BottomNav() {
  const { hiveId } = useParams() as { hiveId?: string };
  const pathname = usePathname();
  
  if (pathname === "/dashboard") return null;

  // If we're not inside a specific hive, some tabs might lead back to dashboard or stay disabled
  const getLink = (path: string) => hiveId ? `/hive/${hiveId}/${path}` : "/dashboard";
  const isActive = (path: string) => pathname.includes(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-outline-variant/10 flex justify-around items-center py-3 px-2 z-50 bg-surface-container-low/90 backdrop-blur-md">
      <Link 
        href={hiveId ? `/hive/${hiveId}` : "/dashboard"} 
        className={`flex flex-col items-center gap-0.5 ${(!hiveId && pathname === "/dashboard") || (hiveId && pathname === `/hive/${hiveId}`) ? "text-primary" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: isActive("syllabus") || isActive("tracks") || isActive("materials") || isActive("settings") ? "" : "'FILL' 1" }}>
          {hiveId ? "home" : "grid_view"}
        </span>
        <span className="text-[10px] font-bold">{hiveId ? "Home" : "General"}</span>
      </Link>
      
      <Link 
        href={getLink("syllabus")} 
        className={`flex flex-col items-center gap-0.5 ${isActive("syllabus") ? "text-primary" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: isActive("syllabus") ? "'FILL' 1" : "" }}>account_tree</span>
        <span className="text-[10px] font-bold">Syllabus</span>
      </Link>

      <Link 
        href={getLink("materials")} 
        className={`flex flex-col items-center gap-0.5 ${isActive("materials") ? "text-primary" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: isActive("materials") ? "'FILL' 1" : "" }}>folder_open</span>
        <span className="text-[10px] font-bold">Materials</span>
      </Link>

      <Link 
        href={getLink("tracks")} 
        className={`flex flex-col items-center gap-0.5 ${isActive("tracks") ? "text-primary" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: isActive("tracks") ? "'FILL' 1" : "" }}>insights</span>
        <span className="text-[10px] font-bold">Tracks</span>
      </Link>

      <Link 
        href={getLink("settings")} 
        className={`flex flex-col items-center gap-0.5 ${isActive("settings") ? "text-primary" : "text-on-surface-variant"}`}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: isActive("settings") ? "'FILL' 1" : "" }}>settings</span>
        <span className="text-[10px] font-bold">Settings</span>
      </Link>
    </nav>
  );
}

