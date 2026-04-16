"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();
  const params = useParams();
  
  // Extract hiveId from the URL params (e.g., from /hive/[hiveId])
  const hiveId = params?.hiveId;

  // Define nav items dynamically using the current hiveId
  const navItems = [
    { href: `/hive/${hiveId}`, label: "General", icon: "grid_view", exact: true },
    { href: `/hive/${hiveId}/syllabus`, label: "Syllabus", icon: "account_tree" },
    { href: `/hive/${hiveId}/materials`, label: "Materials", icon: "folder_open" },
    { href: `/hive/${hiveId}/tracks`, label: "Tracks", icon: "insights" },
    { href: `/hive/${hiveId}/settings`, label: "Settings", icon: "settings" },
  ];

  // If we aren't inside a hive route, don't render the links to avoid errors
  if (!hiveId) return null;

  return (
    <nav className="flex flex-col gap-1 pr-2 mt-4">
      {navItems.map((item) => {
        // Correct active logic: check if the current path matches exactly or starts with the href
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href) && pathname !== `/hive/${hiveId}`;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${
              isActive
                ? "bg-primary-container text-on-primary-container font-bold translate-x-1 shadow-sm"
                : "text-on-surface/70 hover:bg-primary-container/20"
            }`}
          >
            <span className="material-symbols-outlined" data-icon={item.icon}>
              {item.icon}
            </span>
            <span className="font-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}