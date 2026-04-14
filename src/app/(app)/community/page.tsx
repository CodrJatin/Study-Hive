import TopBar from "@/components/TopBar";
import ProgressBar from "@/components/ProgressBar";
import { hiveMembers } from "@/lib/data";
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  Star,
  Clock,
  Users,
  Trophy,
} from "lucide-react";

const posts = [
  {
    id: "p1",
    author: "Zoe Kim",
    initials: "ZK",
    avatarColor: "#fdc003",
    time: "2h ago",
    content:
      "Just finished the \"Chemical Bonds\" topic — the interactive diagram in the resources section is 🔥. Highly recommend before the mid-sems!",
    likes: 12,
    replies: 3,
    badge: "💡 Tip",
  },
  {
    id: "p2",
    author: "Marcus Lee",
    initials: "ML",
    avatarColor: "#f288ff",
    time: "5h ago",
    content:
      "Can someone explain the difference between endergonic and exergonic reactions simply? I keep mixing them up in practice questions.",
    likes: 4,
    replies: 7,
    badge: "❓ Question",
  },
  {
    id: "p3",
    author: "Priya Shah",
    initials: "PS",
    avatarColor: "#b3d4ff",
    time: "Yesterday",
    content:
      "Here's my summary of Unit 1 topicsI've compiled it as a one-page cheat sheet. Check it in Resources!",
    likes: 24,
    replies: 5,
    badge: "📄 Resource",
  },
];

export default function CommunityPage() {
  return (
    <>
      <TopBar title="Community" subtitle="The Hive – 5 members active" />

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Feed ── */}
        <section className="lg:col-span-2 flex flex-col gap-4 animate-fade-up">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Hive Feed
            </h2>
            <button id="community-post" className="btn-primary text-xs py-2 px-4">
              <MessageSquare className="w-3.5 h-3.5" /> Post
            </button>
          </div>

          {posts.map((post) => (
            <div key={post.id} className="clay-card p-4">
              <div className="flex items-start gap-3">
                <div className="avatar w-9 h-9 text-sm flex-shrink-0"
                  style={{ background: post.avatarColor, color: "var(--color-on-primary-container)" }}>
                  {post.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                      {post.author}
                    </span>
                    <span className="badge" style={{ background: "var(--color-surface-container)", color: "var(--color-on-surface-variant)" }}>
                      {post.badge}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] ml-auto"
                      style={{ color: "var(--color-on-surface-variant)" }}>
                      <Clock className="w-3 h-3" /> {post.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface)" }}>
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="btn-ghost text-xs py-1 px-3">
                      <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
                    </button>
                    <button className="btn-ghost text-xs py-1 px-3">
                      <MessageSquare className="w-3.5 h-3.5" /> {post.replies}
                    </button>
                    <button className="btn-ghost text-xs py-1 px-3 ml-auto">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── Right: Leaderboard + Members ── */}
        <div className="flex flex-col gap-4 animate-fade-up delay-200">
          {/* Leaderboard */}
          <div className="clay-card-flat p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Hive Leaderboard
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {[...hiveMembers]
                .sort((a, b) => b.progress - a.progress)
                .map((member, i) => (
                  <div key={member.id} className="flex items-center gap-2.5">
                    <span className="w-5 text-center text-xs font-bold flex-shrink-0"
                      style={{
                        color: i === 0
                          ? "var(--color-primary)"
                          : i === 1
                          ? "var(--color-secondary)"
                          : "var(--color-on-surface-variant)",
                        fontFamily: "var(--font-plus-jakarta), sans-serif",
                      }}>
                      #{i + 1}
                    </span>
                    <div className="avatar w-7 h-7 text-[11px] flex-shrink-0"
                      style={{ background: member.color, color: "var(--color-on-primary-container)" }}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate">{member.name}</span>
                        <span className="text-[10px] flex-shrink-0" style={{ color: "var(--color-on-surface-variant)" }}>
                          {member.progress}%
                        </span>
                      </div>
                      <ProgressBar value={member.progress} height="sm" className="mt-0.5" />
                    </div>
                    {member.role === "admin" && (
                      <Star className="w-3 h-3 flex-shrink-0" style={{ color: "var(--color-primary-container)" }} fill="currentColor" />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Stats */}
          <div className="clay-card-flat p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
              <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Hive Stats
              </h3>
            </div>
            {[
              { label: "Posts this week", value: "18" },
              { label: "Resources shared", value: "7" },
              { label: "Questions answered", value: "12" },
              { label: "Active members", value: "5/5" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b last:border-0"
                style={{ borderColor: "var(--color-surface-container)" }}>
                <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>{label}</span>
                <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
