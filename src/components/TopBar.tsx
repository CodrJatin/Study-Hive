"use client";

import { Bell, Search, Sparkles } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="glass-nav sticky top-0 z-20 flex items-center justify-between px-6 h-16">
      {/* Left: page title */}
      <div>
        <h1 className="text-lg font-bold leading-none"
          style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", color: "var(--color-on-surface)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button id="topbar-search" className="btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded-full" aria-label="Search">
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* AI badge */}
        <button id="topbar-ai" className="btn-secondary hidden sm:flex items-center gap-1.5 py-1.5 px-3 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          AI Study Mate
        </button>

        {/* Notifications */}
        <button id="topbar-notifications"
          className="relative btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded-full"
          aria-label="Notifications">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--color-error-container)" }} />
        </button>
      </div>
    </header>
  );
}
