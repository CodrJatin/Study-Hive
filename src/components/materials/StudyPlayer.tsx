"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { toggleVideoProgress } from "@/actions/materials";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface VideoItem {
  id: string;
  title: string;
  durationSeconds: number;
  position: number;
  thumbnail?: string;
}

interface StudyPlayerProps {
  materialTitle: string;
  channelName?: string;
  videos: VideoItem[];
  materialId: string;
  hiveId?: string;
  initialCompletedPositions: number[];
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDurationLong(seconds: number): string {
  if (seconds <= 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export function StudyPlayer({
  materialTitle,
  channelName,
  videos,
  materialId,
  hiveId = "",
  initialCompletedPositions,
}: StudyPlayerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  // Optimistic completed positions — toggled instantly without waiting for server
  const [completedPositions, setCompletedPositions] = useState<number[]>(
    initialCompletedPositions
  );
  const [isPending, startTransition] = useTransition();
  const [playbackRate, setPlaybackRate] = useState(1);
  const rates = [1, 1.25, 1.5, 2];

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeVideo = videos[activeIdx];
  const isPlaylist = videos.length > 1;
  const embedUrl = `https://www.youtube.com/embed/${activeVideo?.id}?autoplay=1&rel=0`;

  // ── Route Preservation Fix ────────────────────────────────────
  // When Next.js preserves this route (hides it), useEffect cleanup runs.
  // We clear the iframe src to stop audio, and restore it when unhidden.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && activeVideo) {
      // If src is empty (from cleanup) or doesn't match current video, restore it
      if (!iframe.src.includes(activeVideo.id)) {
        iframe.src = embedUrl;
      }
    }
    return () => {
      if (iframe) {
        iframe.src = ""; // Stop audio/video
      }
    };
  }, [embedUrl, activeVideo]);

  // ── Derived stats ─────────────────────────────────────────────
  const totalSeconds = videos.reduce((sum, v) => sum + v.durationSeconds, 0);
  const completedVideos = videos.filter((v) =>
    completedPositions.includes(v.position)
  );
  const completedCount = completedVideos.length;
  const completedSeconds = completedVideos.reduce(
    (sum, v) => sum + v.durationSeconds,
    0
  );
  const remainingSeconds = totalSeconds - completedSeconds;
  const adjustedRemainingSeconds = remainingSeconds / playbackRate;

  // ── Toggle handler ────────────────────────────────────────────
  function handleToggle(
    e: React.MouseEvent | React.ChangeEvent,
    position: number,
    currentlyDone: boolean
  ) {
    // Prevent the row's play-video click from firing
    e.stopPropagation();

    // Optimistic update
    setCompletedPositions((prev) =>
      currentlyDone
        ? prev.filter((p) => p !== position)
        : [...prev, position].sort((a, b) => a - b)
    );

    startTransition(async () => {
      await toggleVideoProgress(materialId, hiveId, position, !currentlyDone);
    });
  }

