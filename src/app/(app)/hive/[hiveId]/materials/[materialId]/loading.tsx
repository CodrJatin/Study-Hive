export default function StudyPlayerLoading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      {/* ── Back navigation ───────────────────────────────────── */}
      <div className="mb-6">
        <div className="h-5 w-36 bg-surface-container-high rounded-lg" />
      </div>

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div className="h-9 w-96 max-w-full bg-surface-container-high rounded-xl" />
          <div className="flex gap-2">
            <div className="h-8 w-32 bg-surface-container-high rounded-full" />
            <div className="h-8 w-36 bg-primary/10 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-32 bg-surface-container-high/60 rounded" />
          <div className="h-4 w-24 bg-surface-container-high/50 rounded" />
        </div>
        <div className="h-3.5 w-64 bg-surface-container-high/40 rounded mt-2" />
      </div>

      {/* ── Split-screen grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: 16:9 video block */}
        <div className="lg:col-span-8">
          <div className="clay-card bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
            {/* 16:9 aspect box */}
            <div className="relative w-full bg-surface-container-high" style={{ paddingBottom: "56.25%" }}>
              {/* Play icon ghost */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-lowest/40" />
              </div>
            </div>

            {/* Info bar */}
            <div className="px-5 py-4 border-t border-outline-variant/10 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="h-5 w-3/4 bg-surface-container-high rounded-lg mb-2" />
                <div className="h-3.5 w-20 bg-surface-container-high/60 rounded" />
              </div>
              <div className="h-8 w-28 bg-surface-container-high rounded-xl shrink-0" />
            </div>

            {/* Prev / Next buttons */}
            <div className="px-5 pb-5 flex gap-3">
              <div className="flex-1 h-11 bg-surface-container-high rounded-xl" />
              <div className="flex-1 h-11 bg-primary/20 rounded-xl" />
            </div>
          </div>
        </div>

        {/* RIGHT: Playlist sidebar */}
        <div className="lg:col-span-4">
          <div className="clay-card bg-surface-container-lowest rounded-2xl border border-outline-variant/10 flex flex-col lg:max-h-[680px]">
            {/* Sidebar header */}
            <div className="px-5 pt-5 pb-3 shrink-0 border-b border-outline-variant/10">
              <div className="flex items-center justify-between mb-2">
                <div className="h-3.5 w-32 bg-surface-container-high rounded" />
                <div className="h-3.5 w-16 bg-surface-container-high/60 rounded" />
              </div>
              <div className="h-1.5 w-full bg-surface-container-high rounded-full" />
            </div>

            {/* Playlist item rows */}
            <div className="p-3 space-y-1 overflow-hidden">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl">
                  {/* Checkbox circle */}
                  <div className="w-5 h-5 rounded-full bg-surface-container-high shrink-0 mt-0.5" />
                  {/* Thumbnail */}
                  <div className="w-20 shrink-0 aspect-video rounded-lg bg-surface-container-high" />
                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div
                      className="h-3.5 bg-surface-container-high rounded mb-1.5"
                      style={{ width: `${60 + (i % 4) * 12}%` }}
                    />
                    <div className="h-3.5 bg-surface-container-high/60 rounded w-3/4 mb-1" />
                    <div className="h-3 w-12 bg-surface-container-high/40 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
