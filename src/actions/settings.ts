"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type SettingsError = { error: string };

/**
 * Updates the user preferences (theme, autoPlay, avatarColor) directly on the User model.
 */
export async function updatePreferences(
  _prevState: SettingsError | null,
  formData: FormData
): Promise<SettingsError | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  const theme = (formData.get("theme") as string) || "system";
  const autoPlayHum = formData.get("autoPlayHum") === "true";
  const avatarColor = (formData.get("avatarColor") as string) || "#fdc003";
  const avatarType = (formData.get("avatarType") as string) || "image";

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { theme, autoPlayHum, avatarColor, avatarType },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/(app)/hive/[hiveId]");
    return null;
  } catch (err) {
    console.error("Update Preferences Error:", err);
    return { error: "Failed to save preferences. Please try again." };
  }
}

/**
 * Updates the User record (e.g. name) for the authenticated user.
 */
export async function updateProfile(
  formData: FormData
): Promise<SettingsError | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Authorization required" };

  const name = formData.get("name") as string;

  if (!name || name.trim().length < 2) {
    return { error: "Name must be at least 2 characters long." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
    });

    revalidatePath("/dashboard/settings");
    return null;
  } catch (err) {
    console.error("Update Profile Error:", err);
    return { error: "Failed to update profile. Please try again." };
  }
}

