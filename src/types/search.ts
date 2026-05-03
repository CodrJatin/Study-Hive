/** Shared between the search route handler and client components. */
export interface SearchResult {
  id: string;
  title: string;
  type: "hive" | "material" | "topic" | "unit";
  hiveId: string | null;
  /** For materials — used to build the player deep-link */
  materialId?: string;
  /** Specific material type (VIDEO, PLAYLIST, etc.) */
  materialType?: string;
  /** Subtitle shown under the result title */
  subtitle?: string;
}
