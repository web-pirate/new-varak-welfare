import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Same order as Next: .env.local (local Postgres) wins over .env (production). Real env vars, like db:deploy:prod's, win over both.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
