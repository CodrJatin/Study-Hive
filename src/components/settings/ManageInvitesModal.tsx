"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { createInvite, deleteInvite } from "@/actions/invite";
import { getJoinUrl } from "@/utils/get-url";

interface HiveInvite {
  id: string;
  code: string;
  expiresAt: Date | null;
  createdAt: Date;
}

interface ManageInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId: string;
  initialInvites: HiveInvite[];
}

function formatExpiry(expiresAt: Date | null): string {
  if (!expiresAt) return "Never expires";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days >= 1) return `Expires in ${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `Expires in ${hours} hour${hours > 1 ? "s" : ""}`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `Expires in ${minutes} minute${minutes > 1 ? "s" : ""}`;
}

export function ManageInvitesModal({
  isOpen,
  onClose,
  hiveId,
  initialInvites,
}: ManageInvitesModalProps) {
  const [expiry, setExpiry] = useState<string>("24");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, startCreateTransition] = useTransition();
  const [, startDeleteTransition] = useTransition();

  // Optimistic invite list — add/remove instantly before server confirms
  const [optimisticInvites, dispatchOptimistic] = useOptimistic(
    initialInvites,
    (current: HiveInvite[], action: { type: "add"; invite: HiveInvite } | { type: "remove"; id: string }) => {
      if (action.type === "add") return [...current, action.invite];
      if (action.type === "remove") return current.filter((i) => i.id !== action.id);
      return current;
    }
  );

  if (!isOpen) return null;

  function handleCreate() {
    setError(null);
    const expiresInHours = expiry === "never" ? null : Number(expiry);
    // Optimistic placeholder — shows immediately while server creates
    const placeholder: HiveInvite = {
      id: `optimistic-${Date.now()}`,
      code: "...",
      expiresAt: expiresInHours ? new Date(Date.now() + expiresInHours * 3600_000) : null,
      createdAt: new Date(),
    };
    startCreateTransition(async () => {
      dispatchOptimistic({ type: "add", invite: placeholder });
      const result = await createInvite(hiveId, expiresInHours);
      if (result?.error) {
        setError(result.error);
      }
      // After revalidatePath the page will refresh with the real invite
    });
  }

  function handleDelete(invite: HiveInvite) {
    setError(null);
    startDeleteTransition(async () => {
      // Optimistic remove fires before the network round-trip
      dispatchOptimistic({ type: "remove", id: invite.id });
      const result = await deleteInvite(hiveId, invite.id);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  function handleCopy(code: string, id: string) {
    navigator.clipboard.writeText(getJoinUrl(code));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1b1c1c]/30 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-4xl shadow-[0px_12px_32px_rgba(27,28,28,0.10)] ring-1 ring-on-surface/5 flex flex-col relative z-10 clay-card animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start px-8 pt-8 pb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">
              Manage Invites
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Generate shareable links to invite members to this Hive.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface/60 shrink-0 ml-4"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Generate Section */}
        <div className="px-8 pb-6 shrink-0">
          <div className="bg-surface-container-low rounded-2xl p-5 clay-inset border border-outline-variant/10">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Generate New Link
            </p>
            {error && (
              <div className="mb-4 bg-error/10 text-error text-sm font-medium px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-on-surface/60 mb-1.5 px-1">
                  Expiration
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-surface-container-high hover:bg-surface-container-highest border-none rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/10 outline-none flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>
                      {expiry === "1"
                        ? "1 Hour"
                        : expiry === "24"
                        ? "24 Hours"
                        : expiry === "168"
                        ? "7 Days"
                        : "Never"}
                    </span>
                    <span
                      className={`material-symbols-outlined text-on-surface/50 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-60"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 w-full mt-2 bg-surface-container-lowest rounded-2xl shadow-2xl ring-1 ring-on-surface/5 py-2 z-70 clay-card animate-in fade-in slide-in-from-top-2 duration-200">
                        {[
                          { val: "1", lab: "1 Hour" },
                          { val: "24", lab: "24 Hours" },
                          { val: "168", lab: "7 Days" },
                          { val: "never", lab: "Never" },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => {
                              setExpiry(opt.val);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center justify-between ${
                              expiry === opt.val
                                ? "bg-primary/10 text-primary"
                                : "text-on-surface hover:bg-surface-container-high"
                            }`}
                          >
                            {opt.lab}
                            {expiry === opt.val && (
                              <span className="material-symbols-outlined text-lg">
                                check
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className={`px-6 py-3 cta-gradient text-white rounded-xl font-headline font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all ${
                    isCreating
                      ? "opacity-70 cursor-not-allowed scale-95"
                      : "hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      isCreating ? "animate-spin" : ""
                    }`}
                  >
                    {isCreating ? "progress_activity" : "add_link"}
                  </span>
                  {isCreating ? "Creating..." : "Generate Link"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 h-px bg-outline-variant/10 shrink-0" />

        {/* Invite List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 custom-scrollbar">
          {optimisticInvites.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-3 block">
                link_off
              </span>
              <p className="text-sm font-medium text-on-surface-variant/50">
                No active invite links
              </p>
            </div>
          ) : (
            optimisticInvites.map((invite) => {
              const url = getJoinUrl(invite.code);
              const isExpired =
                invite.expiresAt && new Date(invite.expiresAt) < new Date();
              const isPlaceholder = invite.id.startsWith("optimistic-");

              return (
                <div
                  key={invite.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    isExpired
                      ? "bg-error/5 border-error/10 opacity-60"
                      : "bg-surface-container-low border-outline-variant/10 hover:border-primary/20"
                  } ${isPlaceholder ? "opacity-50 animate-pulse pointer-events-none" : ""}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpired ? "bg-error/10" : "bg-primary/10"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isExpired ? "text-error" : "text-primary"
                      }`}
                    >
                      {isExpired ? "link_off" : "link"}
                    </span>
                  </div>

                  {/* URL + Expiry */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-medium text-on-surface truncate">
                      {isPlaceholder ? "Generating link..." : url}
                    </p>
                    <p
                      className={`text-xs font-semibold mt-0.5 ${
                        isExpired ? "text-error" : "text-on-surface-variant"
                      }`}
                    >
                      {formatExpiry(invite.expiresAt ? new Date(invite.expiresAt) : null)}
                    </p>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(invite.code, invite.id)}
                    disabled={!!isExpired || isPlaceholder}
                    title="Copy link"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {copiedId === invite.id ? "check_circle" : "content_copy"}
                    </span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(invite)}
                    disabled={isPlaceholder}
                    title="Revoke link"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-all disabled:opacity-30 shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
