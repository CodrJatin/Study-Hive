"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/30 backdrop-blur-sm"
        onClick={() => !isPending && onCancel()}
      />
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl ring-1 ring-on-surface/5 clay-card z-10 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-sm font-medium text-on-surface-variant/80 mb-8">
            {message}
          </p>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              onClick={onCancel}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition-all ${
                isPending ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
              } ${
                isDestructive 
                  ? "bg-error text-on-error shadow-error/20" 
                  : "bg-primary text-white shadow-primary/20"
              }`}
            >
              {isPending && (
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
              )}
              {isPending ? "Confirming..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
