import React from "react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-outline-variant/10 flex justify-around items-center py-4 px-2 z-50 bg-[#fcf9f8]/90 backdrop-blur-md">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
        <span className="text-[10px] font-bold">General</span>
      </Link>
      <Link href="#" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">account_tree</span>
        <span className="text-[10px] font-medium">Syllabus</span>
      </Link>
      <Link href="#" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">folder_open</span>
        <span className="text-[10px] font-medium">Materials</span>
      </Link>
      <Link href="#" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">insights</span>
        <span className="text-[10px] font-medium">Tracks</span>
      </Link>
      <Link href="#" className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-medium">Settings</span>
      </Link>
    </nav>
  );
}
