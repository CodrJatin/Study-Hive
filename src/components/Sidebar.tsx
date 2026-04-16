import React from "react";
import Link from "next/link";
import { SidebarBranding } from "./SidebarBranding";
import { NavLinks } from "./NavLinks";

export default function Sidebar({ hiveTitle }: { hiveTitle: string }) {
  return (
    <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 overflow-y-auto bg-surface-container-low z-40 border-r border-outline-variant/10">
      <div className="flex flex-col py-8 gap-4 ml-4 pr-2">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-4 mb-2 text-sm font-bold text-on-surface-variant/60 hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          Dashboard
        </Link>
        <SidebarBranding hiveTitle={hiveTitle} />
        <NavLinks />
      </div>
    </aside>
  );
}
