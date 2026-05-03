import { Icon } from "@/components/ui/Icon";
import { AnnouncementCard } from "./AnnouncementCard";
import { AnnouncementRealtimeListener } from "./AnnouncementRealtimeListener";
import type { ClientAnnouncement } from "@/types/client-prisma";

// Define the type to include the author relation
type AnnouncementWithAuthor = ClientAnnouncement & {
  author: {
    name: string | null;
    image: string | null;
    avatarColor: string | null;
    avatarType: string | null;
  };
};

interface AnnouncementsClientListProps {
  initialAnnouncements: AnnouncementWithAuthor[];
  hiveId: string;
}

export function AnnouncementsClientList({
  initialAnnouncements,
  hiveId
}: AnnouncementsClientListProps) {
  return (
    <>
      <AnnouncementRealtimeListener hiveId={hiveId} />
      <div className="space-y-4">
        {initialAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={{
              id: announcement.id,
              hiveId: announcement.hiveId,
              authorId: announcement.authorId,
              title: announcement.title,
              timeAgo: new Intl.DateTimeFormat("en-IN", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: "Asia/Kolkata",
              }).format(new Date(announcement.createdAt)),
              authorInitials: announcement.author?.name
                ? announcement.author.name.charAt(0).toUpperCase()
                : "?",
              authorName: announcement.author?.name || "Unknown Author",
              authorImage: announcement.author?.image,
              authorAvatarColor: announcement.author?.avatarColor || "#fdc003",
              authorAvatarType: announcement.author?.avatarType || "image",
            }}
          />
        ))}

        {initialAnnouncements.length === 0 && (
          <div className="bg-surface-container-low rounded-3xl p-10 border border-outline-variant/10 flex flex-col items-center justify-center gap-4 clay-inset">
            <Icon name="campaign" className="text-on-surface-variant/10 text-6xl" />
            <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-xs">No announcements yet</p>
          </div>
        )}
      </div>
    </>
  );
}
