import React from "react";

export function DeadlineItem({ deadline }: { deadline: any }) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/5 group hover:border-primary/20 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-1.5 h-8 ${deadline.indicatorColor} rounded-full shrink-0`}></div>
        <div className="min-w-0">
          <h5 className="text-sm font-bold text-on-surface truncate pr-2">{deadline.title}</h5>
          <p className={`text-[10px] text-${deadline.dueColor} font-bold mt-0.5`}>{deadline.dueDate}</p>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <span className="text-[10px] font-extrabold text-on-surface/60 bg-surface-container-highest px-2 py-1 rounded">
          {deadline.dateBadge}
        </span>
        <span className="material-symbols-outlined text-lg text-on-surface/20 group-hover:text-primary transition-colors" data-icon="chevron_right">
          chevron_right
        </span>
      </div>
    </div>
  );
}
