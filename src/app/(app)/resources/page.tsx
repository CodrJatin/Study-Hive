import TopBar from "@/components/TopBar";
import { FileText, Link2, Video, Upload, Search } from "lucide-react";

const resources = [
  { id: "r1", title: "Molecular Biology Diagram Pack", type: "PDF", size: "4.2 MB", topic: "Unit 1", icon: FileText, color: "primary" as const },
  { id: "r2", title: "MIT OpenCourseWare – Cell Biology", type: "Link", size: null, topic: "Unit 2", icon: Link2, color: "secondary" as const },
  { id: "r3", title: "Krebs Cycle Explained – Crash Course", type: "Video", size: "42 min", topic: "Unit 3", icon: Video, color: "tertiary" as const },
  { id: "r4", title: "Zoe's Cheat Sheet – Unit 1", type: "PDF", size: "1.1 MB", topic: "Unit 1", icon: FileText, color: "primary" as const },
];

const colorMap = {
  primary: { bg: "var(--color-primary-container)", text: "var(--color-on-primary-container)" },
  secondary: { bg: "var(--color-secondary-container)", text: "var(--color-on-secondary-container)" },
  tertiary: { bg: "var(--color-tertiary-container)", text: "var(--color-on-tertiary-container)" },
};

export default function ResourcesPage() {
  return (
    <>
      <TopBar title="Resources" subtitle="Shared files, links, and media for the hive" />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-5 animate-fade-up">
          <div className="clay-inset flex items-center gap-2 px-4 py-2.5 flex-1 max-w-sm mr-3">
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-outline)" }} />
            <input type="text" placeholder="Search resources…"
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-[var(--color-outline)]" />
          </div>
          <button id="resources-upload" className="btn-primary text-xs">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-100">
          {resources.map((r) => {
            const c = colorMap[r.color];
            return (
              <div key={r.id} className="clay-card p-4 cursor-pointer">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: c.bg }}>
                  <r.icon className="w-5 h-5" style={{ color: c.text }} />
                </div>
                <h3 className="text-sm font-semibold mb-1 leading-snug"
                  style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {r.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge" style={{ background: c.bg, color: c.text }}>
                    {r.type}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--color-on-surface-variant)" }}>
                    {r.topic}
                  </span>
                  {r.size && (
                    <span className="text-[10px] ml-auto" style={{ color: "var(--color-on-surface-variant)" }}>
                      {r.size}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
