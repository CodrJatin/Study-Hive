import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "StudyHive/1.0 (title-fetcher)" },
    });
    clearTimeout(timeout);

    const html = await res.text();
    // Try og:title first, then <title>
    const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = ogMatch?.[1]?.trim() || titleMatch?.[1]?.trim() || null;

    return NextResponse.json({ title });
  } catch {
    return NextResponse.json({ title: null });
  }
}
