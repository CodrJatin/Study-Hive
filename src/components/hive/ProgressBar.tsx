import { Icon } from "@/components/ui/Icon";
import React from "react";

export function ProgressBar({ progress, label, labelSecondary }: { progress: number, label: string, labelSecondary?: string }) {
  return (
    <div className="mt-auto">
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-center">
          <div>
            <h3 className="text-xs font-headline font-bold text-on-background uppercase tracking-widest">
              {label}
            </h3>
            {labelSecondary && (
              <p className="text-[10px] text-on-surface/40 font-medium uppercase tracking-tight">
                {labelSecondary}
              </p>
            )}
          </div>
        </div>
        <span className="text-4xl font-headline font-extrabold text-primary">{progress}%</span>
      </div>
      <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(120,89,0,0.3)]" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
