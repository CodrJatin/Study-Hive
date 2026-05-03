import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getHiveMaterialsCached } from "@/lib/data-access/materials";
import { SmartPasteBar } from "@/components/materials/SmartPasteBar";
import { DropzoneOverlay } from "@/components/materials/DropzoneOverlay";
import { MaterialClientGrid } from "@/components/materials/MaterialClientGrid";
import { UploadButton } from "@/components/materials/UploadButton";
import { RealtimeListener } from "@/components/shared/RealtimeListener";

// ─────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────

function MaterialCardSkeleton() {
  return (
    <div className="clay-card bg-surface-container-lowest rounded-2xl p-5 animate-pulse space-y-3 border border-outline-variant/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 bg-surface-container-high rounded-lg w-3/4" />
          <div className="h-3 bg-surface-container-high rounded w-1/2" />
        </div>
      </div>
      <div className="h-8 bg-surface-container-high rounded-xl w-full" />
    </div>
  );
}

function MaterialGridSkeleton() {
  return (
    <div className="space-y-10">
      {[0, 1].map((g) => (
        <section key={g}>
          <div className="flex items-center gap-4 mb-5 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high" />
            <div className="h-5 w-24 bg-surface-container-high rounded-lg flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => <MaterialCardSkeleton key={i} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Async Widgets
// ─────────────────────────────────────────

// Receives hive title + count already fetched by the shell — zero additional queries.
function MaterialsHeader({
  hiveTitle,
  count,
  hiveId,
}: {
  hiveTitle: string;
  count: number;
  hiveId: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-4xl font-headline font-extrabold text-on-background tracking-tight mb-1">
          {hiveTitle}
        </h1>
        <p className="text-on-surface-variant text-sm">
          {count} resource{count !== 1 ? "s" : ""} · Drag files anywhere to upload
        </p>
      </div>
      <UploadButton hiveId={hiveId} />
    </div>
  );
}

async function MaterialGrid({ hiveId }: { hiveId: string }) {
  const materials = await getHiveMaterialsCached(hiveId);

  return <MaterialClientGrid hiveId={hiveId} initialMaterials={materials} />;
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;

  // One query covers both the existence check and the header data.
  // MaterialGrid runs concurrently via Suspense streaming.
  const [hive, count] = await Promise.all([
    prisma.hive.findUnique({ where: { id: hiveId }, select: { title: true } }),
    prisma.material.count({ where: { hiveId } }),
  ]);

  if (!hive) return notFound();

  return (
    <>
      <DropzoneOverlay hiveId={hiveId} />
      {/* Scoped to this hive — no cross-hive refreshes */}
      <RealtimeListener tableName="Material" filterColumn="hiveId" filterValue={hiveId} />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
            Materials
          </span>
          {/* Synchronous — data already in scope, no extra fetch */}
          <MaterialsHeader hiveTitle={hive.title} count={count} hiveId={hiveId} />
          <SmartPasteBar hiveId={hiveId} />
        </header>

        <Suspense fallback={<MaterialGridSkeleton />}>
          <MaterialGrid hiveId={hiveId} />
        </Suspense>
      </div>
    </>
  );
}
