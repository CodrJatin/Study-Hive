"use client";

import React, { useRef, useState, useTransition, useCallback, useEffect } from "react";
import Link from "next/link";
import { createTask } from "@/actions/tasks";
import { globalSearch, SearchResult } from "@/actions/search";

export function CreateTaskForm({ userId }: { userId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isAdding, startAddingTransition] = useTransition();
  const [isSearching, startSearchTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchedQuery = useRef("");

  const [selectedHive, setSelectedHive] = useState<{ id: string; title: string } | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<{ id: string; title: string, type?: string } | null>(null);

  const isTypingOrSearching = searchQuery.trim().length >= 2 && (isSearching || searchQuery.trim() !== lastSearchedQuery.current);
  const showDropdown = showSearchDropdown && searchQuery.trim().length >= 2;

  // ── Debounced search ─────────────────────────────────────────────────────
  const runSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      lastSearchedQuery.current = "";
      return;
    }
    
    startSearchTransition(async () => {
      const data = await globalSearch(trimmed);
      setSearchResults(data);
      lastSearchedQuery.current = trimmed;
    });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(searchQuery), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, runSearch]);

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === "hive") {
      setSelectedHive({ id: result.id, title: result.title });
      setSelectedMaterial(null);
    } else if (result.type === "material") {
      setSelectedMaterial({ id: result.id, title: result.title, type: result.materialType });
      setSelectedHive({ id: result.hiveId, title: "Hive Reference" }); // Could be better but we just need hiveId
    }
    // We can also let topics and units just select the hive
    else {
      setSelectedHive({ id: result.hiveId, title: "Hive Reference" });
      setSelectedMaterial(null);
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const handleClearAttachment = () => {
    setSelectedHive(null);
    setSelectedMaterial(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    startAddingTransition(async () => {
      const data = {
        title: title.trim(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        hiveId: selectedHive?.id,
        materialId: selectedMaterial?.id,
      };
      const result = await createTask(userId, data);
      
      if (result.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        handleClearAttachment();
      }
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest border border-outline-variant/10 rounded-[24px] p-6 clay-card mb-8 shadow-sm relative"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-4">
        <div className="w-10 h-10 bg-[#F7F2ED] text-[#735A27] rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined font-bold text-[20px]">add_task</span>
        </div>
        <h2 className="text-[20px] font-headline font-bold text-[#1A1A1A]">Create New Task</h2>
      </div>

      {error && (
        <div className="bg-error/10 text-error text-sm font-medium px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[12px] font-bold text-[#757575] mb-2 px-1">
              Task Description
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Read chapter 4 of Data Structures"
              disabled={isAdding}
              className="w-full bg-[#F7F6F3] border-none rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#735A27]/20 transition-all disabled:opacity-50"
            />
          </div>
          
          <div className="md:w-48">
            <label className="block text-[12px] font-bold text-[#757575] mb-2 px-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              name="dueDate"
              disabled={isAdding}
              className="w-full bg-[#F7F6F3] border-none rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#735A27]/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Attachment Search Section */}
        <div>
          <label className="block text-[12px] font-bold text-[#757575] mb-2 px-1">
            Attach to Hive/Material (Optional)
          </label>
          
          {(selectedHive || selectedMaterial) ? (
            <div className="flex items-center gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl flex-wrap">
              <span className="text-[13px] font-bold text-[#1A1A1A]">Attached:</span>
              
              {selectedHive && !selectedMaterial && (
                <Link
                  href={`/hive/${selectedHive.id}`}
                  className="flex items-center gap-1.5 bg-[#F7F2ED] text-[#735A27] text-[12px] font-bold px-3 py-1.5 rounded-lg border border-[#E5E5E5] hover:bg-[#EAE5DF] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">science</span>
                  {selectedHive.title}
                </Link>
              )}
              
              {selectedMaterial && (
                <Link
                  href={`/hive/${selectedHive?.id}/materials/${selectedMaterial.id}`}
                  className="flex items-center gap-1.5 bg-[#F6F4F0] text-[#4A4A4A] text-[12px] font-bold px-3 py-1.5 rounded-lg border border-[#E5E5E5] hover:bg-[#EAE5DF] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">description</span>
                  {selectedMaterial.title}
                </Link>
              )}
              
              <button 
                type="button" 
                onClick={handleClearAttachment}
                className="ml-auto w-6 h-6 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                title="Remove attachment"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center bg-[#F7F6F3] rounded-xl px-4 focus-within:ring-2 focus-within:ring-[#735A27]/20 transition-all">
                <span className={`material-symbols-outlined text-[18px] mr-2 transition-colors ${isSearching ? "text-[#735A27] animate-pulse" : "text-[#757575]"}`}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search to attach a hive or material..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full bg-transparent border-none py-3 text-[14px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#757575]/70"
                />
              </div>

              {/* Search Dropdown */}
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-60" onClick={() => setShowSearchDropdown(false)} />
                  <div className="clay-card absolute top-full mt-2 left-0 right-0 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden z-70 animate-in fade-in slide-in-from-top-2 duration-150">
                    {isTypingOrSearching && (
                      <div className="px-4 py-4 text-sm text-on-surface-variant animate-pulse flex items-center gap-3">
                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                        Searching for "{searchQuery}"...
                      </div>
                    )}
                    {!isTypingOrSearching && searchResults.length === 0 && (
                       <div className="py-8 text-center text-on-surface-variant/40 text-sm">No results found.</div>
                    )}
                    {!isTypingOrSearching && searchResults.length > 0 && (
                      <ul className="divide-y divide-outline-variant/5">
                        {searchResults.filter(r => r.type === "hive" || r.type === "material").map((result) => {
                          const icon = result.type === "hive" ? "hive" :
                                       result.materialType === "PLAYLIST" ? "playlist_play" :
                                       result.materialType === "VIDEO" ? "play_circle" :
                                       result.materialType === "PDF" ? "picture_as_pdf" :
                                       result.materialType === "LINK" ? "link" : "description";

                          const colorClass = result.type === "hive" ? "text-primary bg-primary/10" :
                                             result.materialType === "PLAYLIST" ? "text-tertiary bg-tertiary/10" :
                                             result.materialType === "VIDEO" ? "text-primary bg-primary/10" :
                                             result.materialType === "PDF" ? "text-error bg-error/10" :
                                             result.materialType === "LINK" ? "text-secondary bg-secondary/10" :
                                             "text-tertiary bg-tertiary/10";
                                             
                          return (
                            <li key={result.id} role="option">
                              <button
                                type="button"
                                onClick={() => handleSelectResult(result)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high/60 transition-colors text-left group"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{result.title}</p>
                                  {result.subtitle && <p className="text-xs text-on-surface-variant/60 truncate mt-0.5">{result.subtitle}</p>}
                                </div>
                                <span className="material-symbols-outlined text-base text-on-surface-variant/30 group-hover:text-primary transition-all">arrow_forward</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end pt-4 border-t border-outline-variant/10">
        <button
          type="submit"
          disabled={isAdding}
          className={`px-6 py-2.5 bg-[#735A27] text-white rounded-xl text-[14px] font-bold shadow-md flex items-center gap-2 transition-all ${
            isAdding ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] hover:bg-[#5C481F]"
          }`}
        >
          {isAdding && (
            <span className="material-symbols-outlined text-[18px] animate-spin">
              progress_activity
            </span>
          )}
          {isAdding ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
