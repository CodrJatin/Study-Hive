"use client";

import React, { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { globalSearch, SearchResult } from "@/actions/search";
import { Dropdown, DropdownOption } from "@/components/shared/Dropdown";

// Icon map for each result type
const TYPE_ICON: Record<SearchResult["type"], string> = {
  hive: "hive",
  material: "description",
  topic: "check_circle",
  unit: "layers",
};

const TYPE_COLOR: Record<SearchResult["type"], string> = {
  hive: "text-primary bg-primary/10",
  material: "text-tertiary bg-tertiary/10",
  topic: "text-secondary bg-secondary/10",
  unit: "text-on-surface-variant bg-surface-container-high",
};

function buildHref(result: SearchResult): string {
  // 1. Materials: Conditional routing for Hive vs. Personal
  if (result.type === "material") {
    // If it has a hiveId, it's a shared Hive resource
    if (result.hiveId) {
      return `/hive/${result.hiveId}/materials/${result.id}`;
    }
    // If hiveId is null, it's a personal material in the dashboard
    return `/dashboard/materials/${result.id}`;
  }

  // 2. Hives: Navigate directly to the hive overview
  if (result.type === "hive") {
    return `/hive/${result.id}`;
  }

  // 3. Topics and Units: These always belong to a Hive
  if (result.hiveId) {
    return `/hive/${result.hiveId}/syllabus`;
  }

  // 4. Default Fallback: Go to the main dashboard
  return "/dashboard";
}

export function HeaderSearch({ isMobile }: { isMobile?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");

  // ── Debounced search ─────────────────────────────────────────────────────
  const runSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      setLastSearchedQuery("");
      return;
    }
    
    startTransition(async () => {
      const data = await globalSearch(trimmed);
      setResults(data);
      setLastSearchedQuery(trimmed);
      setIsOpen(true);
    });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    // Open immediately if long enough
    if (query.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setResults([]);
    }

    debounceRef.current = setTimeout(() => runSearch(query), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (isMobile) setIsMobileSearchActive(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile]);

  // ── Keyboard shortcut: Escape to close ──────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        if (isMobile) setIsMobileSearchActive(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobile]);

  function handleSelect(result: SearchResult) {
    setIsOpen(false);
    setIsMobileSearchActive(false);
    setQuery("");
    setLastSearchedQuery("");
    router.push(buildHref(result));
  }

  const isTypingOrSearching = query !== lastSearchedQuery || isPending;
  const showDropdown = isOpen && query.trim().length >= 2;

  const options: DropdownOption[] = results.map((result) => {
    let icon = TYPE_ICON[result.type];
    let colorClass = TYPE_COLOR[result.type];
    const isPersonal = result.type === "material" && !result.hiveId;

    if (result.type === "material" && result.materialType) {
      switch (result.materialType) {
        case "PLAYLIST": icon = "playlist_play"; colorClass = "text-tertiary bg-tertiary/10"; break;
        case "VIDEO": icon = "play_circle"; colorClass = "text-primary bg-primary/10"; break;
        case "PDF": icon = "picture_as_pdf"; colorClass = "text-error bg-error/10"; break;
        case "LINK": icon = "link"; colorClass = "text-secondary bg-secondary/10"; break;
        case "IMAGE": icon = "image"; colorClass = "text-secondary bg-secondary/10"; break;
      }
    }

    return {
      id: result.id,
      title: result.title,
      subtext: result.subtitle || undefined,
      icon: (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      ),
      icon2: "arrow_forward",
      icon2Color: "text-on-surface-variant/30 group-hover:text-primary transition-all",
      pill: isPersonal ? (
        <span className="px-1.5 py-0.5 rounded-md bg-surface-container-high text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-tighter shrink-0 border border-outline-variant/10">
          Personal
        </span>
      ) : result.type === "material" && result.hiveId ? (
        <span className="px-1.5 py-0.5 rounded-md bg-primary/5 text-[9px] font-bold text-primary/60 uppercase tracking-tighter shrink-0 border border-primary/10">
          Shared
        </span>
      ) : undefined,
      onSelect: () => handleSelect(result),
    };
  });

  const loadingMessage = (
    <div className="px-4 py-4 text-sm text-on-surface-variant animate-pulse flex items-center gap-2">
      <span className="material-symbols-outlined text-base animate-spin text-primary">progress_activity</span>
      Searching for &quot;{query}&quot;...
    </div>
  );

  const emptyMessage = (
    <div className="px-4 py-8 text-center text-on-surface-variant/60 text-sm italic">
      No results found for &quot;{query}&quot;
    </div>
  );

  // ── Mobile Specific ─────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div ref={containerRef} className="flex items-center">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchActive(!isMobileSearchActive)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isMobileSearchActive ? "bg-primary text-on-primary" : "hover:bg-surface-container-high text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">{isMobileSearchActive ? "close" : "search"}</span>
        </button>

        {/* Full-width Mobile Input Bar (appears below header) */}
        {isMobileSearchActive && (
          <div className="fixed top-16 left-0 right-0 bg-surface-container-lowest/98 backdrop-blur-xl border-b border-outline-variant/10 p-4 z-50 animate-in slide-in-from-top-2 duration-200">
            <Dropdown
              options={options}
              isOpen={showDropdown}
              onOpenChange={setIsOpen}
              disableTriggerClick
              isLoading={isTypingOrSearching}
              loadingMessage={loadingMessage}
              emptyMessage={emptyMessage}
              menuClassName="w-full left-0 right-0 max-h-[70vh] shadow-xl border-outline-variant/10 !mt-2"
              trigger={
                <div className="flex items-center bg-surface-container-high px-4 py-2 rounded-2xl ring-2 ring-primary/20">
                  <span className={`material-symbols-outlined mr-3 text-lg ${isPending ? "animate-pulse text-primary" : "text-on-surface-variant"}`}>
                    search
                  </span>
                  <input
                    autoFocus
                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-body outline-none"
                    placeholder="Search everything..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setResults([]); setLastSearchedQuery(""); }}>
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>
              }
            />
          </div>
        )}
      </div>
    );
  }

  // ── Desktop Rendering ─────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      <Dropdown
        options={options}
        isOpen={showDropdown}
        onOpenChange={setIsOpen}
        disableTriggerClick
        isLoading={isTypingOrSearching}
        loadingMessage={loadingMessage}
        emptyMessage={emptyMessage}
        menuClassName="w-full left-0 right-0 max-h-[60vh] shadow-2xl border-outline-variant/20 !mt-2 z-[999] clay-card"
        trigger={
          <div
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
              isOpen
                ? "bg-surface-container-lowest ring-2 ring-primary/30 shadow-md"
                : "bg-surface-container-high focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20"
            }`}
          >
            <span
              className={`material-symbols-outlined mr-3 text-lg transition-colors ${
                isPending ? "text-primary animate-pulse" : "text-on-surface-variant"
              }`}
            >
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 w-full text-sm font-body outline-none placeholder:text-on-surface-variant/60"
              placeholder="Search hives, materials, topics…"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (query.trim().length >= 2) setIsOpen(true); }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults([]); setIsOpen(false); setLastSearchedQuery(""); }}
                className="ml-2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        }
      />
    </div>
  );
}
