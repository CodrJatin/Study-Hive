"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// The full player is loaded dynamically — it only enters the JS bundle after
// the user clicks the music button OR when autoPlay is enabled.
const HiveHum = dynamic(
  () => import("@/components/HiveHum").then((m) => ({ default: m.HiveHum })),
  {
    ssr: false,
    // Render nothing while the chunk is loading — the button below replaces itself
    loading: () => (
      <button
        disabled
        className="w-10 h-10 flex items-center justify-center rounded-full opacity-50 cursor-wait text-on-surface-variant"
        title="Loading Hive Hum…"
        aria-label="Loading music player"
      >
        <Icon name="hourglass_empty" className="animate-pulse text-[20px]" />
      </button>
    ),
  }
);

interface HiveHumLazyProps {
  autoPlay?: boolean;
}

/**
 * Lightweight header trigger for HiveHum.
 *
 * - When autoPlay is false (default): renders a static icon button.
 *   The full HiveHum chunk is fetched only when the user first clicks it.
 * - When autoPlay is true: mounts HiveHum immediately (user opted in to
 *   background music), but the chunk still loads asynchronously via dynamic().
 *
 * Either way, no Audio() object, no /api/music fetch, and no Dropdown logic
 * runs until the component is actually needed.
 */
export function HiveHumLazy({ autoPlay = false }: HiveHumLazyProps) {
  const [activated, setActivated] = useState(autoPlay);

  if (!activated) {
    return (
      <button
        onClick={() => setActivated(true)}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
        title="Hive Hum – ambient music player"
        aria-label="Open music player"
      >
        <Icon name="music_note" className="text-[20px]" />
      </button>
    );
  }

  // Once activated (click or autoPlay), load the real player
  return <HiveHum autoPlay={autoPlay} />;
}
