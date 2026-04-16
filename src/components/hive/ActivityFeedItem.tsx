import React from "react";

export function ActivityFeedItem({ activity }: { activity: any }) {
  return (
    <div className="relative flex items-start gap-6">
      <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center z-10`}>
        <span className={`material-symbols-outlined ${activity.iconColor} text-sm`} data-icon={activity.icon}>
          {activity.icon}
        </span>
      </div>
      <div>
        <p className="text-sm leading-relaxed">
          <span className="font-bold text-on-surface">{activity.author}</span> {activity.actionStart}{" "}
          {activity.targetDesc && <span className={activity.targetColor}>{activity.targetDesc}</span>}
        </p>
        <p className="text-xs text-on-surface/40 mt-1">{activity.timeAgo}</p>
      </div>
    </div>
  );
}