  if (!activeVideo) {
    return (
      <div className="clay-inset rounded-3xl p-16 text-center">
        <Icon name="videocam_off" className="text-on-surface-variant/30 text-6xl mb-3" />
        <p className="text-on-surface-variant font-semibold">No video available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
            {materialTitle}
            {isPlaylist && completedCount > 0 && (
              <span className="ml-3 text-lg font-bold text-primary">
                ({completedCount}/{videos.length})
              </span>
            )}
          </h1>

          {/* Time badges — playlists only */}
          {isPlaylist && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant text-xs font-bold px-3 py-1.5 rounded-full">
                <Icon name="schedule" className="text-[14px]" />
                Total: {formatDurationLong(totalSeconds)}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                  remainingSeconds === 0
                    ? "bg-tertiary-container text-on-tertiary-container"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Icon name={remainingSeconds === 0 ? "task_alt" : "hourglass_empty"} className="text-[14px]" />
                {remainingSeconds === 0
                  ? "All done!"
                  : `Remaining: ${formatDurationLong(adjustedRemainingSeconds)}`}
              </span>

              {remainingSeconds > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = rates.indexOf(playbackRate);
                    const nextIdx = (currentIndex + 1) % rates.length;
                    setPlaybackRate(rates[nextIdx]);
                  }}
                  className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-primary/10 text-xs font-bold px-3 py-1.5 rounded-full transition-all border border-outline-variant/10 active:scale-95"
                  title="Change playback speed estimate"
                >
                  <Icon name="speed" className="text-[14px]" />
                  x{playbackRate}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          {channelName && (
            <span className="text-sm font-semibold text-on-surface-variant flex items-center gap-1.5">
              <Icon name="account_circle" className="text-[16px]" />
              {channelName}
            </span>
          )}
          {isPlaylist && (
            <>
              <span className="text-on-surface-variant/30 text-xs">·</span>
              <span className="text-sm font-semibold text-primary">
                {activeIdx + 1} / {videos.length} videos
              </span>
            </>
          )}
        </div>

        {isPlaylist && (
          <p className="mt-1 text-xs text-on-surface-variant/60 font-medium">
            Now Playing:{" "}
            <span className="text-on-surface font-semibold">{activeVideo.title}</span>
          </p>
        )}
      </div>

      {/* ── Split Layout ────────────────────────────────────────── */}
      <div className={`grid gap-5 ${isPlaylist ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* LEFT: Player */}
        <div className={isPlaylist ? "lg:col-span-8" : ""}>
          <div className="clay-card rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
            {/* 16:9 iframe */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                key={activeVideo.id}
                ref={iframeRef}
                src={embedUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>

            {/* Video info bar */}
            <div className="px-5 py-4 border-t border-outline-variant/10 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-headline font-bold text-on-surface text-base leading-snug line-clamp-2">
                  {activeVideo.title}
                </h2>
                <p className="text-xs font-semibold text-on-surface-variant/60 mt-1 flex items-center gap-1">
                  <Icon name="schedule" className="text-[14px]" />
                  {formatDuration(activeVideo.durationSeconds)}
                </p>
              </div>

              {/* Mark-as-done for current video (playlist only) */}
              {isPlaylist && (
                <button
                  onClick={(e) =>
                    handleToggle(
                      e,
                      activeVideo.position,
                      completedPositions.includes(activeVideo.position)
                    )
                  }
                  disabled={isPending}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    completedPositions.includes(activeVideo.position)
                      ? "bg-tertiary-container text-on-tertiary-container"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon name={completedPositions.includes(activeVideo.position)
                      ? "task_alt"
                      : "radio_button_unchecked"} className="text-[17px]" />
                  {completedPositions.includes(activeVideo.position) ? "Done" : "Mark done"}
                </button>
              )}
            </div>

            {/* Prev / Next navigation (playlist only) */}
            {isPlaylist && (
              <div className="px-5 pb-5 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Icon name="skip_previous" className="text-[18px]" />
                  Previous
                </button>
                <button
                  onClick={() => setActiveIdx((i) => Math.min(videos.length - 1, i + 1))}
                  disabled={activeIdx === videos.length - 1}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white cta-gradient hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/15"
                >
                  Next
                  <Icon name="skip_next" className="text-[18px]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Playlist sidebar */}
        {isPlaylist && (
          <div className="lg:col-span-4">
            <div className="clay-card rounded-2xl bg-surface-container-lowest border border-outline-variant/10 flex flex-col h-full max-h-[calc(56.25vw*8/12+120px)] lg:max-h-[680px]">
              {/* Sidebar header with progress bar */}
              <div className="px-5 pt-5 pb-3 shrink-0 border-b border-outline-variant/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-on-surface/60 uppercase tracking-widest">
                    Playlist · {videos.length} videos
                  </h3>
                  <span className="text-xs font-bold text-primary">
                    {completedCount}/{videos.length} done
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${videos.length > 0 ? (completedCount / videos.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Scrollable list */}
              <div className="overflow-y-auto custom-scrollbar flex-1 p-3 space-y-1">
                {videos.map((video, idx) => {
                  const isActive = idx === activeIdx;
                  const isDone = completedPositions.includes(video.position);

                  return (
                    <div
                      key={video.id}
                      className={`w-full text-left flex items-start gap-3 rounded-xl p-2.5 transition-all group/item cursor-pointer ${
                        isActive
                          ? "bg-primary/10 ring-1 ring-primary/20"
                          : isDone
                          ? "bg-surface-container-high/60"
                          : "hover:bg-surface-container-high"
                      }`}
                      onClick={() => setActiveIdx(idx)}
                    >
                      {/* Checkbox — stopPropagation prevents row click */}
                      <button
                        onClick={(e) => handleToggle(e, video.position, isDone)}
                        disabled={isPending}
                        className={`shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-primary border-primary text-white"
                            : "border-outline-variant/50 hover:border-primary/50 text-transparent"
                        }`}
                        title={isDone ? "Mark as not done" : "Mark as done"}
                      >
                        <Icon name={isDone ? "check" : ""} className="text-[13px] leading-none" />
                      </button>

                      {/* Thumbnail */}
                      <div className="relative w-20 shrink-0 aspect-video rounded-lg overflow-hidden bg-surface-container-high">
                        {video.thumbnail ? (
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={80}
                            height={45}
                            className={`w-full h-full object-cover transition-opacity ${isDone ? "opacity-50" : ""}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="image" className="text-on-surface-variant/30 text-xl" />
                          </div>
                        )}

                        {/* Active equalizer overlay */}
                        {isActive && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Icon name="equalizer" className="text-white text-xl drop-shadow" />
                          </div>
                        )}

                        {/* Done checkmark overlay */}
                        {isDone && !isActive && (
                          <div className="absolute inset-0 bg-surface-container-high/40 flex items-center justify-center">
                            <Icon name="task_alt" className="text-primary text-xl drop-shadow" />
                          </div>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                            isDone
                              ? "text-on-surface-variant/50 line-through"
                              : isActive
                              ? "text-primary"
                              : "text-on-surface group-hover/item:text-primary"
                          }`}
                        >
                          {video.title}
                        </p>
                        <p className="text-[10px] font-semibold text-on-surface-variant/50 mt-1 flex items-center gap-1">
                          <Icon name="schedule" className="text-[12px]" />
                          {formatDuration(video.durationSeconds)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
