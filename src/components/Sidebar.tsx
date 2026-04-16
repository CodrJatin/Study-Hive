import React from "react";
import Link from "next/link";
import { CreateHiveAction } from "@/components/modals/CreateHiveAction";

export default function Sidebar() {
  return (
    <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 overflow-y-auto bg-surface-container-low z-40 border-r border-outline-variant/10">
      <div className="flex flex-col py-8 gap-4 ml-4 pr-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <p className="font-headline font-extrabold text-[#1b1c1c] leading-tight dark:text-gray-100">The Curator</p>
              <p className="text-xs text-on-surface-variant/70">Academic Atelier</p>
            </div>
          </div>
          <CreateHiveAction />
        </div>
        <nav className="flex flex-col gap-1 pr-2 mt-4">
          <Link
            href="/hive/1"
            className="flex items-center gap-3 bg-primary-container text-on-primary-container font-bold rounded-lg px-4 py-3 mx-2 transition-all translate-x-1"
          >
            <span className="material-symbols-outlined" data-icon="grid_view">
              grid_view
            </span>
            <span className="font-label">General</span>
          </Link>
          <Link
            href="/hive/1/syllabus"
            className="flex items-center gap-3 text-on-surface/70 px-4 py-3 mx-2 hover:bg-primary-container/20 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined" data-icon="account_tree">
              account_tree
            </span>
            <span className="font-label">Syllabus</span>
          </Link>
          <Link
            href="/hive/1/materials"
            className="flex items-center gap-3 text-on-surface/70 px-4 py-3 mx-2 hover:bg-primary-container/20 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined" data-icon="folder_open">
              folder_open
            </span>
            <span className="font-label">Materials</span>
          </Link>
          <Link
            href="/hive/1/tracks"
            className="flex items-center gap-3 text-on-surface/70 px-4 py-3 mx-2 hover:bg-primary-container/20 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined" data-icon="insights">
              insights
            </span>
            <span className="font-label">Tracks</span>
          </Link>
          <Link
            href="/hive/1/settings"
            className="flex items-center gap-3 text-on-surface/70 px-4 py-3 mx-2 hover:bg-primary-container/20 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined" data-icon="settings">
              settings
            </span>
            <span className="font-label">Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
