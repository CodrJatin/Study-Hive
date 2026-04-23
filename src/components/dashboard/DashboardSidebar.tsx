"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewHiveModal } from "@/components/modals/NewHiveModal";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const links = [
    { name: "Overview", href: "/dashboard", icon: "home" },
    { name: "Hives", href: "/dashboard/hives", icon: "hive" },
    { name: "Task Studio", href: "/dashboard/tasks", icon: "task_alt" },
    { name: "My Material", href: "/dashboard/materials", icon: "inbox" },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest z-40 border-r border-outline-variant/10 p-6">
        {/* Branding */}
        <div className="mb-8 mt-2">
          <h1 className="text-xl font-headline font-black text-on-background tracking-tight">
            Study<span className="text-primary">Hive</span>
          </h1>
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">
            The Digital Curator
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 rounded-xl font-bold hover:opacity-90 transition-colors mb-8 shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Hive
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-surface-container-low text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] opacity-80">
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <NewHiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
