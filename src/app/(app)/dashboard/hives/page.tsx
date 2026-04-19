import React from "react";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { AddHiveCard } from "@/components/dashboard/AddHiveCard";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HivesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const hiveMemberships = await prisma.hiveMember.findMany({
    where: { userId: user.id },
    include: { 
      hive: {
        include: {
          units: {
            include: { topics: true }
          },
          deadlines: {
            where: {
              dueDate: { gte: new Date() } // Only future deadlines
            },
            orderBy: { dueDate: "asc" },
            take: 1
          }
        }
      } 
    },
  });

  const hives = hiveMemberships.map((membership) => {
    const hive = membership.hive;
    const nearestDeadline = hive.deadlines[0];
    
    // Calculate progress
    const allTopics = hive.units.flatMap(u => u.topics);
    const totalTopics = allTopics.length;
    const completedTopics = allTopics.filter(t => t.status === "COMPLETED").length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Calculate days left
    let daysLeft: number | null = null;
    if (nearestDeadline) {
      const diff = nearestDeadline.dueDate.getTime() - new Date().getTime();
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    } else if (hive.targetDate) {
      const diff = hive.targetDate.getTime() - new Date().getTime();
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return {
      ...hive,
      progress,
      daysLeft,
      nextDeadlineText: nearestDeadline
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(nearestDeadline.dueDate)
        : hive.targetDate
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(hive.targetDate)
        : "No deadlines",
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hives.map((hive) => (
        <HiveCard
          key={hive.id}
          hive={{
            id: hive.id,
            title: hive.title,
            description: hive.description || "No description provided.",
            nextDeadline: hive.nextDeadlineText,
            progress: hive.progress,
            daysLeft: hive.daysLeft,
          }}
        />
      ))}
      <AddHiveCard />
    </div>
  );
}
