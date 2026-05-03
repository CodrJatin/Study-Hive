import React from "react";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { AddHiveCard } from "@/components/dashboard/AddHiveCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function HivesPage() {
  const user = await requireUser();

  const hiveMemberships = await prisma.hiveMember.findMany({
    where: { userId: user.id },
    include: {
      hive: {
        include: {
          deadlines: {
            where: {
              dueDate: { gte: new Date() }
            },
            orderBy: {
              dueDate: 'asc'
            },
            take: 1
          }
        }
      }
    },
    orderBy: {
      lastAccessedAt: 'desc'
    }
  });

  const hives = hiveMemberships.map(hm => {
    const hive = hm.hive;
    const nearestDeadline = hive.deadlines?.[0];

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
      id: hive.id,
      title: hive.title,
      description: hive.description || "No description provided.",
      icon: hive.icon,
      daysLeft,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hives.map((hive) => (
        <HiveCard key={hive.id} hive={hive} />
      ))}
      <AddHiveCard />
    </div>
  );
}
