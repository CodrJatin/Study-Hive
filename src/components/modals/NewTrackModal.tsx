"use client";

import React, { useState } from "react";
import { createTrack } from "@/actions/track";

function getIconStyling(type: string) {
  switch (type) {
    case 'PDF': return { icon: 'picture_as_pdf', iconBg: 'bg-error/10', iconColor: 'text-error' };
    case 'VIDEO': return { icon: 'play_circle', iconBg: 'bg-primary-container', iconColor: 'text-primary' };
    case 'DOC': return { icon: 'description', iconBg: 'bg-tertiary-container', iconColor: 'text-tertiary' };
    case 'LINK': return { icon: 'link', iconBg: 'bg-secondary-container', iconColor: 'text-secondary' };
    default: return { icon: 'article', iconBg: 'bg-surface-container-high', iconColor: 'text-on-surface' };
  }
}

export function NewTrackModal({ isOpen, onClose, materials, hiveId }: { isOpen: boolean; onClose: () => void, materials: any[], hiveId: string }) {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  
  if (!isOpen) return null;

  const toggleMaterial = (id: string) => {
    setSelectedMaterials(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const action = async (formData: FormData) => {
    selectedMaterials.forEach(m => formData.append("materialIds", m));
    await createTrack(hiveId, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <form action={action} className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-outline-variant/10">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface">Create Study Track</h2>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Select materials to include in your track</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant px-2">Track Title</label>
            <input 
              type="text" 
              name="title"
              required
              placeholder="e.g., Mid-sem Revision"
              className="w-full bg-surface-container rounded-xl px-4 py-3 placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary/20 transition-all font-body text-on-surface"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-on-surface-variant px-2 block">Available Materials</label>
            <div className="space-y-2">
              {materials.map((material) => {
                const styling = getIconStyling(material.type);
                return (
                <div 
                  key={material.id}
                  onClick={() => toggleMaterial(material.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
                    selectedMaterials.includes(material.id) 
                      ? "bg-primary-container/20 border-primary shadow-sm" 
                      : "bg-surface-container-lowest border-outline-variant/20 hover:border-outline-variant hover:bg-surface-container"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    selectedMaterials.includes(material.id)
                      ? "bg-primary border-primary text-on-primary"
                      : "border-outline-variant bg-surface-container-lowest"
                  }`}>
                    {selectedMaterials.includes(material.id) && (
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${styling.iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${styling.iconColor}`}>{styling.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{material.title}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{material.type}</p>
                  </div>
                </div>
              )})}
              {materials.length === 0 && <p className="text-on-surface-variant px-2 text-sm">No materials available in this hive.</p>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between gap-4 mt-auto">
          <p className="text-xs font-bold text-primary px-2">{selectedMaterials.length} selected</p>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 rounded-full font-bold text-white cta-gradient shadow-md transition-transform active:scale-95 text-sm"
            >
              Create Track
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
