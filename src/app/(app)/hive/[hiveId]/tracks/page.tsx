import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TrackCard } from "@/components/tracks/TrackCard";
import { AddTrackCard } from "@/components/tracks/AddTrackCard";

export default async function TracksPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;
  const tracks = await prisma.track.findMany({
    where: { hiveId: hiveId },
    include: {
      trackTopics: {
        include: {
          topic: true
        }
      }
    }
  });

  const mappedTracks = tracks.map((track: any) => {
    return {
      id: track.id,
      title: track.name,
      description: track.description,
      creator: "Me", // Mock since no creatorId
      progress: track.progress || 0,
      colorScheme: track.type === 'QUICK_ADD' ? 'primary' : 'secondary',
      icon: track.type === 'QUICK_ADD' ? 'route' : 'work',
      statusBadge: track.type.replace('_', ' '),
      statusColor: track.type === 'QUICK_ADD' ? 'primary' : 'secondary',
      materialsCount: track.trackTopics.length * 2, // Mock estimation
      daysLeft: track.targetDate ? Math.max(0, Math.ceil((new Date(track.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
    }
  });

  const materials = await prisma.material.findMany({
    where: { hiveId: hiveId },
    select: { id: true, title: true, type: true }
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">
            Learning Ecosystem
          </span>
          <h1 className="headline text-4xl font-extrabold text-on-background tracking-tight">Active Tracks</h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Curated paths for your upcoming academic milestones.
          </p>
        </div>
      </header>

      {/* Tracks Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {mappedTracks.map((track: any) => (
          <TrackCard key={track.id} track={track} hiveId={hiveId} />
        ))}
        {/* Track Card - Add New */}
        <AddTrackCard materials={materials} hiveId={hiveId} />
      </div>
    </div>
  );
}
