import React from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen text-on-background font-body overflow-x-hidden transition-colors duration-300">
      <Header />
      <div className="pt-16 pb-20 md:pb-0 min-h-screen">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
