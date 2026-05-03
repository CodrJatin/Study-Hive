"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState, useTransition } from "react";
import { TopicRow } from "./TopicRow";
import { AddTopicForm } from "./AddTopicForm";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";
import { deleteUnit } from "@/actions/syllabus";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import type { ClientTopic, ClientUnit, TopicStatus } from "@/types/client-prisma";

interface UnitAccordionProps {
  unit: ClientUnit & {
    topics: (ClientTopic & { topicProgress?: { status: TopicStatus }[] })[];
  };
  index: number;
  hiveId: string;
}

export function UnitAccordion({ unit, index, hiveId }: UnitAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const { role, userId } = useHiveContext();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOptimisticallyDeleted, setIsOptimisticallyDeleted] = useState(false);

  const handleDelete = () => {
    setShowConfirm(false);
    setIsOptimisticallyDeleted(true);
    startDeleteTransition(() => {
      toast.promise(
        (async () => {
          const result = await deleteUnit(hiveId, unit.id);
          if (result && "error" in result && result.error) throw new Error(result.error);
        })(),
        {
          loading: `Deleting unit "${unit.title}"...`,
          success: `Unit "${unit.title}" deleted.`,
          error: (err: Error) => {
            setIsOptimisticallyDeleted(false);
            return err.message || "Failed to delete unit";
          },
        }
      );
    });
  };

  if (isOptimisticallyDeleted) return null;

  return (
    <>
      <div className="group">
        {/* Unit Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer ${
            isExpanded ? "clay-card" : "border-l-4 border-transparent hover:border-primary clay-inset"
          }`}
        >
          <Icon 
            name="expand_more" 
            className={`text-on-surface-variant text-2xl transition-transform duration-300 ${
              isExpanded ? "rotate-180 text-primary" : ""
            }`} 
          />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-on-background">{unit.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {Permissions.canEditOrDeleteItem(role, unit.creatorId, userId) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                disabled={isDeleting}
                className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete Unit"
              >
                <Icon name="delete" className="text-[20px]" />
              </button>
            )}
            <div className="text-on-surface-variant/40 hidden md:flex items-center gap-1 shrink-0">
              <Icon name="description" className="text-base" />
              <span className="text-xs font-bold">{unit.topics.length} Topics</span>
            </div>
          </div>
        </div>

        {/* Topics + Add Form */}
        {isExpanded && (
          <div className="ml-4 md:ml-12 mt-3 space-y-2 border-l-2 border-surface-container-high pl-4 md:pl-6 pb-2">
            {unit.topics.map((topic) => {
              const status = topic.topicProgress?.[0]?.status || "NOT_STARTED";
              return (
                <TopicRow 
                  key={topic.id} 
                  topic={topic} 
                  userStatus={status} 
                />
              );
            })}
            <AddTopicForm
              unitId={unit.id}
              hiveId={hiveId}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Unit"
        message={`Are you sure you want to delete "${unit.title}" and all its topics? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
