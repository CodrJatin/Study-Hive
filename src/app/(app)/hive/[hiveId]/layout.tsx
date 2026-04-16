import React from "react";
import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";

export default async function HiveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;
  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    select: { title: true }
  });

  return (
    <div className="relative">
      <Sidebar hiveTitle={hive?.title || "StudyHive"} />
      <div className="md:ml-64 p-4 md:p-8 pt-6 min-h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );
}
