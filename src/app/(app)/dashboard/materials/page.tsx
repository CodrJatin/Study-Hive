import React, { Suspense } from "react";
import { requireUser } from "@/lib/session";
import { getPersonalMaterialsCached } from "@/lib/data-access/materials";
import { SmartPasteBar } from "@/components/materials/SmartPasteBar";
import { MaterialClientGrid } from "@/components/materials/MaterialClientGrid";
import { DropzoneOverlay } from "@/components/materials/DropzoneOverlay";
import { UploadButton } from "@/components/materials/UploadButton";
import { RealtimeListener } from "@/components/shared/RealtimeListener";

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

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
// Async Widget
// ─────────────────────────────────────────

async function PersonalMaterialsWidget({ userId }: { userId: string }) {
  const materials = await getPersonalMaterialsCached(userId);

  if (materials.length === 0) {
    return (
      <div className="text-center py-24 bg-surface-container-low rounded-3xl clay-inset border border-dashed border-outline-variant/30">
        <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4 block">inbox</span>
        <h3 className="text-xl font-headline font-bold text-on-surface mb-1">Your Inbox is Empty</h3>
        <p className="text-on-surface-variant text-sm">Paste a YouTube link, PDF, or any URL above to save it here.</p>
        <p className="text-xs text-on-surface-variant/50 mt-2">
          Materials saved here aren&apos;t attached to any Hive.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Scoped to this user’s personal materials — no cross-user refreshes */}
      <RealtimeListener tableName="Material" filterColumn="userId" filterValue={userId} />
      <MaterialClientGrid initialMaterials={materials} />
    </>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function PersonalMaterialsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Personal Inbox</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-headline font-extrabold text-on-background tracking-tight mb-1">
              My Materials
            </h1>
            <p className="text-on-surface-variant text-sm">
              Resources you&apos;ve saved that aren&apos;t attached to any Hive.
            </p>
          </div>
          <UploadButton />
        </div>
        <SmartPasteBar />
      </header>

      <Suspense fallback={<MaterialGridSkeleton />}>
        <PersonalMaterialsWidget userId={user.id} />
      </Suspense>

      <DropzoneOverlay />
    </div>
  );
}
