import React from "react";
import { MaterialCard } from "./MaterialCard";

type MaterialType = {
  id: string;
  title: string;
  type: string;
  url: string | null;
  sizeBytes: number | null;
  channelName: string | null;
  duration: number | null;
  videoRange: string | null;
  playlistData: unknown | null;
  userId: string;
};

const TYPE_ORDER = ["VIDEO", "PLAYLIST", "PDF", "DOC", "LINK"];
const TYPE_LABELS: Record<string, string> = {
  VIDEO: "Videos", PLAYLIST: "Playlists", PDF: "PDFs", DOC: "Documents", LINK: "Links",
};

function getMaterialStyling(type: string) {
  switch (type) {
    case "PDF":      return { icon: "picture_as_pdf", iconBg: "bg-error/10",            iconColor: "text-error" };
    case "VIDEO":    return { icon: "play_circle",    iconBg: "bg-primary-container",   iconColor: "text-primary" };
    case "PLAYLIST": return { icon: "playlist_play",  iconBg: "bg-tertiary-container",  iconColor: "text-tertiary" };
    case "DOC":      return { icon: "description",    iconBg: "bg-tertiary-container",  iconColor: "text-tertiary" };
    case "LINK":     return { icon: "link",           iconBg: "bg-secondary-container", iconColor: "text-secondary" };
    default:         return { icon: "article",        iconBg: "bg-surface-container-high", iconColor: "text-on-surface" };
  }
}

/**
 * Pure display component — no realtime subscription embedded here.
 * Callers are responsible for rendering a <RealtimeListener> alongside this
 * component at the page level so the listener is not duplicated across
 * conditional branches.
 */
export function MaterialClientGrid({
  hiveId,
  initialMaterials,
}: {
  hiveId?: string | null;
  initialMaterials: MaterialType[];
}) {
  const grouped = initialMaterials.reduce((acc, m) => {
    if (!acc[m.type]) acc[m.type] = [];
    acc[m.type].push(m);
    return acc;
  }, {} as Record<string, typeof initialMaterials>);

  const sortedGroups = Object.entries(grouped).sort(
    ([a], [b]) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b)
  );

  if (sortedGroups.length === 0) {
    return (
      <div className="text-center py-24 bg-surface-container-low rounded-3xl clay-inset border border-dashed border-outline-variant/30">
        <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4 block">folder_open</span>
        <h3 className="text-xl font-headline font-bold text-on-surface mb-1">No Materials Yet</h3>
        <p className="text-on-surface-variant text-sm">Paste a link above or drag and drop files anywhere on this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sortedGroups.map(([type, items]) => {
        const styling = getMaterialStyling(type);
        return (
          <section key={type}>
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-8 h-8 rounded-lg ${styling.iconBg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined text-base ${styling.iconColor}`}>{styling.icon}</span>
              </div>
              <h2 className="text-lg font-headline font-bold text-on-surface">{TYPE_LABELS[type] ?? type}</h2>
              <div className="h-px flex-1 bg-outline-variant/20" />
              <span className="text-xs font-bold text-on-surface-variant/50">{items.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={{ ...m, hiveId: hiveId || null }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
