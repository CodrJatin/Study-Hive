import React from "react";
import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { HiveProvider } from "@/components/providers/HiveProviders";
import { redirect } from "next/navigation";

export default async function HiveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    select: { title: true }
  });

  const membership = await prisma.hiveMember.findUnique({
    where: { userId_hiveId: { userId: user.id, hiveId } },
  });

  if (!membership) {
    redirect("/dashboard");
  }

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
