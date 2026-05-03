import { Icon } from "@/components/ui/Icon";
import React from "react";

interface ActivityItem {
  bgColor: string;
  iconColor: string;
  icon: string;
  author: string;
  actionStart: string;
  targetDesc?: string;
  targetColor?: string;
  timeAgo: string;
}

export function ActivityFeedItem({ activity }: { activity: ActivityItem }) {
  return (
    <div className="relative flex items-start gap-6">
      <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center z-10`}>
        <Icon name={activity.icon} className={`${activity.iconColor} text-sm`} />
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
