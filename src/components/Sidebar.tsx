"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  BarChart2,
  Users,
  Timer,
  FolderOpen,
  Settings,
  Hexagon,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Hives", icon: LayoutGrid },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/tracks", label: "Tracks", icon: BarChart2 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/exam-mode", label: "Exam Mode", icon: Timer },
  { href: "/resources", label: "Resources", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col gap-2 px-3 py-6 z-30"
      style={{ background: "var(--color-surface-container-low)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--color-primary-container)" }}>
          <Hexagon className="w-5 h-5" style={{ color: "var(--color-on-primary-container)" }} fill="currentColor" />
        </div>
        <div>
          <span className="text-base font-bold leading-none"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", color: "var(--color-on-surface)" }}>
            StudyHive
          </span>
          <p className="text-[10px] font-medium" style={{ color: "var(--color-on-surface-variant)" }}>
            The Living Cell
          </p>
        </div>
      </div>

      {/* Context label */}
      <p className="px-3 text-[10px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: "var(--color-outline)" }}>
        Deep Work Session
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx("sidebar-item", { "sidebar-item-active": isActive })}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User avatar */}
      <div className="clay-card-flat p-3 flex items-center gap-3">
        <div className="avatar w-9 h-9 text-sm flex-shrink-0"
          style={{ background: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}>
          AC
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Alex Chen
          </p>
          <p className="text-xs truncate" style={{ color: "var(--color-on-surface-variant)" }}>
            Biology HL • Admin
          </p>
        </div>
      </div>
    </aside>
  );
}
