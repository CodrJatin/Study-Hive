"use client";
import { Icon } from "@/components/ui/Icon";
import React from "react";

interface ConfirmUploadModalProps {
  files: File[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmUploadModal({ files, onConfirm, onCancel }: ConfirmUploadModalProps) {
  const hasOversizedFiles = files.some(f => f.size > 10 * 1024 * 1024);

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" onClick={onCancel} />
      <div className="relative z-10 bg-surface-container-lowest w-full max-w-md rounded-4xl p-8 shadow-2xl flex flex-col gap-6 scale-in-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Confirm Upload</h2>
          <p className="text-sm text-on-surface-variant">
            Are you sure you want to upload the following {files.length} {files.length === 1 ? 'file' : 'files'}?
          </p>
        </div>
        
        <div className="max-h-48 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
          {files.map((f, i) => {
            const isOversized = f.size > 10 * 1024 * 1024;
            return (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isOversized ? 'border-error/50 bg-error/10' : 'border-outline-variant/20 bg-surface-container'}`}>
                <div className="flex flex-col">
                  <span className={`truncate text-sm font-medium max-w-[200px] ${isOversized ? 'text-error' : 'text-on-surface'}`} title={f.name}>{f.name}</span>
                  {isOversized && <span className="text-xs text-error font-bold mt-1">Exceeds 10MB limit</span>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${isOversized ? 'text-error bg-error/20' : 'text-on-surface-variant bg-surface-container-high'}`}>
                  {f.size < 1024 * 1024 
                    ? `${(f.size / 1024).toFixed(0)} KB` 
                    : `${(f.size / 1024 / 1024).toFixed(2)} MB`}
                </span>
              </div>
            );
          })}
        </div>
        
        {hasOversizedFiles && (
          <div className="bg-error/10 text-error text-sm font-bold p-3 rounded-xl flex items-center gap-2">
            <Icon name="error" className="text-lg" />
            Files larger than 10MB are not allowed.
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
             onClick={onCancel}
             className="px-5 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
             onClick={onConfirm}
             disabled={hasOversizedFiles}
             className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-lg ${
               hasOversizedFiles 
                 ? 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed shadow-none' 
                 : 'bg-primary text-on-primary hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 shadow-primary/20'
             }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
