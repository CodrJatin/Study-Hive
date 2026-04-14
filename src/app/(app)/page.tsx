import TopBar from "@/components/TopBar";
import ProgressBar from "@/components/ProgressBar";
import { tracks, hiveMembers, syllabusUnits } from "@/lib/data";
import {
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Clock,
  ChevronRight,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";

const colorMap = {
  primary: {
    bg: "var(--color-primary-container)",
    text: "var(--color-on-primary-container)",
    badge: "badge-primary",
    glow: "rgba(253, 192, 3, 0.15)",
  },
  secondary: {
    bg: "var(--color-secondary-container)",
    text: "var(--color-on-secondary-container)",
    badge: "badge-secondary",
    glow: "rgba(0, 94, 159, 0.12)",
  },
  tertiary: {
    bg: "var(--color-tertiary-container)",
    text: "var(--color-on-tertiary-container)",
    badge: "badge-tertiary",
    glow: "rgba(151, 32, 171, 0.12)",
  },
};

export default function DashboardPage() {
  const overallProgress = Math.round(
    tracks.reduce((sum, t) => sum + t.progress, 0) / tracks.length
  );

  return (
    <>
      <TopBar title="StudyHive Dashboard" subtitle="The Living Cell • Deep Work Session" />

      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* ── Welcome Banner ── */}
        <section className="animate-fade-up">
          <div className="clay-card p-6 relative overflow-hidden">
            {/* background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 -translate-y-1/2 translate-x-1/4"
              style={{ background: "radial-gradient(circle, #fdc003, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="chip chip-active mb-3 w-fit">
                    <Zap className="w-3 h-3" /> Active Study Session
                  </p>
                  <h2 className="text-2xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", letterSpacing: "-0.02em" }}>
                    Welcome back, Scholar 👋
                  </h2>
                  <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                    You have{" "}
                    <span className="font-semibold" style={{ color: "var(--color-on-surface)" }}>
                      3 active study tracks
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold" style={{ color: "var(--color-error)" }}>
                      1 upcoming deadline
                    </span>
                    .
                  </p>
                </div>

                {/* Overall progress ring */}
                <div className="clay-card-flat p-4 flex flex-col items-center gap-2 min-w-[120px]">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="26" fill="none"
                        stroke="var(--color-surface-container-highest)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="26" fill="none"
                        stroke="var(--color-primary-container)" strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - overallProgress / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-700" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                      {overallProgress}%
                    </span>
                  </div>
                  <p className="text-xs text-center" style={{ color: "var(--color-on-surface-variant)" }}>
                    Overall Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main grid: Tracks + AI + Members ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tracks */}
          <section className="lg:col-span-2 animate-fade-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Active Tracks
              </h2>
              <Link href="/tracks" className="btn-ghost text-xs py-1 px-3">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {tracks.map((track, i) => {
                const c = colorMap[track.color];
                return (
                  <div key={track.id}
                    className={`clay-card p-4 cursor-pointer animate-fade-up delay-${(i + 1) * 100}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon block */}
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: c.bg }}>
                        <BookOpen className="w-5 h-5" style={{ color: c.text }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="text-sm font-semibold truncate"
                            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                            {track.name}
                          </h3>
                          <span className={`badge ${c.badge}`}>{track.tag}</span>
                        </div>
                        <p className="text-xs mb-2" style={{ color: "var(--color-on-surface-variant)" }}>
                          {track.subject} • Updated {track.updatedAt}
                        </p>
                        <div className="flex items-center gap-3">
                          <ProgressBar value={track.progress} className="flex-1" />
                          <span className="text-xs font-semibold flex-shrink-0"
                            style={{ color: "var(--color-on-surface-variant)" }}>
                            {track.progress}%
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1"
                        style={{ color: "var(--color-outline-variant)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right column: AI + Members */}
          <div className="flex flex-col gap-4">
            {/* AI Study Mate */}
            <section className="animate-fade-up delay-200">
              <div className="clay-card p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                  style={{ background: "radial-gradient(circle at 70% 30%, var(--color-primary-container), transparent 60%)" }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center animate-pulse-glow"
                      style={{ background: "var(--color-primary-container)" }}>
                      <Sparkles className="w-4 h-4" style={{ color: "var(--color-on-primary-container)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        AI Study Mate
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--color-on-surface-variant)" }}>
                        Flashcard generation ready
                      </p>
                    </div>
                  </div>

                  <div className="clay-inset p-3 mb-3">
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                      💡 I&apos;ve identified{" "}
                      <span className="font-semibold" style={{ color: "var(--color-on-surface)" }}>12 key concepts</span>{" "}
                      from your &apos;Genetics&apos; notes. Should I generate a quick quiz?
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button id="ai-generate-quiz" className="btn-primary text-xs py-2 px-4 flex-1 justify-center">
                      Generate Quiz
                    </button>
                    <button id="ai-later" className="btn-ghost text-xs py-2 px-3">
                      Later
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--color-surface-container-high)]">
                    <p className="text-[11px] font-medium mb-1" style={{ color: "var(--color-on-surface-variant)" }}>
                      Quick suggestion
                    </p>
                    <p className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                      🔥 Crush your Biochemistry quiz with a focused &quot;Sprints&quot; session.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hive Members */}
            <section className="animate-fade-up delay-300">
              <div className="clay-card-flat p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
                    <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                      Hive Members
                    </h3>
                  </div>
                  <span className="badge badge-secondary">{hiveMembers.length} active</span>
                </div>

                <div className="flex flex-col gap-2">
                  {hiveMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2.5">
                      <div className="avatar w-7 h-7 text-[11px] flex-shrink-0"
                        style={{ background: member.color, color: "var(--color-on-primary-container)" }}>
                        {member.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium truncate">{member.name}</span>
                          <span className="text-[10px] flex-shrink-0" style={{ color: "var(--color-on-surface-variant)" }}>
                            {member.progress}%
                          </span>
                        </div>
                        <ProgressBar value={member.progress} height="sm" className="mt-0.5" />
                      </div>
                      {member.role === "admin" && (
                        <Star className="w-3 h-3 flex-shrink-0" style={{ color: "var(--color-primary-container)" }} fill="currentColor" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── Syllabus Snapshot ── */}
        <section className="animate-fade-up delay-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Syllabus Snapshot
            </h2>
            <Link href="/syllabus" className="btn-ghost text-xs py-1 px-3">
              Full Syllabus <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {syllabusUnits.map((unit, i) => (
              <div key={unit.id}
                className={`clay-card p-4 cursor-pointer animate-fade-up delay-${(i + 1) * 100}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                    Unit {i + 1}
                  </p>
                  <span className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>
                    {unit.progress}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {unit.title}
                </h3>
                <ProgressBar value={unit.progress} height="sm" />
                <p className="text-[10px] mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
                  {unit.topics.length} topics
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer Stats ── */}
        <section className="animate-fade-up delay-500">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Study Hours", value: "47h", icon: Clock, color: "primary" as const },
              { label: "Topics Done", value: "28", icon: BookOpen, color: "secondary" as const },
              { label: "Streak", value: "12 days", icon: Zap, color: "tertiary" as const },
              { label: "Rank in Hive", value: "#1", icon: TrendingUp, color: "primary" as const },
            ].map(({ label, value, icon: Icon, color }) => {
              const c = colorMap[color];
              return (
                <div key={label} className="clay-card-flat p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c.bg }}>
                    <Icon className="w-5 h-5" style={{ color: c.text }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold leading-none"
                      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                      {value}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
