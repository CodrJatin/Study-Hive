"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { createHive } from "@/actions/hive";

export function NewHiveModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [, startTransition] = useTransition();

  const [selectedIcon, setSelectedIcon] = React.useState("science");

  const icons = [
    "science", "menu_book", "school", "psychology", "calculate",
    "biotech", "computer", "history_edu", "language", "terminal",
    "architecture", "brush", "music_note", "fitness_center", "account_balance",
    "gavel", "medication", "functions", "public", "stadium",
    "bolt", "memory", "electrical_services", "engineering", "construction",
    "foundation", "rocket_launch", "analytics", "code", "map"
  ];

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("icon", selectedIcon);
    const title = (formData.get("title") as string).trim();

    onClose();

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await createHive(formData);
          if (result && "error" in result && result.error) throw new Error(result.error);
        })(),
        {
          loading: `Creating hive "${title}"…`,
          success: `Hive "${title}" created!`,
          error: (err: Error) => err.message || "Failed to create hive",
        }
      );
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(27,28,28,0.06)] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in duration-300 clay-card max-h-[90vh]">
        <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container-low shrink-0">
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Create New Hive</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>

        <form className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="hive-title">Hive Name</label>
            <input id="hive-title" name="title" type="text" required placeholder="e.g., Quantum Mechanics 101"
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 outline-none" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1">Choose Icon</label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 p-1 bg-surface-container rounded-2xl border border-outline-variant/10">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === icon 
                      ? "bg-primary/15 text-primary shadow-sm scale-110" 
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  }`}
                >
                  <Icon name={icon} className="text-5xl" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant tracking-wider uppercase ml-1" htmlFor="hive-desc">Hive Description</label>
            <textarea id="hive-desc" name="description" rows={3} placeholder="Define the scope and learning objectives..."
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/40 resize-none font-body leading-relaxed outline-none" />
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-4 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-full text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-3 rounded-full cta-gradient text-on-primary font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
              Create Hive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}