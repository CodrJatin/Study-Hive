import "server-only";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const formatTitle = (filename: string) => {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[_-]/g, " ")    // Replace underscores/dashes with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize
};

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), "public", "audio");
    
    // Check if the directory exists
    if (!fs.existsSync(audioDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(audioDir);
    const audioFiles = files.filter((file) => 
      file.endsWith(".mp3") || file.endsWith(".wav") || file.endsWith(".m4a") || file.endsWith(".mpeg")
    );

    const playlist = audioFiles.map((file, index) => ({
      id: index + 1,
      title: formatTitle(file),
      src: `/audio/${file}`,
    }));

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error reading audio directory:", error);
    return NextResponse.json([]);
  }
}
