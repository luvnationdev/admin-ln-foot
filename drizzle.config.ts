import { type Config } from "drizzle-kit";
import { env } from "@/env";


/** @type {import("next").NextConfig} */
export default {
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["ln-foot_*"],
  out: './drizzle'
} satisfies Config;
