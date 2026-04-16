"use client";

import React, { useState } from "react";

export function TopicRow({ subtopic }: { subtopic: any }) {
  const [completed, setCompleted] = useState(subtopic.completed);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low/50 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setCompleted(!completed)}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
            completed 
              ? "border-primary-container bg-surface-container-lowest text-primary hover:bg-primary-fixed-dim/20" 
              : "border-outline-variant bg-surface-container-lowest text-primary hover:bg-primary-fixed-dim/20"
          }`}
        >
          {completed && (
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          )}
        </div>
        <span className={`text-sm font-medium ${completed ? "text-on-surface-variant line-through opacity-70" : "text-on-surface-variant"}`}>
          {subtopic.title}
        </span>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">{subtopic.type}</span>
    </div>
  );
}
