import React, { Suspense } from "react";
import { HiveCard } from "@/components/dashboard/HiveCard";
import { AddHiveCard } from "@/components/dashboard/AddHiveCard";
import { requireUser } from "@/lib/session";
import { getAllHivesCached } from "@/lib/data-access/dashboard";

export default function HivesPage() {
  return (
    <Suspense fallback={<div>Loading hives...</div>}>
      <HivesContent />
    </Suspense>
  );
}

async function HivesContent() {
  const user = await requireUser();

  const hiveMemberships = await getAllHivesCached(user.id);

  const hives = hiveMemberships.map(hive => {
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
