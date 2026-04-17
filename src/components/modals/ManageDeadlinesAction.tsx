"use client";

import React, { useState } from "react";
import { ManageDeadlinesModal } from "./ManageDeadlinesModal";

interface ManageDeadlinesActionProps {
  hiveId: string;
  deadlines: any[];
}

export function ManageDeadlinesAction({ hiveId, deadlines }: ManageDeadlinesActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[12px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider group hover:opacity-80 transition-opacity"
      >
        Edit
        <span className="material-symbols-outlined text-[16px] group-hover:rotate-12 transition-transform">
          edit
        </span>
      </button>

      <ManageDeadlinesModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        hiveId={hiveId}
        deadlines={deadlines}
      />
    </>
  );
}
