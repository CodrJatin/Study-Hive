import React from "react";
import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { requireUser, requireHiveMembership } from "@/lib/session";
import { HiveProvider } from "@/components/providers/HiveProviders";

export default async function HiveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;

  // Both helpers are cache()-memoized — single Supabase call covers both,
  // and the membership query is shared with any page that calls requireHiveMembership
  // or getHiveMembership within the same request render tree.
  const [user, membership] = await Promise.all([
    requireUser(),
    requireHiveMembership(hiveId),
  ]);

  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    select: { title: true },
  });

  return (
    <HiveProvider role={membership.role} userId={user.id} hiveId={hiveId}>
      <div className="relative">
        <Sidebar hiveTitle={hive?.title || "StudyHive"} />
        <div className="md:ml-64 p-4 md:p-8 pt-6 min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </HiveProvider>
  );
}
