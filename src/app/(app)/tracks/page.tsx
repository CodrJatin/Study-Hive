"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import ProgressBar from "@/components/ProgressBar";
import { activeTracks, syllabusUnits } from "@/lib/data";
import {
  Plus,
  Sparkles,
  BookOpen,
  Clock,
  Calendar,
  ChevronRight,
  GripVertical,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import clsx from "clsx";

export default function TracksPage() {
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(
    new Set(["t1", "t2", "t5"])
  );

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allTopics = syllabusUnits.flatMap((unit) =>
    unit.topics.map((t) => ({ ...t, unitTitle: unit.title }))
  );

  const totalHours = selectedTopics.size * 2.5; // rough estimate

  return (
    <>
      <TopBar
        title="Track Management"
        subtitle="Orchestrate your learning journey by bundling syllabus units into focused tracks."
      />

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Track Composer ── */}
        <section className="lg:col-span-2 flex flex-col gap-6 animate-fade-up">
          {/* Composer card */}
          <div className="clay-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold"
                  style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  Track Composer
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                  Mid-Sems Prep
                </p>
              </div>
              <div className="flex gap-2">
                <button id="composer-reset" className="btn-ghost text-xs py-1.5 px-3">
                  <X className="w-3.5 h-3.5" /> Reset
                </button>
                <button id="composer-save" className="btn-primary text-xs py-1.5 px-4">
                  Save Track
                </button>
              </div>
            </div>

            {/* Stats strip */}
            <div className="clay-inset p-3 flex items-center gap-6 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
                <span className="text-sm font-semibold">{selectedTopics.size}</span>
                <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>Topics Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                <span className="text-sm font-semibold">~{totalHours.toFixed(0)}h</span>
                <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>of deep work</span>
              </div>
            </div>

            {/* Topic selection */}
            <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
              {syllabusUnits.map((unit) => (
                <div key={unit.id}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-1 mb-1.5"
                    style={{ color: "var(--color-outline)" }}>
                    {unit.title}
                  </p>
                  {unit.topics.map((topic) => {
                    const isSelected = selectedTopics.has(topic.id);
                    return (
                      <button
                        id={`topic-select-${topic.id}`}
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={clsx(
                          "w-full flex items-center gap-3 p-3 rounded-2xl mb-1.5 text-left transition-all duration-150",
                          isSelected
                            ? "shadow-sm"
                            : "opacity-70 hover:opacity-100"
                        )}
                        style={{
                          background: isSelected
                            ? "var(--color-surface-container-lowest)"
                            : "var(--color-surface-container-low)",
                          boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                        }}
                      >
                        <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-outline-variant)" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{topic.title}</p>
                          {topic.duration && (
                            <p className="text-[10px] mt-0.5 flex items-center gap-1"
                              style={{ color: "var(--color-on-surface-variant)" }}>
                              <Clock className="w-3 h-3" /> {topic.duration}
                            </p>
                          )}
                        </div>
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-secondary)" }} />
                          : <Square className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-outline-variant)" }} />
                        }
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Right: Active Tracks ── */}
        <section className="flex flex-col gap-4 animate-fade-up delay-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold"
              style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Active Tracks
            </h2>
            <button id="tracks-new" className="btn-ghost text-xs py-1 px-3">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          {activeTracks.map((track) => (
            <div key={track.id} className="clay-card p-4 cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {track.name}
                </h3>
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--color-outline-variant)" }} />
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
                {track.description}
              </p>
              <ProgressBar value={track.progress} />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px]" style={{ color: "var(--color-on-surface-variant)" }}>
                  {track.units} units • {track.topics} topics
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold"
                  style={{ color: track.daysLeft <= 5 ? "var(--color-error)" : "var(--color-on-surface-variant)" }}>
                  <Calendar className="w-3 h-3" /> {track.daysLeft}d left
                </span>
              </div>
            </div>
          ))}

          {/* AI Smart Sequencing */}
          <div className="clay-card-flat p-4 border-2 border-dashed"
            style={{ borderColor: "var(--color-outline-variant)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <p className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Smart Sequencing
              </p>
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
              Let StudyHive&apos;s AI curate a track based on your lowest-performing topics.
            </p>
            <button id="ai-smart-sequencing" className="btn-primary text-xs w-full justify-center">
              <Sparkles className="w-3.5 h-3.5" /> Generate AI Track
            </button>
          </div>

          {/* Quick-Add */}
          <div className="clay-card-flat p-4">
            <p className="text-sm font-semibold mb-1"
              style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Quick-Add Track
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
              Bundle recent units from class
            </p>
            <button id="track-quick-add" className="btn-secondary text-xs w-full justify-center">
              <Plus className="w-3.5 h-3.5" /> Quick Add
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
