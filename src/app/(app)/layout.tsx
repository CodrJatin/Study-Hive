import React from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-bright min-h-screen text-on-surface font-body overflow-x-hidden">
      <Header />
      <div className="pt-16 pb-20 md:pb-0 min-h-screen">
        {children}
      </div>
      <BottomNav />
      {/* FAB for Quick Actions (Shared across all app routes) */}
      <button className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-16 h-16 rounded-full cta-gradient text-on-primary shadow-2xl flex items-center justify-center group active:scale-90 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">edit</span>
        <span className="absolute right-full mr-4 bg-on-surface text-surface text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Quick Note
        </span>
      </button>
    </div>
  );
}
