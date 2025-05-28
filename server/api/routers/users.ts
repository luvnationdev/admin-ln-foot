import { env } from '@/env'
import KcAdminClient from '@keycloak/keycloak-admin-client'
import type { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation'
import { z } from 'zod'
import { adminProcedure, createTRPCRouter } from '../trpc'

async function authenticate() {
  const kcAdmin = new KcAdminClient({
    baseUrl: env.KC_ADMIN_URL,
    realmName: 'master',
  })
  await kcAdmin.auth({
    username: process.env.KC_ADMIN_USERNAME,
    password: process.env.KC_ADMIN_PASSWORD,
    grantType: 'password',
    clientId: 'admin-cli',
  })

  return kcAdmin
}

export const usersRouter = createTRPCRouter({
  list: adminProcedure
    .use(async ({ next, ctx, ...rest }) => {
      const kcAdmin = await authenticate()
      return next({ ...rest, ctx: { ...ctx, kcAdmin } })
    })
    .query(async ({ ctx: { kcAdmin } }) => {
      const users = await kcAdmin.users.find({ realm: env.KC_REALM_NAME })
      const userRoles = await Promise.all(
        users.map(async (user) => ({
          id: user.id!,
          roles: await kcAdmin.users.listRealmRoleMappings({
            id: user.id!,
            realm: env.KC_REALM_NAME,
          }),
        }))
      )

      return users.map((user) => ({
        ...user,
        attributes: {
          roles: userRoles
            .find((_) => _.id === user.id)
            ?.roles.map((role) => role.name),
        },
      }))
    }),

  assignRole: adminProcedure
    .input(z.object({ userId: z.string(), roleName: z.string() }))
    .use(async ({ next, ctx, ...rest }) => {
      const kcAdmin = await authenticate()
      return next({ ...rest, ctx: { ...ctx, kcAdmin } })
    })
    .mutation(async ({ input, ctx: { kcAdmin } }) => {
      if (!input.userId || !input.roleName) {
        throw new Error('User ID and Role Name are required')
      }

      const roles = await kcAdmin.roles.findOneByName({
        realm: env.KC_REALM_NAME,
        name: input.roleName,
      })

      await kcAdmin.users.addRealmRoleMappings({
        realm: env.KC_REALM_NAME,
        id: input.userId,
        roles: [roles as RoleMappingPayload],
      })

      return { success: true }
    }),

  removeRole: adminProcedure
    .input(z.object({ userId: z.string(), roleName: z.string() }))
    .use(async ({ next, ctx, ...rest }) => {
      const kcAdmin = await authenticate()
      return next({ ...rest, ctx: { ...ctx, kcAdmin } })
    })
    .mutation(async ({ input, ctx: { kcAdmin } }) => {
      const [role] = await kcAdmin.roles.find({
        search: input.roleName,
        realm: env.KC_REALM_NAME,
      })

      if (!role) throw new Error('Rôle non trouvé')

      await kcAdmin.users.delRealmRoleMappings({
        id: input.userId,
        realm: env.KC_REALM_NAME,
        roles: [role as RoleMappingPayload],
      })

      return { success: true }
    }),

  toggleActivation: adminProcedure
    .input(z.object({ userId: z.string(), enable: z.boolean() }))
    .use(async ({ next, ctx, ...rest }) => {
      const kcAdmin = await authenticate()
      return next({ ...rest, ctx: { ...ctx, kcAdmin } })
    })

    .mutation(async ({ input, ctx: { kcAdmin } }) => {
      await kcAdmin.users.update(
        { id: input.userId, realm: env.KC_REALM_NAME },
        { enabled: input.enable }
      )
      return { success: true }
    }),
})
