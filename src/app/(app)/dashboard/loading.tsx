export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse px-6 md:px-12 py-8">
      {/* ── Welcome Hero Skeleton ─────────────────────────────── */}
      <div className="mb-12 py-8">
        <div className="h-12 w-80 bg-surface-container-high rounded-2xl mb-4" />
        <div className="h-4 w-48 bg-surface-container-high/40 rounded-lg" />
      </div>

      {/* ── Hive Cards Grid Skeleton ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="clay-card bg-surface-container-lowest rounded-2xl p-6 h-[220px]">
            {/* Icon and Tag */}
            <div className="flex items-start justify-between mb-8">
              <div className="w-11 h-11 rounded-xl bg-surface-container-high" />
              <div className="h-6 w-20 bg-surface-container-high rounded-full" />
            </div>
            {/* Text lines */}
            <div className="h-6 w-3/4 bg-surface-container-high rounded-lg mb-3" />
            <div className="h-4 w-1/2 bg-surface-container-high/60 rounded-lg" />
            
            {/* Footer action spacer */}
            <div className="mt-auto pt-6 flex justify-between items-center">
               <div className="h-4 w-24 bg-surface-container-high/40 rounded" />
               <div className="h-8 w-8 bg-surface-container-high rounded-lg" />
            </div>
          </div>
        ))}

        {/* Add Hive ghost card */}
        <div className="clay-inset rounded-2xl p-6 border-2 border-dashed border-outline-variant/10 flex flex-col items-center justify-center h-[220px] gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high" />
          <div className="h-4 w-32 bg-surface-container-high/60 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
