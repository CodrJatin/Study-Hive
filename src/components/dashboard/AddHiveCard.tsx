"use client";

import React, { useState } from "react";
import { NewHiveModal } from "@/components/modals/NewHiveModal";
import { ActionCard } from "@/components/shared/ActionCard";

export function AddHiveCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionCard
        icon="add_circle"
        title="Create New Hive"
        description="Start a collaborative studio for your latest course"
        onClick={() => setIsOpen(true)}
        type="small"
      />
      <NewHiveModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
