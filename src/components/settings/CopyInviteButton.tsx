"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState } from "react";
import { getJoinUrl } from "@/utils/get-url";
import { toast } from "sonner";

export function CopyInviteButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = getJoinUrl(code);
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center justify-center gap-2"
      title="Copy invite URL"
    >
      <Icon name={copied ? "check_circle" : "content_copy"} className="text-[20px]" />
      {copied && <span className="text-[10px] font-bold uppercase tracking-tight">Copied</span>}
    </button>
  );
}
