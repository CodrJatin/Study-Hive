"use client";

import React, { useState } from "react";
import { NewHiveModal } from "@/components/modals/NewHiveModal";

export function AddHiveCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group border-2 border-dashed border-outline-variant/30 rounded-[1.5rem] flex flex-col items-center justify-center p-8 transition-all hover:bg-surface-container-low hover:border-primary/40 cursor-pointer h-full min-h-[300px]"
      >
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined text-3xl text-primary">add_circle</span>
        </div>
        <p className="text-on-surface-variant font-headline font-bold">Create New Hive</p>
        <p className="text-xs text-on-surface-variant/60 text-center mt-2 px-4">Start a collaborative studio for your latest course</p>
      </div>
      <NewHiveModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
