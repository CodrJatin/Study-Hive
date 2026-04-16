// src/lib/prisma.ts
// Single PrismaClient instance shared across all hot-reloads in dev.
// Prisma v7: connection URL is passed here (not in schema.prisma).
//   - DATABASE_URL → pooled connection via PgBouncer (Supabase "Transaction" mode)
//   - We do NOT use directUrl here; directUrl is only for Prisma Migrate (prisma.config.ts)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // URL is injected via Next.js loading .env which Prisma picks up
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
