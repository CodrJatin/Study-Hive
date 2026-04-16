"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { HiveRole } from "@prisma/client"; // Correct import for standard Prisma setups

export async function createHive(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;

    // IMPORTANT: Ensure this ID exists in your 'User' table in Supabase.
    // If you used a different ID in your seed script, update it here.
    const MOCK_USER_ID = "cm0x_mock_user_1";

    try {
        await prisma.hive.create({
            data: {
                title,
                description,
                subject: subject || "General",
                members: {
                    create: {
                        userId: MOCK_USER_ID,
                        role: HiveRole.ADMIN, // Uses the ADMIN enum value from your schema
                    },
                },
            },
        });

        // Revalidate the dashboard so the new HiveCard appears instantly
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to create hive. Make sure the MOCK_USER_ID exists in your database.");
    }
}