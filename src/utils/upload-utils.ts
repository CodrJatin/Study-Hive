import { createClient } from "@/utils/supabase/client";
import { createMaterial } from "@/actions/materials";
import { MaterialType } from "@prisma/client";

export async function uploadFiles(files: File[], hiveId: string | undefined): Promise<void> {
  const supabase = createClient();
  const targetHiveId = hiveId && hiveId.trim() !== "" ? hiveId : undefined;

  let successCount = 0;
  let lastError: string | null = null;

  for (const file of files) {
    try {
      const path = `${targetHiveId ?? "personal"}/${Date.now()}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from("hive-materials")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (storageError) {
        lastError = `Storage error on "${file.name}": ${storageError.message}`;
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("hive-materials")
        .getPublicUrl(path);

      let type: MaterialType = MaterialType.LINK;
      if (file.type.includes("pdf")) type = MaterialType.PDF;
      else if (file.type.startsWith("image/")) type = MaterialType.IMAGE;
      else if (file.type.includes("video")) type = MaterialType.VIDEO;
      else if (file.type.includes("word") || file.type.includes("document"))
        type = MaterialType.DOC;

      const result = await createMaterial(
        file.name.replace(/\.[^.]+$/, ""),
        type,
        targetHiveId,
        publicData.publicUrl,
        file.size
      );

      if (result?.error) {
        lastError = result.error;
      } else {
        successCount++;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  if (successCount === 0) {
    throw new Error(lastError ?? "All uploads failed");
  }

  // Partial success — still resolves, but the toast message reflects it
  if (lastError) {
    (globalThis as { __lastUploadPartial?: { successCount: number; total: number } }).__lastUploadPartial = {
      successCount,
      total: files.length,
    };
  }
}
