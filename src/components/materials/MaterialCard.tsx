import React from "react";

export function MaterialCard({ material }: { material: any }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border-none group clay-card">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${material.iconBg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${material.iconColor}`} data-icon={material.icon}>
            {material.icon}
          </span>
        </div>
        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {material.type}
        </span>
      </div>
      <h3 className="text-lg font-headline font-bold text-on-surface mb-2">{material.title}</h3>
      <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-6">
        {material.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-widest">
          {material.size}
        </span>
        <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
          {material.linkTitle}
          <span className="material-symbols-outlined text-sm" data-icon={material.icon === 'play_circle' ? 'play_arrow' : (material.icon === 'analytics' || material.icon === 'description' ? 'open_in_new' : 'arrow_forward')}>
            {material.icon === 'play_circle' ? 'play_arrow' : (material.icon === 'analytics' || material.icon === 'description' ? 'open_in_new' : 'arrow_forward')}
          </span>
        </a>
      </div>
    </div>
  );
}
