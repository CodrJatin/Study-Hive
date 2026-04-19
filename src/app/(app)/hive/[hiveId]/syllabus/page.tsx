import React from "react";
import { prisma } from "@/lib/prisma";
import { UnitAccordion } from "@/components/syllabus/UnitAccordion";
import { AddUnitForm } from "@/components/syllabus/AddUnitForm";
import { notFound } from "next/navigation";

export default async function SyllabusPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;

  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    include: {
      units: {
        orderBy: { position: "asc" },
        include: {
          topics: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  if (!hive) return notFound();

  const totalTopics = hive.units.reduce((sum, u) => sum + u.topics.length, 0);
  const completedTopics = hive.units.reduce(
    (sum, u) => sum + u.topics.filter((t) => t.status === "COMPLETED").length,
    0
  );
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
          Syllabus
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline font-extrabold text-on-background tracking-tight mb-2">
              {hive.title}
            </h1>
            <p className="text-on-surface-variant text-sm">
              {hive.units.length} unit{hive.units.length !== 1 ? "s" : ""} · {totalTopics} topic{totalTopics !== 1 ? "s" : ""}
            </p>
          </div>
          {totalTopics > 0 && (
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant">Progress</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant/60">
                {completedTopics} / {totalTopics} completed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Syllabus Tree */}
      <div className="space-y-4">
        {hive.units.map((unit, index) => (
          <UnitAccordion key={unit.id} unit={unit} index={index} hiveId={hiveId} />
        ))}

        {hive.units.length === 0 && (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl clay-inset border border-dashed border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4 block">
              account_tree
            </span>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-1">No Units Yet</h3>
            <p className="text-on-surface-variant text-sm">Add your first unit below to start building your syllabus.</p>
          </div>
        )}

        {/* Add Unit Form — always visible at the bottom */}
        <AddUnitForm hiveId={hiveId} />
      </div>
    </div>
  );
}