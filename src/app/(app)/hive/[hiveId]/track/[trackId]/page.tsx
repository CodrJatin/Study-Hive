import React from "react";
import { MaterialTile } from "@/components/track/MaterialTile";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TrackDetailsPage({ params }: { params: Promise<{ hiveId: string, trackId: string }> }) {
  const { hiveId, trackId } = await params;
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: {
      trackTopics: {
        include: {
          topic: true
        },
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!track || track.hiveId !== hiveId) {
    notFound();
  }

  // Calculate progress
  const completedTopics = track.trackTopics.filter(tt => tt.topic.status === 'COMPLETED').length;
  const totalTopics = track.trackTopics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-2 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">{track.name}</h1>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-auto">
            {progressPercent === 100 ? "Completed" : "In Progress"}
          </span>
        </div>
        <p className="text-stone-500 mb-8 max-w-2xl leading-relaxed">
          {track.description || "A curated study track designed to cover core materials."}
        </p>

        {/* Overall Progress */}
        <div className="bg-surface-container-low p-6 rounded-[2rem] clay-inset border-none">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-tighter">Your Journey</p>
              <p className="text-lg font-bold text-on-surface">{progressPercent}% Completed</p>
            </div>
            <p className="text-sm font-medium text-stone-500">{completedTopics} of {totalTopics} tasks done</p>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-on-surface-variant px-1">Active Curriculum</h2>

        {track.trackTopics.map((tt: any) => {
          const t = tt.topic;
          return (
            <MaterialTile key={t.id} material={{
              id: t.id,
              title: t.title,
              completed: t.status === 'COMPLETED',
              type: "TOPIC",
              details: t.duration ? t.duration : "Unknown duration",
              instructions: "Study this topic thoroughly."
            }} hiveId={hiveId} />
          );
        })}
      </div>

      {/* Bento Style Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="col-span-1 bg-tertiary-container/10 p-6 rounded-2xl border border-tertiary/10 flex flex-col justify-center">
          <span className="material-symbols-outlined text-tertiary mb-4">timer</span>
          <p className="text-xs font-bold text-tertiary uppercase tracking-widest">Est. Time Remaining</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">4.5 Hours</p>
        </div>
        <div className="col-span-1 bg-primary-container/10 p-6 rounded-2xl border border-primary/10 flex flex-col justify-center">
          <span className="material-symbols-outlined text-primary mb-4">groups</span>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Peers Active</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">12 Students</p>
        </div>
        <div className="col-span-1 bg-surface-container-low p-6 rounded-2xl clay-inset border-none">
          <div className="flex -space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9xsX-XRlbszSkqk4Qjzr9xGLQhUnrmb3juPZTSnM-X2ApMgPOt2_agUmnCe8fIFqNkfDud93JRqHzuMDLskBKWnIyoWaq7Kws-p7cVRW-Fk3dy3SFTFU_4wJYOgQZcGcSTvV7pQqbODqjYhIAu73y9EzzKT005c3YhMeSTT27S4vumAmchJx1xcArAFyJgtsklnNddk5b_NwmdAiTo11iwNhNzFXZiCrYNE61UG1x136MgtYwrBH55lKKS9Rppkn8HtYOYMf2AQ" alt="Peer" className="w-full h-full object-cover"/>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUDtMwNahU4dlByk07iZ-kSUTVN2a9nk2Yh5qwa_phKiXijDsgpbKhzR1ET6a3W6LjoAu69GCO4nl-mhCIQfWQTJgvQZrAWLRmGdhca3IfEv_LxTYIT7wLptRJKtHj5umXFidrHe2RiEyLzPJbgVvGatmjReLqESnipJST6QnhJefKS9Yw3A5xuQrokqaIoyNjBbUjmjCizUZUHu_rbEXuKKSNPm9jv2YZHiF8hmMuxiCzNtsCxPyUThfOVBHRdl3M6d6LjZyZMA" alt="Peer" className="w-full h-full object-cover"/>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQW0ZDzd8c6_kYZBCYBGRJtlXikKkxBksbX_z-oaDab7i7SS6ctq9OWjoae_DAdjwl97VaHx05ypWZFfk0P6kic_EPEwqK2TQDjx_mtfaeFV3Z7wTLd94YYdr9I2NcA5IL-bzndGe82fqZHyS7CtYwoK9-Nu5JLqfF9_CyHG2-JVIVThmxR4J2_bcdrApfIRky8HSwcRFSjF4afHacd8qHJJWNkFNZ1oiNsjxsCrE3cnhaIL085HXPUsnueai4f75AcYM9nGTd7Q" alt="Peer" className="w-full h-full object-cover"/>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold text-stone-500">
              +9
            </div>
          </div>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Join Study Session</p>
          <button className="mt-2 text-sm font-bold text-primary hover:underline transition-all">Enter Room &rarr;</button>
        </div>
      </div>
    </div>
  );
}
