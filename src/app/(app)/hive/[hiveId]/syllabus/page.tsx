import React from "react";
import { prisma } from "@/lib/prisma";
import { UnitAccordion } from "@/components/syllabus/UnitAccordion";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  const hasSyllabus = hive.units.length > 0;

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
          {hasSyllabus && (
            <>
              <div className="w-1 h-1 bg-outline-variant rounded-full hidden md:block"></div>
              <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                <div className="w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-primary to-tertiary"></div>
                </div>
                <span className="text-xs font-bold text-primary">34% Complete</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Syllabus Tree or Empty State */}
      <div className="space-y-6">
        {hasSyllabus ? (
          hive.units.map((unit: any, index: number) => (
            <UnitAccordion key={unit.id} unit={unit} index={index} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-surface-container-low rounded-[2rem] clay-inset border-2 border-dashed border-outline-variant/20">
            <div className="w-20 h-20 rounded-3xl bg-surface-container-highest flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-primary text-4xl">
                account_tree
              </span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
              No Syllabus Yet
            </h3>
            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
              This hive hasn&apos;t been organized into units and topics yet. Start by creating your first study unit.
            </p>
            <button className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">add</span>
              Add First Unit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}