function FieldSkeleton({ label = true, wide = false }: { label?: boolean; wide?: boolean }) {
  return (
    <div className="space-y-1.5">
      {label && <div className="h-3 w-24 bg-surface-container-high rounded" />}
      <div className={`h-10 ${wide ? "w-full" : "w-full"} bg-surface-container-high rounded-xl`} />
    </div>
  );
}

export default function SettingsLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* ── Page heading ──────────────────────────────────────── */}
      <div className="mb-8">
        <div className="h-8 w-44 bg-surface-container-high rounded-xl mb-2" />
        <div className="h-4 w-64 bg-surface-container-high/60 rounded-lg" />
      </div>

      {/* ── General Section ───────────────────────────────────── */}
      <div className="clay-card bg-surface-container-lowest rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
          <div>
            <div className="h-5 w-32 bg-surface-container-high rounded-lg mb-1" />
            <div className="h-3.5 w-48 bg-surface-container-high/50 rounded" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <FieldSkeleton />
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-surface-container-high rounded" />
            <div className="h-24 w-full bg-surface-container-high rounded-xl" />
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-32 bg-primary/20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* ── Members Section ───────────────────────────────────── */}
      <div className="clay-card bg-surface-container-lowest rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
            <div>
              <div className="h-5 w-28 bg-surface-container-high rounded-lg mb-1" />
              <div className="h-3.5 w-40 bg-surface-container-high/50 rounded" />
            </div>
          </div>
          <div className="h-9 w-32 bg-primary/20 rounded-xl" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-32 bg-surface-container-high rounded-lg mb-1.5" />
                <div className="h-3.5 w-44 bg-surface-container-high/60 rounded" />
              </div>
              <div className="h-6 w-16 bg-surface-container-high rounded-full" />
              <div className="w-8 h-8 rounded-lg bg-surface-container-high" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Invite Links Section ──────────────────────────────── */}
      <div className="clay-card bg-surface-container-lowest rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
            <div>
              <div className="h-5 w-36 bg-surface-container-high rounded-lg mb-1" />
              <div className="h-3.5 w-52 bg-surface-container-high/50 rounded" />
            </div>
          </div>
          <div className="h-9 w-36 bg-primary/20 rounded-xl" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-64 bg-surface-container-high/80 rounded font-mono mb-1" />
                <div className="h-3 w-28 bg-surface-container-high/50 rounded" />
              </div>
              <div className="w-9 h-9 rounded-xl bg-surface-container-high" />
              <div className="w-9 h-9 rounded-xl bg-surface-container-high" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Danger Zone ───────────────────────────────────────── */}
      <div className="rounded-3xl border border-error/20 bg-error/5 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-error/10" />
          <div>
            <div className="h-5 w-28 bg-error/20 rounded-lg mb-1" />
            <div className="h-3.5 w-56 bg-error/10 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-error/8">
          <div>
            <div className="h-4 w-24 bg-error/20 rounded-lg mb-1.5" />
            <div className="h-3.5 w-72 bg-error/10 rounded" />
          </div>
          <div className="h-10 w-32 bg-error/20 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
