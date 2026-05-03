export const HIVE_ROLES = ["ADMIN", "MODERATOR", "MEMBER", "VIEWER"] as const;
export type HiveRole = (typeof HIVE_ROLES)[number];

export const MATERIAL_TYPES = ["LINK", "PDF", "IMAGE", "VIDEO", "DOC", "PLAYLIST"] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number];

export const TOPIC_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;
export type TopicStatus = (typeof TOPIC_STATUSES)[number];

export interface ClientTask {
  id: string;
  title: string;
  dueDate: Date | string | null;
  isCompleted: boolean;
  hiveId: string | null;
  materialId: string | null;
  hive?: {
    title: string;
  } | null;
  material?: {
    title: string;
  } | null;
}

export interface ClientAnnouncement {
  id: string;
  hiveId: string;
  authorId: string;
  title: string;
  createdAt: Date | string;
}

export interface ClientTopic {
  id: string;
  title: string;
  duration: string | null;
  creatorId: string | null;
}

export interface ClientUnit {
  id: string;
  title: string;
  creatorId: string | null;
}
