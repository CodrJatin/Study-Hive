import React, { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-background min-h-screen">
      <Suspense fallback={<div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/10" />}>
        <DashboardSidebar />
      </Suspense>
      <main className="md:ml-64 p-6 md:p-10 pb-24 md:pb-10 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
