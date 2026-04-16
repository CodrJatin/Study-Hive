"use client";

import React, { useState } from "react";
import { TopicRow } from "./TopicRow";
import { Topic, Unit } from "@prisma/client";

export function UnitAccordion({ unit, index }: { unit: Unit & { topics: Topic[] }, index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className={`group ${!unit.topics.length ? "opacity-50 grayscale" : ""}`}>
      <div 
        onClick={() => {
          if (unit.topics.length > 0) setIsExpanded(!isExpanded);
        }}
        className={`flex items-center gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer ${
          isExpanded ? "clay-card" : "border-l-4 border-transparent hover:border-primary clay-inset"
        }`}
      >
        <span className={`material-symbols-outlined text-on-surface-variant text-2xl transition-transform ${isExpanded ? 'rotate-0 text-primary' : (!unit.topics.length ? '' : 'group-hover:rotate-90')}`}>
          {!unit.topics.length ? "lock" : "expand_more"}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`${isExpanded ? "bg-primary-fixed-dim text-on-primary-fixed" : "bg-outline-variant/40 text-on-surface-variant"} text-[10px] font-black px-2 py-0.5 rounded uppercase`}>
              Unit {index + 1}
            </span>
            <h3 className="text-lg font-bold text-on-background">{unit.title}</h3>
          </div>
        </div>
        <div className="text-on-surface-variant/40 hidden md:flex items-center gap-1">
          <span className="material-symbols-outlined">description</span>
          <span className="text-xs font-bold">{unit.topics.length} Topics</span>
        </div>
      </div>

      {isExpanded && unit.topics && unit.topics.length > 0 && (
        <div className="ml-4 md:ml-12 mt-4 space-y-2 border-l-2 border-surface-container-high pl-4 md:pl-6">
          {unit.topics.map((topic: any, tIndex: number) => (
            <TopicRow key={topic.id} topic={topic} index={tIndex} unitIndex={index} />
          ))}
        </div>
      )}
    </div>
  );
}
