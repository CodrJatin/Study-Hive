import React from "react";
import Link from "next/link";
import { SidebarBranding } from "./SidebarBranding";
import { NavLinks } from "./NavLinks";

export default function Sidebar() {
  return (
    <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 overflow-y-auto bg-surface-container-low z-40 border-r border-outline-variant/10">
      <div className="flex flex-col py-8 gap-4 ml-4 pr-2">
        <SidebarBranding />
        <NavLinks />
      </div>
    </aside>
  );
}
