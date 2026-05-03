"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState } from "react";
import { NewHiveModal } from "./NewHiveModal";

export function CreateHiveAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 py-3 px-4 bg-primary-container text-[#785900] rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 duration-150 shadow-sm"
      >
        <Icon name="add" />
        <span>New Hive</span>
      </button>
      <NewHiveModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
