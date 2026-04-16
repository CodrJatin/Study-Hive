import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { AddHiveCard } from "@/components/dashboard/AddHiveCard";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = "cm0x_mock_user_1";

export default async function DashboardPage() {
  const hiveMemberships = await prisma.hiveMember.findMany({
    where: { userId: MOCK_USER_ID },
    include: { hive: true },
  });

  const hives = hiveMemberships.map((membership) => membership.hive);

  return (
    <main className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
      {/* Welcome Hero (Editorial Pattern) */}
      <section className="mb-12 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-background mb-4">
            Good morning, <span className="text-primary">Alex</span>.
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
            <span className="text-sm font-semibold">12 Day Streak</span>
          </div>
        </div>
      </section>

      {/* Bento Grid for Hive Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hives.map(hive => (
          <HiveCard key={hive.id} hive={{
            id: hive.id,
            title: hive.title,
            nextDeadline: hive.targetDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(hive.targetDate) : "No deadlines",
          }} />
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
            <div className="flex-grow">
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
            <div className="flex-grow">
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
