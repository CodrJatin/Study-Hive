"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TrackType } from "@prisma/client";

export async function createTrack(hiveId: string, formData: FormData) {
  const name = formData.get("title") as string;
  const materials = formData.getAll("materialIds") as string[];

  if (!name) {
    throw new Error("Missing name");
  }

  // Create a track. Since track topics are Topics, and materials in the modal were
  // actually materials, we'll just create placeholder topics in a new Unit or just
  // map to existing topics if we had them. For now, create dummy topics.
  
  await prisma.track.create({
    data: {
      name,
      type: TrackType.CUSTOM,
      hiveId,
      trackTopics: {
        create: materials.map((mId, index) => ({
          position: index,
          topic: {
            create: {
              title: `Topic for Material ${mId.substring(0, 4)}`,
              unit: {
                create: {
                  title: `Track Unit: ${name}`,
                  hiveId
                }
              }
            }
          }
        }))
      }
    },
  });

  revalidatePath(`/hive/${hiveId}/tracks`);
}
