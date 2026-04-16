"use client";

import React from "react";

export function NewAnnouncementModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/30 backdrop-blur-[4px]"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0px_12px_32px_rgba(27,28,28,0.06)] ring-1 ring-on-surface/5 flex flex-col relative z-10 clay-card animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-10 py-8">
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Create Announcement</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface/60"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="px-10 pb-6 space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-label font-semibold text-on-surface/60 px-1">
              Announcement Title
            </label>
            <input 
              className="w-full bg-surface-container-high border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body outline-none" 
              placeholder="e.g., Upcoming Lab Session Details" 
              type="text" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-label font-semibold text-on-surface/60 px-1">
              Content
            </label>
            <textarea 
              className="w-full bg-surface-container-high border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body resize-none outline-none" 
              placeholder="Write your announcement here..." 
              rows={6}
            ></textarea>
          </div>
          
          {/* Collaborative Selection Chips */}
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">push_pin</span>
              Pin to top
            </span>
            <span className="px-4 py-2 bg-surface-container-high text-on-surface/60 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              Notify all members
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-10 py-8 bg-surface-container-low/50 flex justify-end items-center gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-on-surface/70 font-headline font-bold hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button className="px-10 py-3 cta-gradient text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Post Announcement
          </button>
        </div>
      </div>
    </div>
  );
}
