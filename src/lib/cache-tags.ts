/**
 * Central tag-name factory for cache invalidation.
 *
 * Every `cacheTag()` call in data-access functions and every `updateTag()`
 * call in Server Actions MUST use these helpers to prevent typos and
 * ensure consistency.
 */
export const CacheTags = {
  // ── User-scoped ──────────────────────────────────────────────────
  userTasks:     (userId: string) => `user:${userId}:tasks`,
  userHives:     (userId: string) => `user:${userId}:hives`,
  userMaterials: (userId: string) => `user:${userId}:materials`,
  userDeadlines: (userId: string) => `user:${userId}:deadlines`,
  userSettings:  (userId: string) => `user:${userId}:settings`,

  // ── Hive-scoped ──────────────────────────────────────────────────
  hiveMaterials: (hiveId: string) => `hive:${hiveId}:materials`,
  hiveSyllabus:  (hiveId: string) => `hive:${hiveId}:syllabus`,
  hiveOverview:  (hiveId: string) => `hive:${hiveId}:overview`,
  hiveSettings:  (hiveId: string) => `hive:${hiveId}:settings`,
  hiveTracks:    (hiveId: string) => `hive:${hiveId}:tracks`,
} as const;
