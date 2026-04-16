import React from "react";
import Sidebar from "@/components/Sidebar";

export default function HiveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ hiveId: string }>;
}) {
  return (
    <div className="relative">
      <Sidebar />
      <div className="md:ml-64 p-4 md:p-8 pt-6 min-h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );
}
