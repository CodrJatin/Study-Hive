import React from "react";

export function DeadlineItem({ deadline }: { deadline: any }) {
  return (
    <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group">
      {/* Date Square */}
      <div className="w-11 h-11 bg-surface-container-high rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:bg-primary-container/20 overflow-hidden">
        <span className="text-[9px] uppercase font-bold text-primary">
          {deadline.dateBadge.split(' ')[0]}
        </span>
        <span className="text-base font-bold leading-none text-on-surface">
          {deadline.dateBadge.split(' ')[1]}
        </span>
      </div>
      
      {/* Content */}
      <div className="grow min-w-0">
        <h5 className="text-[15px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
          {deadline.title}
        </h5>
        <div className="flex items-center gap-2 mt-1">
          <p className={`${deadline.indicatorColor.replace('bg-', 'text-')} text-[12px] font-bold shrink-0`}>
            {deadline.dueDate}
          </p>
          {deadline.hiveTitle && (
            <>
              <span className="text-outline-variant/30 text-[10px] shrink-0">•</span>
              <p className="text-on-surface-variant/40 text-[11px] font-bold truncate max-w-[100px]">
                {deadline.hiveTitle}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
