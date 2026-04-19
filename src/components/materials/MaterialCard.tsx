"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EditMaterialModal } from "./EditMaterialModal";

interface Material {
  id: string;
  title: string;
  type: string;
  url: string | null;
  sizeBytes: number | null;
  channelName?: string | null;
  duration?: number | null;
  videoRange?: string | null;
  playlistData?: unknown;
  hiveId: string;
}

interface MaterialCardProps {
  material: Material;
}

function getMaterialStyling(type: string) {
  switch (type) {
    case "PDF":      return { icon: "picture_as_pdf", iconBg: "bg-error/10",           iconColor: "text-error" };
    case "VIDEO":    return { icon: "play_circle",    iconBg: "bg-primary-container",  iconColor: "text-primary" };
    case "PLAYLIST": return { icon: "playlist_play",  iconBg: "bg-tertiary-container", iconColor: "text-tertiary" };
    case "DOC":   return { icon: "description",    iconBg: "bg-tertiary-container",  iconColor: "text-tertiary" };
    case "LINK":  return { icon: "link",           iconBg: "bg-secondary-container", iconColor: "text-secondary" };
    default:      return { icon: "article",        iconBg: "bg-surface-container-high", iconColor: "text-on-surface" };
  }
}

function formatDuration(seconds: number | null | undefined): string | null {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatSize(bytes?: number | null): string | null {
  if (!bytes) return null;
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

const isPlaylist = (m: Material) => m.type === "PLAYLIST";

export function MaterialCard({ material }: MaterialCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const s = getMaterialStyling(material.type);
  const duration = formatDuration(material.duration);
  const size = formatSize(material.sizeBytes);
  const playlist = isPlaylist(material);

  return (
    <>
      <div className="group/card relative bg-surface-container-lowest rounded-2xl p-5 clay-card border border-outline-variant/5 hover:border-primary/15 transition-all flex flex-col gap-4">
        {/* Top row: icon + type tag + edit button */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
            <span className={`material-symbols-outlined ${s.iconColor}`}>
              {s.icon}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* PLAYLIST vs VIDEO tag */}
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                playlist
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {playlist ? "Playlist" : material.type}
            </span>
          </div>
        </div>

        {/* Title + metadata */}
        <div className="flex-1">
          <h3 className="font-headline font-bold text-on-surface text-base leading-tight mb-1.5 line-clamp-2">
            {material.title}
          </h3>

          {/* Channel name for YouTube */}
          {material.channelName && (
            <p className="text-xs font-semibold text-on-surface-variant/70 mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">account_circle</span>
              {material.channelName}
            </p>
          )}

          {/* Duration / filesize row */}
          <div className="flex items-center flex-wrap gap-3 mt-2">
            {duration && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                {duration}
              </span>
            )}
            {material.videoRange && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[13px]">filter_list</span>
                Videos: {material.videoRange}
              </span>
            )}
            {size && (
              <span className="text-xs font-semibold text-on-surface-variant/50">
                {size}
              </span>
            )}
          </div>
        </div>

        {/* Open link + Edit button */}
        <div className="flex items-center justify-between mt-auto">
          {(material.type === "VIDEO" || material.type === "PLAYLIST") ? (
            <Link
              href={`/hive/${material.hiveId}/materials/${material.id}`}
              className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit"
            >
              {playlist ? "View Playlist" : "Watch"}
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            </Link>
          ) : material.url ? (
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit"
            >
              Open
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          ) : null}

          {/* Edit button — visible on hover */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant opacity-0 group-hover/card:opacity-100 hover:bg-surface-container-high hover:text-primary transition-all ml-auto"
            title="Edit material"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
      </div>

      {isEditOpen && (
        <EditMaterialModal
          material={material}
          isPlaylist={playlist}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
