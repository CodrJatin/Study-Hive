export default function SyllabusLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-surface-container-high rounded-xl mb-2" />
          <div className="h-4 w-64 bg-surface-container-high/60 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-surface-container-high rounded-xl" />
      </div>

      {/* ── Add Unit bar ──────────────────────────────────────── */}
      <div className="clay-inset rounded-2xl p-4 mb-8 flex gap-3">
        <div className="flex-1 h-10 bg-surface-container-high rounded-xl" />
        <div className="w-10 h-10 bg-surface-container-high rounded-xl" />
      </div>

      {/* ── Accordion blocks ──────────────────────────────────── */}
      <div className="space-y-4">
        {[5, 3, 4, 2].map((topicCount, unitIdx) => (
          <div key={unitIdx} className="clay-card bg-surface-container-lowest rounded-2xl overflow-hidden">
            {/* Unit header */}
            <div className="flex items-center gap-4 p-5">
              <div className="w-6 h-6 rounded bg-surface-container-high shrink-0" />
              <div className="flex items-center gap-3 flex-1">
                <div className="h-5 w-14 bg-surface-container-high rounded" />
                <div className="h-5 w-48 bg-surface-container-high/80 rounded-lg" />
              </div>
              <div className="h-4 w-16 bg-surface-container-high/50 rounded hidden md:block" />
            </div>

            {/* Topic rows — only expand first accordion */}
            {unitIdx === 0 && (
              <div className="ml-4 md:ml-12 mr-4 mb-4 space-y-2 border-l-2 border-surface-container-high pl-4 md:pl-6">
                {Array.from({ length: topicCount }).map((_, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded border-2 border-surface-container-high bg-surface-container-high shrink-0" />
                      <div>
                        <div
                          className="h-4 bg-surface-container-high rounded-lg mb-1"
                          style={{ width: `${120 + tIdx * 20}px` }}
                        />
                        <div className="h-2.5 w-16 bg-surface-container-high/50 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-surface-container-high/40 rounded" />
                  </div>
                ))}
                {/* Add topic input ghost */}
                <div className="h-10 w-full bg-surface-container-low/60 rounded-xl border border-dashed border-outline-variant/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
