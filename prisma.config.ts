// prisma.config.ts
// In Prisma v7, connection URLs live here, NOT in schema.prisma.
// - `url`       → used by the CLI for migrations (needs a direct, non-pooled connection)
// - Prisma Client at runtime gets its URL from the PrismaClient constructor (see src/lib/prisma.ts)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // For migrations we use DIRECT_URL (bypasses PgBouncer — required by Prisma Migrate)
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"] ?? "",
  },
});
