"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export interface SearchResult {
  id: string;
  title: string;
  type: "hive" | "material" | "topic" | "unit";
  hiveId: string;
  /** For materials — used to build the player deep-link */
  materialId?: string;
  /** Specific material type (VIDEO, PLAYLIST, etc.) */
  materialType?: string;
  /** Subtitle shown under the result title */
  subtitle?: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Fetch the hive IDs this user is a member of so we only search their hives
  const memberships = await prisma.hiveMember.findMany({
    where: { userId: user.id },
    select: { hiveId: true },
  });
  const hiveIds = memberships.map((m) => m.hiveId);
  if (hiveIds.length === 0) return [];

  const q = query.trim();

  // ── Concurrent queries ──────────────────────────────────────────────────────
  const [hives, materials, topics, units] = await Promise.all([
    // Hives the user is a member of whose title matches
    prisma.hive.findMany({
      where: {
        id: { in: hiveIds },
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, subject: true },
      take: 5,
    }),

    // Materials within those hives
    prisma.material.findMany({
      where: {
        hiveId: { in: hiveIds },
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, hiveId: true, type: true },
      take: 5,
    }),

    // Topics within units of those hives
    prisma.topic.findMany({
      where: {
        unit: { hiveId: { in: hiveIds } },
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, unit: { select: { hiveId: true, title: true } } },
      take: 5,
    }),

    // Units within those hives
    prisma.unit.findMany({
      where: {
        hiveId: { in: hiveIds },
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, hiveId: true },
      take: 5,
    }),
  ]);

  // ── Normalise to a flat SearchResult[] ─────────────────────────────────────
  const results: SearchResult[] = [
    ...hives.map((h) => ({
      id: h.id,
      title: h.title,
      type: "hive" as const,
      hiveId: h.id,
      subtitle: h.subject,
    })),

    ...materials.map((m) => ({
      id: m.id,
      title: m.title,
      type: "material" as const,
      hiveId: m.hiveId,
      materialId: m.id,
      materialType: m.type,
      subtitle: m.type.charAt(0) + m.type.slice(1).toLowerCase(),
    })),

    ...topics.map((t) => ({
      id: t.id,
      title: t.title,
      type: "topic" as const,
      hiveId: t.unit.hiveId,
      subtitle: `In ${t.unit.title}`,
    })),

    ...units.map((u) => ({
      id: u.id,
      title: u.title,
      type: "unit" as const,
      hiveId: u.hiveId,
      subtitle: "Syllabus unit",
    })),
  ];

  return results;
}
