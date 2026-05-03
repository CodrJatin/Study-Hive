import React, { Suspense } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen text-on-background font-body overflow-x-hidden transition-colors duration-300">
      <Suspense fallback={<header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 border-b border-surface-container-high z-60" />}>
        <Header />
      </Suspense>
      <div className="pt-16 pb-20 md:pb-0 min-h-screen">
        <Suspense fallback={<div className="p-8 text-center animate-pulse">Loading...</div>}>
          {children}
        </Suspense>
      </div>
      <Suspense fallback={<div className="fixed bottom-0 w-full h-20 bg-surface-container-lowest border-t border-surface-container-high" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}