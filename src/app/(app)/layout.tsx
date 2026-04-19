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
    </div>
  );
}
