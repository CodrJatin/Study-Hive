import React from "react";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = "cm0x_mock_user_1";

export default async function Header() {
  const user = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID },
  });

  const username = user?.name || "User";
  const initials = username.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-high z-[60] flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center justify-between gap-4 w-full max-w-7xl mx-auto">
        {/* Brand Logo or Breadcrumb */}
        <div className="flex items-center">
          <nav className="flex items-center gap-3 text-sm font-medium h-6">
            <span className="text-xl font-bold text-primary tracking-tighter font-headline">
              StudyHive
            </span>
          </nav>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="flex-grow max-w-xl hidden md:flex items-center px-4 py-2 bg-surface-container-high rounded-full focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/20 transition-all mx-8">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 w-full text-sm font-body outline-none"
            placeholder="Search Hives, notes, or curators..."
            type="text"
          />
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="hidden sm:inline-block text-sm font-bold text-on-surface">
              {username}
            </span>
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg border-2 border-primary-container hover:ring-2 ring-primary/20 transition-all">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
