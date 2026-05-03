"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/types/search";
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
  if (result.type === "material") {
    if (result.hiveId) return `/hive/${result.hiveId}/materials/${result.id}`;
    return `/dashboard/materials/${result.id}`;
  }
  if (result.type === "hive") return `/hive/${result.id}`;
  if (result.hiveId) return `/hive/${result.hiveId}/syllabus`;
  return "/dashboard";
}

export function HeaderSearch({ isMobile }: { isMobile?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [resultsFor, setResultsFor] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const hasMinLength = trimmed.length >= 3;
  const isOpen = hasMinLength;
  // "pending" while debounce hasn't fired yet OR a fetch is in-flight
  const isTypingOrSearching = hasMinLength && (isFetching || trimmed !== resultsFor);

  // ── Abortable fetch ───────────────────────────────────────────────────────
  const runSearch = useCallback((q: string) => {
    const t = q.trim();
    if (t.length < 3) {
      setResults([]);
      setResultsFor("");
      return;
    }

    // Cancel any in-flight request before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsFetching(true);
    fetch(`/api/search?q=${encodeURIComponent(t)}`, { signal: controller.signal })
      .then((res) => res.json() as Promise<SearchResult[]>)
      .then((data) => {
        setResults(data);
        setResultsFor(t);
      })
      .catch((err) => {
        // AbortError is expected on query change — swallow it silently
        if (err instanceof Error && err.name !== "AbortError") {
          setResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!hasMinLength) {
      abortRef.current?.abort();
      setResults([]);
      setResultsFor("");
      setIsFetching(false);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, runSearch]);

  // Abort on unmount
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isMobile) setIsMobileSearchActive(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile]);

  // ── Keyboard: Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isMobile) setIsMobileSearchActive(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobile]);

  function handleSelect(result: SearchResult) {
    setIsMobileSearchActive(false);
    setQuery("");
    setResults([]);
    setResultsFor("");
    router.push(buildHref(result));
  }

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

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div ref={containerRef} className="flex items-center">
        <button
          onClick={() => setIsMobileSearchActive(!isMobileSearchActive)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isMobileSearchActive ? "bg-primary text-on-primary" : "hover:bg-surface-container-high text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">{isMobileSearchActive ? "close" : "search"}</span>
        </button>

        {isMobileSearchActive && (
          <div className="fixed top-16 left-0 right-0 bg-surface-container-lowest/98 backdrop-blur-xl border-b border-outline-variant/10 p-4 z-50 animate-in slide-in-from-top-2 duration-200">
            <Dropdown
              options={options}
              isOpen={isOpen}
              onOpenChange={() => {}}
              disableTriggerClick
              isLoading={isTypingOrSearching}
              loadingMessage={loadingMessage}
              emptyMessage={emptyMessage}
              menuClassName="w-full left-0 right-0 max-h-[70vh] shadow-xl border-outline-variant/10 !mt-2"
              trigger={
                <div className="flex items-center bg-surface-container-high px-4 py-2 rounded-2xl ring-2 ring-primary/20">
                  <span className={`material-symbols-outlined mr-3 text-lg ${isFetching ? "animate-pulse text-primary" : "text-on-surface-variant"}`}>
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
                    <button onClick={() => { setQuery(""); setResults([]); setResultsFor(""); }}>
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

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      <Dropdown
        options={options}
        isOpen={isOpen}
        onOpenChange={() => {}}
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
                isFetching ? "text-primary animate-pulse" : "text-on-surface-variant"
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
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults([]); setResultsFor(""); }}
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
