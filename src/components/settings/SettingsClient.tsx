"use client";

import React, { useOptimistic, useState, useTransition, useEffect } from "react";
import { useTheme } from "next-themes";
import { updatePreferences, updateProfile } from "@/actions/settings";
import { logout } from "@/actions/auth";
import { Dropdown } from "@/components/shared/Dropdown";
import type { DropdownOption } from "@/components/shared/Dropdown";
import { toast } from "sonner";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface PrefsState {
  theme: string;
  autoPlayHum: boolean;
  avatarColor: string;
  avatarType: string;
}

interface ProfileData {
  name: string;
  email: string;
  image: string | null;
  avatarColor: string;
  avatarType: string;
  initials: string;
  joinedAt: string;
}

// ─────────────────────────────────────────
// Toggle component
// ─────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? "bg-primary" : "bg-surface-container-high"
        }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${checked ? "left-6" : "left-1"
          }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────
// PreferenceRow wrapper
// ─────────────────────────────────────────
function PreferenceRow({
  icon,
  label,
  description,
  children,
  onClick,
}: {
  icon: string;
  label: string;
  description?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-surface-container-low transition-colors first:rounded-t-3xl last:rounded-b-3xl ${onClick ? "cursor-pointer select-none" : ""
        }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px] text-on-primary-container">
            {icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-on-surface text-sm">{label}</p>
          {description && (
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed max-w-xs">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 flex sm:block self-end sm:self-auto">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────
// Main client component
// ─────────────────────────────────────────
export function SettingsClient({
  initialPrefs,
  profile,
}: {
  initialPrefs: PrefsState;
  profile: ProfileData;
}) {
  const [optimisticPrefs, setOptimisticPrefs] = useOptimistic(initialPrefs);
  const [optimisticProfile, setOptimisticProfile] = useOptimistic(profile);
  const [isPending, startTransition] = useTransition();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);
  const [selectedColor, setSelectedColor] = useState(profile.avatarColor);

  const themeOptions: DropdownOption[] = [
    { id: "system", title: "System", icon: "device_unknown" },
    { id: "light", title: "Light", icon: "light_mode" },
    { id: "dark", title: "Dark", icon: "dark_mode" },
  ];

  const avatarTypeOptions: DropdownOption[] = [
    { id: "image", title: "Profile Image", icon: "image" },
    { id: "initials", title: "Initials", icon: "text_fields" },
  ];

  const { setTheme } = useTheme();

  const save = (next: Partial<PrefsState>) => {
    const merged = { ...optimisticPrefs, ...next };
    startTransition(async () => {
      setOptimisticPrefs(merged);

      // Apply theme change instantly via next-themes
      if (next.theme) {
        setTheme(next.theme);
      }

      // Sync avatar color to profile preview instantly
      if (next.avatarColor) {
        setOptimisticProfile((prev) => ({ ...prev, avatarColor: next.avatarColor! }));
      }
      if (next.avatarType) {
        setOptimisticProfile((prev) => ({ ...prev, avatarType: next.avatarType! }));
      }
      const fd = new FormData();
      fd.set("theme", merged.theme);
      fd.set("autoPlayHum", String(merged.autoPlayHum));
      fd.set("avatarColor", merged.avatarColor);
      fd.set("avatarType", merged.avatarType);
      const result = await updatePreferences(null, fd);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Preferences saved.");
      }
    });
  };

  const handleToggleAutoPlay = () => {
    save({ autoPlayHum: !optimisticPrefs.autoPlayHum });
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === optimisticProfile.name) {
      setIsEditingName(false);
      return;
    }

    startTransition(async () => {
      setOptimisticProfile({ ...optimisticProfile, name: newName });
      setIsEditingName(false);

      const fd = new FormData();
      fd.set("name", newName);

      const result = await updateProfile(fd);
      if (result?.error) {
        toast.error(result.error);
        setNewName(profile.name);
      } else {
        toast.success("Profile updated.");
      }
    });
  };

  return (
    <div className="space-y-12">
      {/* ── Your Profile ────────────────────────────── */}
      <section id="profile" className="space-y-4 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-on-surface">Your Profile</h2>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl clay-card overflow-hidden relative">
          <div
            className="h-24"
            style={{ backgroundColor: `${optimisticProfile.avatarColor}33` }}
          />

          {/* Edit Profile Button */}
          {!isEditingName && (
            <button
              onClick={() => setIsEditingName(true)}
              className="absolute bottom-6 right-6 z-10 text-on-surface-variant hover:text-primary transition-colors group"
              title="Edit Profile"
            >
              <span className="material-symbols-outlined text-[20px] group-active:scale-90 transition-transform">edit</span>
            </button>
          )}

          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4 flex items-end justify-between gap-4">
              <div
                className="w-20 h-20 rounded-2xl shadow-lg border-4 border-surface-container-lowest flex items-center justify-center font-extrabold text-3xl text-white overflow-hidden shrink-0"
                style={{ backgroundColor: optimisticProfile.avatarColor }}
              >
                {optimisticProfile.image ? (
                  <img
                    src={optimisticProfile.image}
                    alt={optimisticProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  optimisticProfile.initials
                )}
              </div>
            </div>

            {isEditingName ? (
              <form onSubmit={handleUpdateName} className="space-y-4 max-w-sm pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface font-medium transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(profile.name);
                    }}
                    className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-sm font-bold hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-1">
                <p className="text-xl font-bold text-on-surface">{optimisticProfile.name}</p>
                <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {optimisticProfile.email}
                </p>
                <p className="text-xs text-on-surface-variant/60 flex items-center gap-1.5 pt-1">
                  <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                  Joined {optimisticProfile.joinedAt}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Preferences ─────────────────────────────── */}
      <section id="preferences" className="space-y-4 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-on-surface">Preferences</h2>
          <p className="text-sm text-on-surface-variant">
            Customize how StudyHive looks and behaves.
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl clay-card divide-y divide-surface-container">
          <PreferenceRow
            icon="palette"
            label="Default Theme"
            description="Choose how the app appears on this device."
          >
            <Dropdown
              options={themeOptions}
              value={optimisticPrefs.theme}
              onChange={(id) => save({ theme: id })}
              className="w-full sm:min-w-[150px]"
            />
          </PreferenceRow>
          <PreferenceRow
            icon="music_note"
            label="Auto-play Hive Hum"
            description="Automatically start focus sounds when you enter a hive."
            onClick={handleToggleAutoPlay}
          >
            <Toggle
              checked={optimisticPrefs.autoPlayHum}
              onChange={(v) => save({ autoPlayHum: v })}
              disabled={isPending}
            />
          </PreferenceRow>

          <PreferenceRow
            icon="account_circle"
            label="Avatar Style"
            description="Display your profile image or fallback to initials."
          >
            <Dropdown
              options={avatarTypeOptions}
              value={optimisticPrefs.avatarType}
              onChange={(id) => save({ avatarType: id })}
              className="w-full sm:min-w-[150px]"
            />
          </PreferenceRow>

          {/* Avatar Color */}
          <PreferenceRow
            icon="colorize"
            label="Avatar Color"
            description="Change the background color of your profile initials."
          >
            <div className="flex items-center gap-3">
              {selectedColor.toLowerCase() !== optimisticPrefs.avatarColor.toLowerCase() && (
                <button
                  onClick={() => save({ avatarColor: selectedColor })}
                  disabled={isPending}
                  className="w-9 h-9 rounded-xl text-primary flex items-center justify-center hover:bg-primary/10 active:scale-90 transition-all animate-in slide-in-from-right-4 fade-in duration-300 disabled:opacity-50"
                  title="Confirm color change"
                >
                  <span className="material-symbols-outlined text-[24px] font-bold">check</span>
                </button>
              )}

              <div className="flex items-center gap-3 bg-surface-container-low p-1.5 pl-3 rounded-2xl border border-outline-variant/20 shadow-sm">
                <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">
                  {selectedColor}
                </span>
                <div
                  className="w-8 h-8 rounded-xl shadow-inner border border-white/20 relative cursor-pointer hover:scale-105 transition-transform active:scale-95"
                  style={{ backgroundColor: selectedColor }}
                >
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>
            </div>
          </PreferenceRow>
        </div>
      </section>

      {/* ── Account ──────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-on-surface">Account</h2>
          <p className="text-sm text-on-surface-variant">
            Manage your account access and data.
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl clay-card overflow-hidden">
          <form action={logout}>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 hover:bg-error-container/20 transition-colors cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-on-error-container">
                    logout
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-error text-sm transition-colors">
                    Sign Out
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Sign out of your account on this device
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-error group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </form>
        </div>
      </section>

      <hr className="border-outline-variant/10" />

      {/* ── About the Site ────────────────────────────── */}
      <section id="about" className="space-y-4 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-on-surface">About the site</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            StudyHive is a collaborative learning platform designed to help students organize their materials, track their progress, and build vibrant study communities. Whether you&apos;re mastering a new language or tackling engineering challenges, StudyHive provides the tools you need to stay focused and connected.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl clay-card p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">person</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Creator</p>
                <p className="text-lg font-bold text-on-surface">Jatin</p>
              </div>
            </div>

            <a
              href="https://github.com/CodrJatin/Study-Hive"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 h-12 rounded-2xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center gap-3 transition-all group"
              title="View Source on GitHub"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-on-surface-variant group-hover:fill-primary transition-colors">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="font-bold text-on-surface-variant group-hover:text-primary transition-colors">StudyHive</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
