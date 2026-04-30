"use client";

import React, { useState, useRef, useEffect } from "react";

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

export function HiveHum() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : FALLBACK_TRACK;

  // Global audio element (created only once to persist playback)
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.loop = true;
    }
  }, []);

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
    setShowDropdown(false);
    setIsPlaying(true);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        if (!isPlaying) setIsActive(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="flex items-center">
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
            <div className="flex items-center justify-between bg-surface-container-high px-4 py-3 rounded-2xl ring-2 ring-primary/20">
              <div 
                className="flex flex-col min-w-0 flex-1 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Now Playing</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-on-surface truncate font-medium">{currentTrack.title}</span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <button onClick={togglePlay} disabled={!currentTrack.src} className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-md active:scale-95 transition-transform disabled:opacity-50">
                  <span className="material-symbols-outlined">{isPlaying ? "pause" : "play_arrow"}</span>
                </button>
              </div>
            </div>

            {/* Mobile Playlist Dropdown */}
            {showDropdown && (
              <div className="mt-2 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden max-h-[60vh] overflow-y-auto">
                <ul className="divide-y divide-outline-variant/5">
                  {tracks.length > 0 ? tracks.map((track, i) => (
                    <li key={track.id}>
                      <button
                        onClick={() => selectTrack(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors text-left ${currentTrackIndex === i ? "bg-primary/5" : ""}`}
                      >
                        <span className={`material-symbols-outlined text-[18px] ${currentTrackIndex === i ? "text-primary" : "text-on-surface-variant"}`}>
                          {currentTrackIndex === i && isPlaying ? "graphic_eq" : "music_note"}
                        </span>
                        <span className={`text-sm ${currentTrackIndex === i ? "font-bold text-primary" : "text-on-surface"}`}>
                          {track.title}
                        </span>
                      </button>
                    </li>
                  )) : (
                    <li className="px-4 py-3 text-sm text-on-surface-variant text-center">No tracks available</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Desktop Layout (hidden md:flex) ────────────────────────────────── */}
      <div className="hidden md:flex items-center relative">
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
          <div className="flex items-center bg-surface-container-high rounded-full pl-3 pr-1 py-1 ring-1 ring-outline-variant/20 shadow-sm">
            <div 
              className="flex items-center gap-2 mr-3 cursor-pointer group min-w-[120px] max-w-[150px]"
              onClick={() => setShowDropdown(!showDropdown)}
            >
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
            
            <button 
              onClick={togglePlay}
              disabled={!currentTrack.src}
              className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full hover:bg-primary/90 shadow-sm transition-colors shrink-0 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
          </div>
        )}

        {/* Desktop Dropdown */}
        {showDropdown && (isActive || isPlaying) && !isLoading && (
          <div className="clay-card absolute top-full right-0 mt-3 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden z-50">
            <ul className="divide-y divide-outline-variant/5">
              {tracks.length > 0 ? tracks.map((track, i) => (
                <li key={track.id}>
                  <button
                    onClick={() => selectTrack(i)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors text-left ${currentTrackIndex === i ? "bg-primary/5" : ""}`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${currentTrackIndex === i ? "text-primary" : "text-on-surface-variant/60"}`}>
                      {currentTrackIndex === i && isPlaying ? "graphic_eq" : "music_note"}
                    </span>
                    <span className={`text-sm ${currentTrackIndex === i ? "font-bold text-primary" : "text-on-surface"}`}>
                      {track.title}
                    </span>
                  </button>
                </li>
              )) : (
                <li className="px-4 py-3 text-sm text-on-surface-variant text-center">No tracks available</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
