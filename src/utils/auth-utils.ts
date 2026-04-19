import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the current request has a valid Supabase user that also exists in our Prisma database.
 * Returns the Prisma user object or throws an error.
 */
export async function ensurePrismaUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authorization required. Please log in.");
  }

  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!prismaUser) {
    throw new Error("User profile not found. Please try logging in again.");
  }

  return prismaUser;
}
