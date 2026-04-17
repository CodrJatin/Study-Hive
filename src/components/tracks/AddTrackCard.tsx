"use client";

import React, { useState } from "react";
import { NewTrackModal } from "@/components/modals/NewTrackModal";
import { ActionCard } from "@/components/shared/ActionCard";

export function AddTrackCard({ materials, hiveId }: { materials: any[], hiveId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionCard
        icon="add"
        title="New Study Track"
        description="Combine your materials into a focused path."
        actionText="Get Started"
        onClick={() => setIsOpen(true)}
        type="small"
      />
      <NewTrackModal isOpen={isOpen} onClose={() => setIsOpen(false)} materials={materials} hiveId={hiveId} />
    </>
  );
}
