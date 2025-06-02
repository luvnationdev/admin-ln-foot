import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    DATABASE_URL: z.string().url(),
    DATABASE_SCHEMA: z.string().default('landing'),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    KEYCLOAK_CLIENT_ID: z.string(),
    KEYCLOAK_ISSUER: z.string(),
    API_SPORTS_KEY: z.string(),
    API_SPORTS_URL: z.string(),
    MINIO_ENDPOINT: z.string(),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_SECRET_KEY: z.string(),
    KC_ADMIN_USERNAME: z.string(),
    KC_ADMIN_PASSWORD: z.string(),
    KC_ADMIN_URL: z.string(),
    KC_REALM_NAME: z.string().default('lnfoot'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_SCHEMA: process.env.DATABASE_SCHEMA,
    NODE_ENV: process.env.NODE_ENV,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    KC_ADMIN_USERNAME: process.env.KC_ADMIN_USERNAME,
    KC_ADMIN_PASSWORD: process.env.KC_ADMIN_PASSWORD,
    KC_ADMIN_URL: process.env.KC_ADMIN_URL,
    KC_REALM_NAME: process.env.KC_REALM_NAME,
    API_SPORTS_KEY: process.env.API_SPORTS_KEY,
    API_SPORTS_URL: process.env.API_SPORTS_URL,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
