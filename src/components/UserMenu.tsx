"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { useTransition } from "react";

interface UserMenuProps {
  name: string;
  email: string;
  initials: string;
  avatarColor?: string;
}

const MENU_ITEMS = [
  { label: "Manage Profile", icon: "manage_accounts", href: "/dashboard/profile" },
  { label: "App Settings",   icon: "settings",        href: "/dashboard/settings" },
  { label: "Help & Support", icon: "help",            href: "/dashboard/help" },
];

export function UserMenu({ name, email, initials, avatarColor = "#fdc003" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger — user name + avatar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 group ${
          isOpen ? "bg-primary-container" : "hover:bg-surface-container-high"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span
          className={`text-sm font-bold transition-colors ${
            isOpen ? "text-on-primary-container" : "text-on-surface group-hover:text-primary"
          }`}
        >
          {name}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform text-surface-container-lowest"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
      </button>

      {/* Mobile trigger — avatar only */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm hover:scale-105 transition-transform cursor-pointer text-surface-container-lowest"
        style={{ backgroundColor: avatarColor }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {initials}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="menu"
          className="clay-card absolute right-0 top-full mt-3 w-72 bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant/15 overflow-hidden z-999 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* ── Identity block ─────────────────────────────────── */}
          <div className="px-4 py-4 flex items-center gap-3 border-b border-outline-variant/10">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg shadow-inner shrink-0 text-surface-container-lowest"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-on-surface truncate">{name}</p>
              <p className="text-xs text-on-surface-variant/60 truncate">{email}</p>
            </div>
          </div>

          {/* ── Nav links ──────────────────────────────────────── */}
          <nav className="py-2">
            {MENU_ITEMS.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                  {icon}
                </span>
                {label}
              </Link>
            ))}
            {/* Theme Toggle Placeholder */}
            <button
              role="menuitem"
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                  dark_mode
                </span>
                <span>Dark Mode</span>
              </div>
              <div className="w-8 h-4 bg-surface-container-high rounded-full relative group-hover:bg-primary/20 transition-colors">
                <div className="absolute left-1 top-1 w-2 h-2 bg-on-surface-variant rounded-full group-hover:bg-primary transition-all" />
              </div>
            </button>
          </nav>

          {/* ── Divider + logout ───────────────────────────────── */}
          <div className="border-t border-outline-variant/10 py-2">
            <button
              role="menuitem"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-error hover:bg-error/8 transition-colors group disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-105 transition-transform">
                {isPending ? "progress_activity" : "logout"}
              </span>
              {isPending ? "Signing out…" : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
