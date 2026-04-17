"use client";

import React, { useState } from "react";
import { NewAnnouncementModal } from "./NewAnnouncementModal";

export function CreateAnnouncementAction({ hiveId, userName }: { hiveId: string, userName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-surface-container-lowest text-primary border border-primary/10 rounded-full text-sm font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-lg" data-icon="add">
          add
        </span>
        Create
      </button>
      <NewAnnouncementModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        hiveId={hiveId} 
        userName={userName}
      />
    </>
  );
}
