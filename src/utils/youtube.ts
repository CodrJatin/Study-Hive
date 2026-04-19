/**
 * Server-side YouTube Data API v3 utilities.
 * NEVER import this file in client components — it exposes YOUTUBE_API_KEY.
 */

const API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE = "https://www.googleapis.com/youtube/v3";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type YouTubePlaylistItem = {
  id: string;          // YouTube video ID
  title: string;
  durationSeconds: number;
  position: number;    // 1-indexed position in playlist
  thumbnail?: string;
};

export type YouTubeVideoMetadata = {
  type: "video";
  videoId: string;
  title: string;
  channelName: string;
  totalDurationSeconds: number;
  playlistData: null;
};

export type YouTubePlaylistMetadata = {
  type: "playlist";
  playlistId: string;
  title: string;
  channelName: string;
  totalDurationSeconds: number;
  playlistData: YouTubePlaylistItem[];
};

export type YouTubeMetadata = YouTubeVideoMetadata | YouTubePlaylistMetadata;

// ─────────────────────────────────────────────────────────────────
// URL Parsing
// ─────────────────────────────────────────────────────────────────

type ParsedYouTubeUrl =
  | { kind: "video"; id: string }
  | { kind: "playlist"; id: string }
  | null;

export function parseYouTubeUrl(url: string): ParsedYouTubeUrl {
  try {
    const u = new URL(url);

    // Playlist link (list param takes priority)
    const listId = u.searchParams.get("list");
    if (listId) return { kind: "playlist", id: listId };

    // Standard watch URL: youtube.com/watch?v=ID
    const videoId = u.searchParams.get("v");
    if (videoId) return { kind: "video", id: videoId };

    // Short URL: youtu.be/ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return { kind: "video", id };
    }

    // Embed URL: youtube.com/embed/ID
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return { kind: "video", id: embedMatch[1] };

    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// Duration Conversion
// ─────────────────────────────────────────────────────────────────

/**
 * Converts YouTube's ISO 8601 duration (PT1H5M43S) → integer seconds.
 */
export function convertISO8601ToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours   = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// ─────────────────────────────────────────────────────────────────
// Internal API Helpers
// ─────────────────────────────────────────────────────────────────

/** Fetch durations for up to 50 video IDs at once. */
async function fetchVideoDurations(
  videoIds: string[]
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (!videoIds.length) return map;

  // YouTube allows max 50 IDs per request
  const chunks: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  for (const chunk of chunks) {
    const res = await fetch(
      `${BASE}/videos?part=contentDetails&id=${chunk.join(",")}&key=${API_KEY}`
    );
    if (!res.ok) throw new Error(`Videos API error: ${res.status}`);
    const data = await res.json();
    for (const item of data.items ?? []) {
      map.set(item.id, convertISO8601ToSeconds(item.contentDetails.duration));
    }
  }

  return map;
}

/** Paginate through all playlist items and collect video IDs + titles. */
async function fetchAllPlaylistItems(
  playlistId: string
): Promise<{ videoId: string; title: string; position: number; thumbnail?: string }[]> {
  const items: { videoId: string; title: string; position: number; thumbnail?: string }[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: "50",
      key: API_KEY,
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`${BASE}/playlistItems?${params}`);
    if (!res.ok) throw new Error(`PlaylistItems API error: ${res.status}`);
    const data = await res.json();

    for (const item of data.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      if (!videoId) continue;
      items.push({
        videoId,
        title: item.snippet.title ?? "Untitled",
        position: item.snippet.position + 1, // convert to 1-indexed
        thumbnail: item.snippet.thumbnails?.medium?.url,
      });
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

// ─────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────

/**
 * Fetches complete YouTube metadata for a video or playlist URL.
 * Makes server-side API calls only — safe to call from Server Actions.
 */
export async function getYouTubeMetadata(url: string): Promise<YouTubeMetadata> {
  const parsed = parseYouTubeUrl(url);
  if (!parsed) throw new Error("Not a valid YouTube URL");

  // ── Single Video ─────────────────────────────────────────────
  if (parsed.kind === "video") {
    const res = await fetch(
      `${BASE}/videos?part=snippet,contentDetails&id=${parsed.id}&key=${API_KEY}`
    );
    if (!res.ok) throw new Error(`Videos API error: ${res.status}`);
    const data = await res.json();

    const item = data.items?.[0];
    if (!item) throw new Error("Video not found or is private");

    return {
      type: "video",
      videoId: parsed.id,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      totalDurationSeconds: convertISO8601ToSeconds(item.contentDetails.duration),
      playlistData: null,
    };
  }

  // ── Playlist ─────────────────────────────────────────────────
  // 1. Fetch playlist metadata (title, channel)
  const plRes = await fetch(
    `${BASE}/playlists?part=snippet&id=${parsed.id}&key=${API_KEY}`
  );
  if (!plRes.ok) throw new Error(`Playlists API error: ${plRes.status}`);
  const plData = await plRes.json();
  const plItem = plData.items?.[0];
  if (!plItem) throw new Error("Playlist not found or is private");

  // 2. Get all playlist video IDs (paginated)
  const rawItems = await fetchAllPlaylistItems(parsed.id);

  // 3. Batch-fetch durations for all videos
  const videoIds = rawItems.map((i) => i.videoId);
  const durationMap = await fetchVideoDurations(videoIds);

  // 4. Build the full playlist data array
  const playlistData: YouTubePlaylistItem[] = rawItems.map((item) => ({
    id: item.videoId,
    title: item.title,
    durationSeconds: durationMap.get(item.videoId) ?? 0,
    position: item.position,
    thumbnail: item.thumbnail,
  }));

  const totalDurationSeconds = playlistData.reduce(
    (sum, v) => sum + v.durationSeconds,
    0
  );

  return {
    type: "playlist",
    playlistId: parsed.id,
    title: plItem.snippet.title,
    channelName: plItem.snippet.channelTitle,
    totalDurationSeconds,
    playlistData,
  };
}
