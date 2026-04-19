"use client";

import React, { useState } from "react";
import { TopicRow } from "./TopicRow";
import { AddTopicForm } from "./AddTopicForm";
import { Topic, Unit } from "@prisma/client";

interface UnitAccordionProps {
  unit: Unit & { topics: Topic[] };
  index: number;
  hiveId: string;
}

export function UnitAccordion({ unit, index, hiveId }: UnitAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className="group">
      {/* Unit Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer ${
          isExpanded ? "clay-card" : "border-l-4 border-transparent hover:border-primary clay-inset"
        }`}
      >
        <span
          className={`material-symbols-outlined text-on-surface-variant text-2xl transition-transform duration-300 ${
            isExpanded ? "rotate-180 text-primary" : ""
          }`}
        >
          expand_more
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span
              className={`${
                isExpanded
                  ? "bg-primary-fixed-dim text-on-primary-fixed"
                  : "bg-outline-variant/40 text-on-surface-variant"
              } text-[10px] font-black px-2 py-0.5 rounded uppercase`}
            >
              Unit {index + 1}
            </span>
            <h3 className="text-lg font-bold text-on-background">{unit.title}</h3>
          </div>
        </div>
        <div className="text-on-surface-variant/40 hidden md:flex items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-base">description</span>
          <span className="text-xs font-bold">{unit.topics.length} Topics</span>
        </div>
      </div>

      {/* Topics + Add Form */}
      {isExpanded && (
        <div className="ml-4 md:ml-12 mt-3 space-y-2 border-l-2 border-surface-container-high pl-4 md:pl-6 pb-2">
          {unit.topics.map((topic: Topic, tIndex: number) => (
            <TopicRow key={topic.id} topic={topic} index={tIndex} unitIndex={index} />
          ))}
          <AddTopicForm
            unitId={unit.id}
            hiveId={hiveId}
            unitIndex={index}
            currentTopicCount={unit.topics.length}
          />
        </div>
      )}
    </div>
  );
}
