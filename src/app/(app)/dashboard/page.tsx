import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { AddHiveCard } from "@/components/dashboard/AddHiveCard";
import { prisma } from "@/lib/prisma";

import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should handle redirect, but as fallback or for safety:
    return null; // Or redirect
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const hiveMemberships = await prisma.hiveMember.findMany({
    where: { userId: user.id },
    include: { 
      hive: {
        include: {
          deadlines: {
            where: {
              dueDate: { gte: new Date() } // Only future deadlines
            },
            orderBy: { dueDate: "asc" },
            take: 1
          }
        }
      } 
    },
  });

  const hives = hiveMemberships.map((membership) => {
    const hive = membership.hive;
    const nearestDeadline = hive.deadlines[0];
    
    return {
      ...hive,
      nextDeadlineText: nearestDeadline
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(nearestDeadline.dueDate)
        : hive.targetDate
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(hive.targetDate)
        : "No deadlines",
    };
  });

  return (
    <main className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
      {/* Welcome Hero (Editorial Pattern) */}
      <section className="mb-12 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-background mb-4">
            Good morning, <span className="text-primary">{profile?.name || "Scholar"}</span>.
          </h1>
        </div>
      </section>

      {/* Bento Grid for Hive Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hives.map((hive) => (
          <HiveCard
            key={hive.id}
            hive={{
              id: hive.id,
              title: hive.title,
              nextDeadline: hive.nextDeadlineText,
            }}
          />
        ))}
        
        {/* Add New Hive Card (Asymmetric Layout Element) */}
        <AddHiveCard />
      </section>

      {/* Activity Feed (Glassmorphism Sidebar for Desktop) */}
      <section className="mt-16 bg-surface-container-low rounded-xl p-8 relative overflow-hidden clay-inset">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-headline font-extrabold text-on-surface">Recent Curations</h2>
          <button className="text-sm font-semibold text-primary flex items-center gap-1">
            View Archive
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl clay-card">
            <div className="w-12 h-12 rounded-lg bg-tertiary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">description</span>
            </div>
            <div className="grow">
              <p className="text-sm font-bold text-on-surface">Photosynthesis_Flowchart.pdf</p>
              <p className="text-xs text-on-surface-variant">Shared in Biology 101 • 2h ago</p>
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </button>
          </div>
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl clay-card">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">forum</span>
            </div>
            <div className="grow">
              <p className="text-sm font-bold text-on-surface">Marcus joined the Algorithms Hive</p>
              <p className="text-xs text-on-surface-variant">Invite accepted via link • 4h ago</p>
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
