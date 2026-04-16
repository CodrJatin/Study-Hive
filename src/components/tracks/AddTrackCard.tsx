"use client";

import React, { useState } from "react";
import { NewTrackModal } from "@/components/modals/NewTrackModal";

export function AddTrackCard({ materials, hiveId }: { materials: any[], hiveId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group bg-surface-container-low rounded-[1.5rem] p-6 hover:bg-surface-container-lowest transition-all duration-300 relative overflow-hidden border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center clay-inset cursor-pointer min-h-[300px]"
      >
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-outline mb-4 group-hover:bg-primary-container group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-3xl">add</span>
        </div>
        <h3 className="headline text-lg font-bold text-outline group-hover:text-primary transition-colors">New Study Track</h3>
        <p className="text-sm text-on-surface-variant/60 max-w-[150px] mt-2">
          Combine your materials into a focused path.
        </p>
        <button className="mt-6 text-primary font-bold text-sm hover:underline">Get Started</button>
      </div>
      <NewTrackModal isOpen={isOpen} onClose={() => setIsOpen(false)} materials={materials} hiveId={hiveId} />
    </>
  );
}
