import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-[#F9F9F9] min-h-screen">
      <DashboardSidebar />
      <main className="md:ml-64 p-6 md:p-10 pb-24 md:pb-10 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
