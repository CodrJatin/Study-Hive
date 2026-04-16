import React from "react";
import { prisma } from "@/lib/prisma";
import { UnitAccordion } from "@/components/syllabus/UnitAccordion";
import { notFound } from "next/navigation";

export default async function SyllabusPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;
  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    include: {
      units: {
        orderBy: { position: 'asc' },
        include: {
          topics: {
            orderBy: { position: 'asc' },
          },
        },
      },
    },
  });

  if (!hive) return notFound();

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header Section */}
      <div className="mb-12">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
          Current Path
        </span>
        <h2 className="text-4xl font-extrabold text-on-background mb-4 tracking-tight">
          {hive.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span className="text-sm font-medium">Fall 2024</span>
          </div>
          <div className="w-1 h-1 bg-outline-variant rounded-full hidden md:block"></div>
          <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
            <div className="w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-primary to-tertiary"></div>
            </div>
            <span className="text-xs font-bold text-primary">34% Complete</span>
          </div>
        </div>
      </div>

      {/* Syllabus Tree */}
      <div className="space-y-6">
        {hive.units.map((unit: any, index: number) => (
          <UnitAccordion key={unit.id} unit={unit} index={index} />
        ))}
      </div>
    </div>
  );
}
