import {
  adminProcedure,
  createTRPCRouter
} from '@/server/api/trpc'
import { db } from '@/server/db'
import { teams as TeamsTable } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const teamRouter = createTRPCRouter({
  createIfNotExists: adminProcedure
    .input(
      z.object({
        apiTeamId: z.string(),
        name: z.string(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db.query.teams.findFirst({
        where: eq(TeamsTable.apiTeamId, input.apiTeamId),
      })

      if (existing) return existing.id

      const created = await db.insert(TeamsTable).values({
        teamName: input.name,
        apiTeamId: input.apiTeamId,
        logoUrl: input.logoUrl,
      })

      return created
    }),
})
