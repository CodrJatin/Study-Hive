export default function HiveLoading() {
  return (
    <div className="animate-pulse">
      {/* ── Hive banner / header ──────────────────────────────── */}
      <div className="clay-card bg-surface-container-lowest rounded-3xl p-8 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-8 w-64 bg-surface-container-high rounded-xl mb-2" />
            <div className="h-4 w-40 bg-surface-container-high/60 rounded-lg mb-4" />
            <div className="flex gap-3">
              <div className="h-6 w-20 bg-surface-container-high rounded-full" />
              <div className="h-6 w-24 bg-surface-container-high/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav tabs bar ──────────────────────────────────────── */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {["w-24", "w-20", "w-28", "w-20", "w-24", "w-20"].map((w, i) => (
          <div key={i} className={`h-10 ${w} bg-surface-container-high rounded-xl shrink-0`} />
        ))}
      </div>

      {/* ── Main content area placeholder: Grid ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Sidebar: Deadlines (Mobile: First) */}
        <div className="lg:order-2 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-32 bg-surface-container-high rounded-xl" />
            <div className="h-8 w-24 bg-surface-container-high rounded-xl" />
          </div>
          <div className="clay-card bg-surface-container-low/30 rounded-[2.5rem] p-6 h-[400px]" />
        </div>

        {/* Column: Announcements (Mobile: Second) */}
        <div className="lg:col-span-2 lg:order-1 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-surface-container-high rounded-xl" />
            <div className="h-8 w-32 bg-surface-container-high rounded-xl" />
          </div>
          <div className="clay-card bg-surface-container-lowest rounded-2xl p-6">
            <div className="h-5 w-40 bg-surface-container-high rounded-lg mb-5" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 mb-4">
                <div className="w-5 h-5 rounded bg-surface-container-high shrink-0" />
                <div className="flex-1 h-4 bg-surface-container-high/70 rounded" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
