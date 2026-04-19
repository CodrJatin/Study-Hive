import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SmartPasteBar } from "@/components/materials/SmartPasteBar";
import { DropzoneOverlay } from "@/components/materials/DropzoneOverlay";
import { MaterialCard } from "@/components/materials/MaterialCard";

function getMaterialStyling(type: string) {
  switch (type) {
    case "PDF":      return { icon: "picture_as_pdf", iconBg: "bg-error/10",           iconColor: "text-error" };
    case "VIDEO":    return { icon: "play_circle",    iconBg: "bg-primary-container",  iconColor: "text-primary" };
    case "PLAYLIST": return { icon: "playlist_play",  iconBg: "bg-tertiary-container", iconColor: "text-tertiary" };
    case "DOC":      return { icon: "description",    iconBg: "bg-tertiary-container", iconColor: "text-tertiary" };
    case "LINK":     return { icon: "link",           iconBg: "bg-secondary-container", iconColor: "text-secondary" };
    default:         return { icon: "article",        iconBg: "bg-surface-container-high", iconColor: "text-on-surface" };
  }
}

function formatSize(bytes?: number | null): string {
  if (!bytes) return "Link";
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

export default async function MaterialsPage({ params }: { params: Promise<{ hiveId: string }> }) {
  const { hiveId } = await params;

  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    select: { id: true, title: true },
  });
  if (!hive) return notFound();

  const materials = await prisma.material.findMany({
    where: { hiveId },
    orderBy: { createdAt: "desc" },
  });

  // Group by type
  const grouped = materials.reduce((acc, m) => {
    if (!acc[m.type]) acc[m.type] = [];
    acc[m.type].push(m);
    return acc;
  }, {} as Record<string, typeof materials>);

  const typeOrder = ["VIDEO", "PLAYLIST", "PDF", "DOC", "LINK"];
  const sortedGroups = Object.entries(grouped).sort(
    ([a], [b]) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  const typeLabels: Record<string, string> = {
    VIDEO: "Videos",
    PLAYLIST: "Playlists",
    PDF: "PDFs",
    DOC: "Documents",
    LINK: "Links",
  };

  return (
    <>
      {/* Full-page drag area lives outside main scroll */}
      <DropzoneOverlay hiveId={hiveId} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
            Materials
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-headline font-extrabold text-on-background tracking-tight mb-1">
                {hive.title}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {materials.length} resource{materials.length !== 1 ? "s" : ""} · Drag files anywhere to upload
              </p>
            </div>
          </div>

          {/* Smart Paste Bar */}
          <SmartPasteBar hiveId={hiveId} />
        </header>

        {/* Material Grid */}
        {sortedGroups.length === 0 ? (
          <div className="text-center py-24 bg-surface-container-low rounded-3xl clay-inset border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4 block">
              folder_open
            </span>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-1">No Materials Yet</h3>
            <p className="text-on-surface-variant text-sm">
              Paste a link above or drag and drop files anywhere on this page.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedGroups.map(([type, items]) => {
              const styling = getMaterialStyling(type);
              return (
                <section key={type}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-8 h-8 rounded-lg ${styling.iconBg} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined text-base ${styling.iconColor}`}>
                        {styling.icon}
                      </span>
                    </div>
                    <h2 className="text-lg font-headline font-bold text-on-surface">
                      {typeLabels[type] ?? type}
                    </h2>
                    <div className="h-px flex-1 bg-outline-variant/20" />
                    <span className="text-xs font-bold text-on-surface-variant/50">
                      {items.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((m) => (
                      <MaterialCard
                        key={m.id}
                        material={{
                          id: m.id,
                          title: m.title,
                          type: m.type,
                          url: m.url,
                          sizeBytes: m.sizeBytes,
                          channelName: m.channelName,
                          duration: m.duration,
                          videoRange: m.videoRange,
                          playlistData: m.playlistData,
                          hiveId,
                        }}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
