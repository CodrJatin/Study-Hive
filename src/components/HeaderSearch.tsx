"use client";

import React, { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { globalSearch, SearchResult } from "@/actions/search";

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
  const base = `/hive/${result.hiveId}`;
  switch (result.type) {
    case "hive":
      return base;
    case "material":
      return `${base}/materials/${result.materialId}`;
    case "topic":
    case "unit":
      return `${base}/syllabus`;
    default:
      return base;
  }
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
  const lastSearchedQuery = useRef("");

  // ── Debounced search ─────────────────────────────────────────────────────
  const runSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      lastSearchedQuery.current = "";
      return;
    }
    
    startTransition(async () => {
      const data = await globalSearch(trimmed);
      setResults(data);
      lastSearchedQuery.current = trimmed;
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
    lastSearchedQuery.current = "";
    router.push(buildHref(result));
  }

  const hasResults = results.length > 0;
  const isTypingOrSearching = query.trim().length >= 2 && (isPending || query.trim() !== lastSearchedQuery.current);
  const showDropdown = isOpen && query.trim().length >= 2;

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
                <button onClick={() => { setQuery(""); setResults([]); lastSearchedQuery.current = ""; }}>
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Results for Mobile */}
            {showDropdown && (
              <div className="mt-2 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden max-h-[70vh] overflow-y-auto">
                {isTypingOrSearching && (
                  <div className="px-4 py-4 text-sm text-on-surface-variant animate-pulse flex items-center gap-2">
                    <span className="material-symbols-outlined text-base animate-spin text-primary">progress_activity</span>
                    Searching...
                  </div>
                )}
                {!isTypingOrSearching && !hasResults && (
                   <div className="px-4 py-8 text-center text-on-surface-variant/60 text-sm italic">
                     No results found for "{query}"
                   </div>
                )}
                {hasResults && (
                  <ul className="divide-y divide-outline-variant/5">
                    {results.map((result) => (
                      <SearchResultItem key={result.id} result={result} onSelect={handleSelect} />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Desktop Rendering ─────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
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
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); lastSearchedQuery.current = ""; }}
            className="ml-2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="clay-card absolute top-full mt-2 left-0 right-0 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden z-999 animate-in fade-in slide-in-from-top-2 duration-150">
          {isTypingOrSearching && (
            <div className="px-4 py-4 text-sm text-on-surface-variant animate-pulse flex items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              Searching for "{query}"...
            </div>
          )}
          {!isTypingOrSearching && !hasResults && (
             <div className="py-8 text-center text-on-surface-variant/40 text-sm">No results found.</div>
          )}
          {hasResults && (
            <ul className="divide-y divide-outline-variant/5">
              {results.map((result) => (
                <SearchResultItem key={result.id} result={result} onSelect={handleSelect} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultItem({ result, onSelect }: { result: SearchResult, onSelect: (r: SearchResult) => void }) {
  let icon = TYPE_ICON[result.type];
  let colorClass = TYPE_COLOR[result.type];

  if (result.type === "material" && result.materialType) {
    switch (result.materialType) {
      case "PLAYLIST": icon = "playlist_play"; colorClass = "text-tertiary bg-tertiary/10"; break;
      case "VIDEO": icon = "play_circle"; colorClass = "text-primary bg-primary/10"; break;
      case "PDF": icon = "picture_as_pdf"; colorClass = "text-error bg-error/10"; break;
      case "LINK": icon = "link"; colorClass = "text-secondary bg-secondary/10"; break;
    }
  }

  return (
    <li role="option">
      <button
        onClick={() => onSelect(result)}
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
}
