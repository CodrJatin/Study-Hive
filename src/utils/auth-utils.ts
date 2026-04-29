import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the current request has a valid Supabase user that also exists in our Prisma database.
 * Uses upsert so it works for both new OAuth logins and returning email/password users.
 * Returns the Prisma user object or throws an error.
 */
export async function ensurePrismaUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authorization required. Please log in.");
  }

  const { full_name, name, avatar_url, picture } = user.user_metadata || {};
  const userImage = avatar_url || picture || null;

  const prismaUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { 
      email: user.email!,
      ...(userImage && { image: userImage }),
    },
    create: {
      id: user.id,
      email: user.email!,
      name: full_name || name || "Student",
      image: userImage,
    },
  });

  return prismaUser;
}
