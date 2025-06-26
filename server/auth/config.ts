import { env } from '@/env'
import { decodeJwt } from 'jose'
import type { DefaultSession, NextAuthConfig, Session } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      roles: ('admin' | 'user')[]
    } & DefaultSession['user']
    error?: 'RefreshTokenError'
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    KeycloakProvider({
      issuer: env.KEYCLOAK_ISSUER,
      clientId: env.KEYCLOAK_CLIENT_ID,
      authorization: {
        params: {
          scope: 'openid profile email offline_access',
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    signIn({ account }) {
      const idToken = account?.access_token

      if (!idToken) return false
      const payload = decodeJwt(account.access_token)

      const roles = (payload.realm_access as { roles: string[] })?.roles ?? []

      return Array.isArray(roles) && roles.includes('admin')
        ? true
        : `${env.KEYCLOAK_ISSUER}/account`
    },

    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token

        const payload = decodeJwt(account.access_token)
        token.roles = (payload.realm_access as { roles: string[] })?.roles ?? [
          'user',
        ]
      }

      return token
    },

    async session({ token, session }) {
      // Pass roles to session
      session.accessToken = token.accessToken as string
      session.user.roles = token.roles as Session['user']['roles']
      return session
    },

    authorized(params) {
      console.log('Authorizing...', params)

      return !params.auth
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig
