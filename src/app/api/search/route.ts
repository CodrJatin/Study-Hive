import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import type { SearchResult } from "@/types/search";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();

  // Enforce minimum length server-side — no round trip for short queries
  if (q.length < 3) {
    return NextResponse.json([] as SearchResult[]);
  }

  // ── Auth guard ───────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json([] as SearchResult[], { status: 401 });
  }

  // ── Scope to hives the user is a member of ──────────────────────────────────
  const memberships = await prisma.hiveMember.findMany({
    where: { userId: user.id },
    select: { hiveId: true },
  });
  const hiveIds = memberships.map((m) => m.hiveId);
  if (hiveIds.length === 0) {
    return NextResponse.json([] as SearchResult[]);
  }

  // ── Parallel queries ─────────────────────────────────────────────────────────
  const [hives, materials, topics, units] = await Promise.all([
    prisma.hive.findMany({
      where: { id: { in: hiveIds }, title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true },
      take: 5,
    }),
    prisma.material.findMany({
      where: {
        OR: [{ hiveId: { in: hiveIds } }, { hiveId: null, userId: user.id }],
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, hiveId: true, type: true },
      take: 10,
    }),
    prisma.topic.findMany({
      where: {
        unit: { hiveId: { in: hiveIds } },
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, unit: { select: { hiveId: true, title: true } } },
      take: 5,
    }),
    prisma.unit.findMany({
      where: { hiveId: { in: hiveIds }, title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true, hiveId: true },
      take: 5,
    }),
  ]);

  // ── Normalise ────────────────────────────────────────────────────────────────
  const results: SearchResult[] = [
    ...hives.map((h) => ({
      id: h.id,
      title: h.title,
      type: "hive" as const,
      hiveId: h.id,
      subtitle: "Workspace",
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

  return NextResponse.json(results);
}
