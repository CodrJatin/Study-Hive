"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "home" },
    { name: "Hives", href: "/dashboard/hives", icon: "hive" },
    { name: "Task Studio", href: "/dashboard/tasks", icon: "task_alt" },
    { name: "My Material", href: "/dashboard/materials", icon: "inbox" },
  ];

  return (
    <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
              isActive
                ? "bg-primary text-on-primary shadow-md clay-card border-none ring-2 ring-primary/20 scale-105"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest clay-inset"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {item.icon}
            </span>
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
