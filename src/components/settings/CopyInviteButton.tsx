"use client";

import React, { useState } from "react";

export function CopyInviteButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center justify-center gap-2"
      title="Copy invite URL"
    >
      <span className="material-symbols-outlined text-[20px]">
        {copied ? "check_circle" : "content_copy"}
      </span>
      {copied && <span className="text-[10px] font-bold uppercase tracking-tight">Copied</span>}
    </button>
  );
}
