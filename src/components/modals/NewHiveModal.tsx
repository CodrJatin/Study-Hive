"use client";

import React, { useState } from "react";

export function NewHiveModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

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
        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          {/* Hive Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="hive-name">
              Hive Name
            </label>
            <input 
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 outline-none" 
              id="hive-name" 
              placeholder="e.g., Quantum Mechanics 101" 
              type="text"
            />
          </div>
          
          {/* Cover Image Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1">
              Hive Cover
            </label>
            <div className="relative group rounded-xl overflow-hidden aspect-[21/9] bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-colors cursor-pointer clay-inset">
              <img 
                alt="Hive cover placeholder" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdN3JLdUAADVeAHzXl_OJwWXGKbEGglaJbhXsqsBRpTg8dft-iakjZGOaV8W1fDVBHZ84bi7KHFuTA4USS082_f5ofMCFGIKB4JQbjjFO2YJlULf4JZwsOgEpfT5sKXzv6U3buG5GmXwudLL5Ji_u9ASCDBP4oepNKEIf5tbwy2_OJa-cliyKKCp8Ihc-0NlE-_FsSVIJFh4KG_Q8CN-LrtSW05AFnF87E9N_lUBqtdkGvz2OYjftiDghH3Jpj3gA9yvvjnIVBZg"
              />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-semibold text-primary underline underline-offset-4">Upload Cover</span>
                  <span className="text-sm font-medium text-on-surface-variant/60">or</span>
                  <span className="text-sm font-semibold text-primary underline underline-offset-4">Choose from Library</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hive Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="hive-desc">
              Hive Description
            </label>
            <textarea 
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 resize-none font-body leading-relaxed outline-none" 
              id="hive-desc" 
              placeholder="Define the scope and learning objectives of this knowledge collection..." 
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
