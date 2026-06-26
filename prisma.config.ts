import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  engine: "classic",
  datasource: {
    url: env("POSTGRES_PRISMA_URL"),
    shadowDatabaseUrl: env("POSTGRES_URL_NON_POOLING"),
  },
});
