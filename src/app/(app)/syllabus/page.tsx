"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import ProgressBar from "@/components/ProgressBar";
import { syllabusUnits } from "@/lib/data";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  FolderOpen,
  GripVertical,
  Plus,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

const statusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />;
    case "in-progress":
      return (
        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: "var(--color-primary-container)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-primary-container)" }} />
        </div>
      );
    default:
      return <Circle className="w-4 h-4" style={{ color: "var(--color-outline-variant)" }} />;
  }
};

export default function SyllabusPage() {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(["u1", "u2"]));

  const toggleUnit = (id: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const overallProgress = Math.round(
    syllabusUnits.reduce((sum, u) => sum + u.progress, 0) / syllabusUnits.length
  );

  return (
    <>
      <TopBar
        title="Master Syllabus"
        subtitle="Customize your learning path by reordering units and tracking progress."
      />

      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* ── Header block ── */}
        <section className="animate-fade-up">
          <div className="clay-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", letterSpacing: "-0.01em" }}>
                Biology HL – Curriculum
              </h2>
              <p className="text-sm mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
                {syllabusUnits.length} units • {syllabusUnits.reduce((s, u) => s + u.topics.length, 0)} topics • Overall progress {overallProgress}%
              </p>
              <ProgressBar value={overallProgress} height="lg" />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button id="syllabus-add-unit" className="btn-secondary text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Unit
              </button>
              <button id="syllabus-ai-suggest" className="btn-primary text-xs">
                <Sparkles className="w-3.5 h-3.5" /> AI Suggest
              </button>
            </div>
          </div>
        </section>

        {/* ── Units list ── */}
        <section className="flex flex-col gap-4 animate-fade-up delay-100">
          {syllabusUnits.map((unit, ui) => {
            const isExpanded = expandedUnits.has(unit.id);
            const completedTopics = unit.topics.filter((t) => t.status === "completed").length;

            return (
              <div key={unit.id} className="clay-card overflow-hidden">
                {/* Unit header */}
                <button
                  id={`unit-toggle-${unit.id}`}
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                >
                  <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-outline-variant)" }} />

                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: "var(--color-primary-container)", color: "var(--color-on-primary-container)", fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                    {ui + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold"
                        style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        {unit.title}
                      </h3>
                      <span className="badge badge-primary">{unit.progress}%</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                      {completedTopics}/{unit.topics.length} topics completed
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:block w-24">
                      <ProgressBar value={unit.progress} height="sm" />
                    </div>
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4" style={{ color: "var(--color-on-surface-variant)" }} />
                      : <ChevronRight className="w-4 h-4" style={{ color: "var(--color-on-surface-variant)" }} />
                    }
                  </div>
                </button>

                {/* Topics list */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4 flex flex-col gap-2"
                    style={{ borderColor: "var(--color-surface-container)" }}>
                    {unit.topics.map((topic) => (
                      <div key={topic.id}
                        className={clsx(
                          "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-150",
                          topic.status === "completed" ? "opacity-60" : "hover:opacity-90"
                        )}
                        style={{ background: "var(--color-surface-container-low)" }}
                      >
                        <div className="flex-shrink-0">{statusIcon(topic.status)}</div>

                        <div className="flex-1 min-w-0">
                          <p className={clsx("text-sm font-medium", {
                            "line-through": topic.status === "completed",
                          })}>
                            {topic.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {topic.duration && (
                              <span className="flex items-center gap-1 text-[10px]"
                                style={{ color: "var(--color-on-surface-variant)" }}>
                                <Clock className="w-3 h-3" /> {topic.duration}
                              </span>
                            )}
                            {topic.resources != null && (
                              <span className="flex items-center gap-1 text-[10px]"
                                style={{ color: "var(--color-on-surface-variant)" }}>
                                <FolderOpen className="w-3 h-3" /> {topic.resources} resources
                              </span>
                            )}
                          </div>
                        </div>

                        <span className={clsx("badge flex-shrink-0", {
                          "badge-secondary": topic.status === "completed",
                          "badge-primary": topic.status === "in-progress",
                          "": topic.status === "not-started",
                        })}
                          style={topic.status === "not-started" ? {
                            background: "var(--color-surface-container-high)",
                            color: "var(--color-on-surface-variant)",
                          } : {}}>
                          {topic.status === "completed" ? "Done"
                            : topic.status === "in-progress" ? "In Progress"
                              : "Not Started"}
                        </span>
                      </div>
                    ))}

                    <button id={`add-topic-${unit.id}`}
                      className="btn-ghost text-xs mt-1 justify-center w-full"
                      style={{ borderRadius: "1.25rem", border: "1.5px dashed var(--color-outline-variant)" }}>
                      <Plus className="w-3.5 h-3.5" /> Add Topic
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
