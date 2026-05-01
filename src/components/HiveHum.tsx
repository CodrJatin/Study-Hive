"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dropdown, DropdownOption } from "@/components/shared/Dropdown";

interface Track {
  id: number;
  title: string;
  src: string;
}

const FALLBACK_TRACK: Track = {
  id: 0,
  title: "Silence",
  src: "",
};

export function HiveHum({ autoPlay = false }: { autoPlay?: boolean }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayAttempted = useRef(false);

  // Fetch tracks from API
  useEffect(() => {
    async function fetchMusic() {
      try {
        const res = await fetch("/api/music");
        if (!res.ok) throw new Error("Failed to fetch music");
        const data = await res.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching music:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMusic();
  }, []);

  // Initialize audio element immediately if not present
  if (typeof window !== "undefined" && !audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
    audioRef.current.loop = true;
  }

  // Handle Auto-play & Interaction fallback
  useEffect(() => {
    if (!autoPlay || isLoading || tracks.length === 0 || autoPlayAttempted.current) return;

    const attemptPlay = () => {
      if (!audioRef.current || autoPlayAttempted.current) return;
      
      const track = tracks[currentTrackIndex];
      if (track.src) {
        audioRef.current.src = track.src;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsActive(true);
            autoPlayAttempted.current = true;
            // Clean up listeners if they were added
            window.removeEventListener("click", attemptPlay);
            window.removeEventListener("keydown", attemptPlay);
            window.removeEventListener("mousedown", attemptPlay);
            window.removeEventListener("touchstart", attemptPlay);
          })
          .catch((err) => {
            console.warn("Autoplay still blocked. Waiting for interaction...", err);
          });
      }
    };

    // First attempt
    attemptPlay();

    // Listen for interaction if initial attempt failed
    if (!autoPlayAttempted.current) {
      window.addEventListener("click", attemptPlay, { once: true });
      window.addEventListener("keydown", attemptPlay, { once: true });
      window.addEventListener("mousedown", attemptPlay, { once: true });
      window.addEventListener("touchstart", attemptPlay, { once: true });
    }

    return () => {
      window.removeEventListener("click", attemptPlay);
      window.removeEventListener("keydown", attemptPlay);
      window.removeEventListener("mousedown", attemptPlay);
      window.removeEventListener("touchstart", attemptPlay);
    };
  }, [autoPlay, isLoading, tracks, currentTrackIndex]);

  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : FALLBACK_TRACK;

  // Sync track changes
  useEffect(() => {
    if (audioRef.current && currentTrack.src) {
      // Check if src is different
      const currentUrl = new URL(currentTrack.src, window.location.origin).href;
      if (audioRef.current.src !== currentUrl) {
        audioRef.current.src = currentTrack.src;
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  }, [currentTrackIndex, currentTrack.src, isPlaying]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioRef.current || !currentTrack.src) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!isPlaying) setIsActive(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isPlaying]);

  const trackOptions: DropdownOption[] = tracks.map((track, i) => ({
    id: String(i),
    title: track.title,
    icon: currentTrackIndex === i && isPlaying ? "graphic_eq" : "music_note",
    iconColor: currentTrackIndex === i ? "text-primary" : "text-on-surface-variant/60",
    textColor: currentTrackIndex === i ? "text-primary font-bold" : "text-on-surface",
  }));

  return (
    <div ref={containerRef} className="flex items-center z-100">
      {/* ── Mobile Layout (md:hidden) ────────────────────────────────────── */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsActive(!isActive)}
          disabled={isLoading}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isActive || isPlaying ? "bg-primary/10 text-primary" : "hover:bg-surface-container-high text-on-surface-variant"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className={`material-symbols-outlined ${isLoading ? "animate-pulse" : ""}`}>
            {isLoading ? "hourglass_empty" : isPlaying ? "graphic_eq" : "music_note"}
          </span>
        </button>

        {isActive && !isLoading && (
          <div className="fixed top-16 left-0 right-0 bg-surface-container-lowest/98 backdrop-blur-xl border-b border-outline-variant/10 p-4 z-50 shadow-lg">
            <div className="flex items-center justify-between bg-surface-container-high px-4 py-3 rounded-2xl ring-2 ring-primary/20 relative">
              <div className="flex-1 min-w-0">
                <Dropdown
                  options={trackOptions}
                  value={String(currentTrackIndex)}
                  onChange={(val) => selectTrack(Number(val))}
                  trigger={
                    <div className="flex flex-col min-w-0 cursor-pointer">
                      <span className="text-xs font-bold text-primary tracking-wider uppercase">Now Playing</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-on-surface truncate font-medium">{currentTrack.title}</span>
                        <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
                      </div>
                    </div>
                  }
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-4 z-10">
                <button onClick={togglePlay} disabled={!currentTrack.src} className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-md active:scale-95 transition-transform disabled:opacity-50">
                  <span className="material-symbols-outlined">{isPlaying ? "pause" : "play_arrow"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop Layout (hidden md:flex) ────────────────────────────────── */}
      <div className="hidden md:flex items-center relative z-100">
        {(!isActive && !isPlaying) ? (
          <button
            onClick={() => setIsActive(true)}
            disabled={isLoading}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isLoading ? "Loading Hive Hum..." : "Hive Hum"}
          >
            <span className={`material-symbols-outlined ${isLoading ? "animate-pulse" : ""}`}>
              {isLoading ? "hourglass_empty" : "music_note"}
            </span>
          </button>
        ) : (
          <div className="flex items-center bg-surface-container-high rounded-full pl-3 pr-1 py-1 ring-1 ring-outline-variant/20 shadow-sm relative z-100">
            <Dropdown
              options={trackOptions}
              value={String(currentTrackIndex)}
              onChange={(val) => selectTrack(Number(val))}
              trigger={
                <div className="flex items-center gap-2 mr-3 cursor-pointer group min-w-[120px] max-w-[150px]">
                  <span className={`material-symbols-outlined text-lg ${isPlaying ? "text-primary animate-pulse" : "text-on-surface-variant"}`}>
                    {isPlaying ? "graphic_eq" : "music_note"}
                  </span>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider leading-none mb-0.5">Hive Hum</span>
                    <span className="text-xs text-on-surface font-medium truncate group-hover:text-primary transition-colors leading-none">
                      {currentTrack.title}
                    </span>
                  </div>
                </div>
              }
              menuClassName="w-[280px] right-0 translate-x-[40px] md:translate-x-0"
            />
            
            <button 
              onClick={togglePlay}
              disabled={!currentTrack.src}
              className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full hover:bg-primary/90 shadow-sm transition-colors shrink-0 disabled:opacity-50 z-10"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
