"use client";

import React, { useState } from "react";
import { ManageInvitesModal } from "./ManageInvitesModal";

interface HiveInvite {
  id: string;
  code: string;
  expiresAt: Date | null;
  createdAt: Date;
}

interface ManageInvitesActionProps {
  hiveId: string;
  invites: HiveInvite[];
}

export function ManageInvitesAction({ hiveId, invites }: ManageInvitesActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest border border-primary/10 text-primary rounded-full text-sm font-bold hover:bg-primary hover:text-on-primary transition-all"
      >
        <span className="material-symbols-outlined text-lg">manage_accounts</span>
        Manage Invites
      </button>
      <ManageInvitesModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hiveId={hiveId}
        initialInvites={invites}
      />
    </>
  );
}
