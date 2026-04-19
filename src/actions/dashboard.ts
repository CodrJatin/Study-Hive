"use server";

import { prisma } from "@/lib/prisma";

export async function getRecentHives(userId: string) {
  const memberships = await prisma.hiveMember.findMany({
    where: { userId },
    orderBy: { lastAccessedAt: "desc" },
    take: 3,
    include: {
      hive: {
        include: {
          units: {
            include: { topics: true }
          },
          deadlines: {
            where: {
              dueDate: { gte: new Date() }
            },
            orderBy: { dueDate: "asc" },
            take: 1
          }
        }
      },
    },
  });

  return memberships.map((m) => m.hive);
}

export async function getUpcomingDeadlines(userId: string) {
  const now = new Date();
  
  const deadlines = await prisma.deadline.findMany({
    where: {
      hive: {
        members: {
          some: { userId },
        },
      },
      dueDate: { gt: now },
    },
    orderBy: { dueDate: "asc" },
    take: 5,
    include: {
      hive: { select: { title: true } },
    },
  });

  return deadlines;
}
