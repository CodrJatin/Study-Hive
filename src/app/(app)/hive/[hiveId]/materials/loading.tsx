export default function MaterialsLoading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-44 bg-surface-container-high rounded-xl mb-2" />
          <div className="h-4 w-60 bg-surface-container-high/60 rounded-lg" />
        </div>
      </div>

      {/* ── Smart Paste Bar ───────────────────────────────────── */}
      <div className="clay-inset rounded-2xl p-4 mb-8 flex gap-3 items-center">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high shrink-0" />
        <div className="flex-1 h-10 bg-surface-container-high rounded-xl" />
        <div className="w-10 h-10 bg-primary/20 rounded-xl shrink-0" />
      </div>

      {/* ── Dropzone ghost ────────────────────────────────────── */}
      <div className="clay-inset rounded-2xl border-2 border-dashed border-outline-variant/20 p-8 mb-10 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-surface-container-high" />
        <div className="h-4 w-48 bg-surface-container-high/60 rounded-lg" />
        <div className="h-3 w-32 bg-surface-container-high/40 rounded" />
      </div>

      {/* ── Section label ─────────────────────────────────────── */}
      <div className="h-4 w-24 bg-surface-container-high/50 rounded mb-4" />

      {/* ── Material card grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="clay-card bg-surface-container-lowest rounded-2xl p-5 flex flex-col gap-4">
            {/* Top row: icon + tag */}
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-surface-container-high" />
              <div className="h-5 w-16 bg-surface-container-high rounded-full" />
            </div>
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-surface-container-high rounded-lg" />
              <div className="h-5 w-3/4 bg-surface-container-high/70 rounded-lg" />
            </div>
            {/* Meta row */}
            <div className="flex gap-2 mt-1">
              <div className="h-6 w-20 bg-primary/10 rounded-full" />
              <div className="h-6 w-24 bg-surface-container-high/50 rounded-full" />
            </div>
            {/* Bottom row */}
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="h-4 w-16 bg-surface-container-high/60 rounded" />
              <div className="w-8 h-8 rounded-lg bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
