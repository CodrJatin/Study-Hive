"use client";

import React, { useState } from "react";
import { TopicRow } from "./TopicRow";

export function UnitAccordion({ unit, index }: { unit: any, index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className={`group ${unit.topicsCount === 0 || !unit.topics.length ? "opacity-50 grayscale" : ""}`}>
      <div 
        onClick={() => {
          if (unit.topicsCount > 0 && unit.topics.length > 0) setIsExpanded(!isExpanded);
        }}
        className={`flex items-center gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer ${
          isExpanded ? "clay-card" : "border-l-4 border-transparent hover:border-primary clay-inset"
        }`}
      >
        <span className={`material-symbols-outlined text-on-surface-variant text-2xl transition-transform ${isExpanded ? 'rotate-0 text-primary' : (unit.topicsCount === 0 || !unit.topics.length ? '' : 'group-hover:rotate-90')}`}>
          {unit.topicsCount === 0 || !unit.topics.length ? "lock" : "expand_more"}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`${isExpanded ? "bg-primary-fixed-dim text-on-primary-fixed" : "bg-outline-variant/40 text-on-surface-variant"} text-[10px] font-black px-2 py-0.5 rounded uppercase`}>
              Unit {index + 1}
            </span>
            <h3 className="text-lg font-bold text-on-background">{unit.title}</h3>
          </div>
          {unit.description && (
            <p className="text-sm text-on-surface-variant mt-1">
              {unit.description}
            </p>
          )}
        </div>
        <div className="text-on-surface-variant/40 hidden md:flex items-center gap-1">
          <span className="material-symbols-outlined">description</span>
          <span className="text-xs font-bold">{unit.topicsCount} Topics</span>
        </div>
      </div>

      {isExpanded && unit.topics && unit.topics.length > 0 && (
        <div className="ml-4 md:ml-12 mt-4 space-y-4 border-l-2 border-surface-container-high pl-4 md:pl-6">
          {unit.topics.map((topic: any, tIndex: number) => (
            <div key={topic.id} className="relative group/topic">
              <div className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-xl bg-surface-container-lowest transition-all clay-card ${topic.subtopics && topic.subtopics.length === 0 ? "opacity-70" : "hover:bg-surface-container-low"}`}>
                <div className="flex items-center gap-4 flex-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl hidden md:block">
                    {topic.subtopics && topic.subtopics.length > 0 ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-background">Topic {index + 1}.{tIndex + 1}: {topic.title}</h4>
                  </div>
                </div>
                {topic.status && (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full self-start md:self-auto ${
                    topic.status === 'In Progress' ? 'text-tertiary bg-tertiary/10' : 'text-on-surface-variant/60 bg-surface-container-highest'
                  }`}>
                    {topic.status}
                  </span>
                )}
              </div>

              {topic.subtopics && topic.subtopics.length > 0 && (
                <div className="ml-2 md:ml-10 mt-3 space-y-2">
                  {topic.subtopics.map((subtopic: any) => (
                    <TopicRow key={subtopic.id} subtopic={subtopic} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
