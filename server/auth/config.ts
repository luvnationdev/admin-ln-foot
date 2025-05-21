import { env } from '@/env'
import { decodeJwt } from 'jose'
import type { Session, DefaultSession, NextAuthConfig } from 'next-auth'
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
    user: {
      id: string
      roles: ('admin' | 'user')[]
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
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
    async jwt({ token, account }) {
      console.log('JWT callback', { token, account })
      if (account?.access_token) {
        token.accessToken = account.access_token

        const payload = decodeJwt(account.access_token)
        token.roles = (payload.realm_access as { roles: string[] })?.roles ?? [
          'user',
        ]
      }

      return token
    },
    async session({ session, token }) {
      // Pass roles to session
      session.accessToken = token.accessToken as string
      session.user.roles = token.roles as Session['user']['roles']
      console.log({ session, token })
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
