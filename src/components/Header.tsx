import { Icon } from "@/components/ui/Icon";
import React from "react";
import Link from "next/link";
import { getCurrentSupabaseUser, getCurrentPrismaUser } from "@/lib/session";
import { HeaderSearch } from "@/components/HeaderSearch";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HiveHumLazy } from "@/components/HiveHumLazy";

export default async function Header() {
  const [authUser, user] = await Promise.all([
    getCurrentSupabaseUser(),
    getCurrentPrismaUser(),
  ]);

  const username = user?.name || "Scholar";
  const email = user?.email || authUser?.email || "";
  const initials = username.charAt(0).toUpperCase();
  const avatarColor = user?.avatarColor ?? "#fdc003";
  const userImage = user?.image;
  const avatarType = user?.avatarType ?? "image";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-high z-60 flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center justify-between gap-4 w-full max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link 
            href="/dashboard"
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <span className="text-xl font-bold text-primary tracking-tighter font-headline">
            StudyHive
          </span>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <HeaderSearch />
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search (Mobile) */}
          <div className="md:hidden">
            <HeaderSearch isMobile />
          </div>

          <ThemeToggle />

          {/* Hive Hum — loads player chunk only on first click or when autoPlay is on */}
          <HiveHumLazy autoPlay={user?.autoPlayHum ?? false} />

          {/* User Dropdown */}
          <UserMenu
            name={username}
            email={email}
            initials={initials}
            avatarColor={avatarColor}
            image={userImage}
            avatarType={avatarType}
          />
        </div>
      </div>
    </header>
  );
}
