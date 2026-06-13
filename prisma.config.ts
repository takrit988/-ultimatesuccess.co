import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});

