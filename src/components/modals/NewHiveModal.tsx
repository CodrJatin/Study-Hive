"use client";

import React from "react";
import { createHive } from "@/actions/hive";

export function NewHiveModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  // This function wraps the server action to ensure the modal closes after submission
  async function handleAction(formData: FormData) {
    await createHive(formData);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#fcf9f8]/70 backdrop-blur-[8px]"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-[1.5rem] shadow-[0px_12px_32px_rgba(27,28,28,0.06)] overflow-hidden flex flex-col relative z-10 scale-100 animate-in fade-in zoom-in duration-300 clay-card">
        {/* Modal Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container-low">
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Create New Hive</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form className="p-8 space-y-6" action={handleAction}>
          {/* Hive Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="title">
              Hive Name
            </label>
            <input
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 outline-none"
              id="title"
              name="title" // Crucial: name must match the key used in Server Action
              placeholder="e.g., Quantum Mechanics 101"
              type="text"
              required
            />
          </div>

          {/* Hive Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="subject">
              Subject
            </label>
            <input
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 outline-none"
              id="subject"
              name="subject"
              placeholder="e.g., Physics"
              type="text"
              required
            />
          </div>

          {/* Hive Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="description">
              Hive Description
            </label>
            <textarea
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 resize-none font-body leading-relaxed outline-none"
              id="description"
              name="description"
              placeholder="Define the scope and learning objectives..."
              rows={3}
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              className="px-6 py-3 rounded-full text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-8 py-3 rounded-full cta-gradient text-on-primary font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
              type="submit"
            >
              Create Hive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}