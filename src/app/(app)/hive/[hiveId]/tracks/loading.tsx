export default function TracksLoading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-40 bg-surface-container-high rounded-xl mb-2" />
          <div className="h-4 w-64 bg-surface-container-high/60 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-primary/20 rounded-xl" />
      </div>

      {/* ── Hero / Create-track card ───────────────────────────── */}
      <div className="clay-card bg-surface-container-lowest rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high shrink-0" />
        <div className="flex-1 w-full">
          <div className="h-6 w-56 bg-surface-container-high rounded-xl mb-2" />
          <div className="h-4 w-80 bg-surface-container-high/60 rounded-lg" />
        </div>
        <div className="h-11 w-36 bg-primary/20 rounded-xl shrink-0" />
      </div>

      {/* ── Section label ─────────────────────────────────────── */}
      <div className="h-4 w-28 bg-surface-container-high/50 rounded mb-5" />

      {/* ── Track card grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="clay-card bg-surface-container-low rounded-xl p-6 relative overflow-hidden"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high/20 rounded-bl-full" />

            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high" />
              <div className="h-5 w-20 bg-surface-container-high rounded-full" />
            </div>

            <div className="h-6 w-3/4 bg-surface-container-high rounded-lg mb-1" />
            <div className="flex items-center gap-1 mb-6">
              <div className="w-4 h-4 rounded bg-surface-container-high/60" />
              <div className="h-3.5 w-28 bg-surface-container-high/50 rounded" />
            </div>

            {/* Progress */}
            <div className="flex justify-between mb-1">
              <div className="h-3.5 w-14 bg-surface-container-high/60 rounded" />
              <div className="h-3.5 w-8 bg-surface-container-high/50 rounded" />
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full" />

            {/* Footer meta */}
            <div className="mt-6 flex gap-4">
              <div className="h-4 w-24 bg-surface-container-high/50 rounded" />
              <div className="h-4 w-20 bg-surface-container-high/50 rounded" />
            </div>
          </div>
        ))}

        {/* Add-track ghost */}
        <div className="clay-inset rounded-xl border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center min-h-[220px] gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-surface-container-high" />
          <div className="h-4 w-28 bg-surface-container-high/60 rounded" />
          <div className="h-3 w-20 bg-surface-container-high/40 rounded" />
        </div>
      </div>
    </div>
  );
}
