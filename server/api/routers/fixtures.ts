import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import { fixtures as FixturesTable, teams as TeamsTable } from '@/server/db/schema'
import { desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'

export const zFixtureSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  apiSource: z.string().nullable(),
  leagueId: z.string(),
  team1Id: z.string(),
  team2Id: z.string(),
  matchDatetime: z.date(),
  apiFixtureId: z.string().nullable(),
  status: z.string().nullable(),
  score1: z.number().default(0),
  score2: z.number().default(0),
})

export const fixturesRouter = createTRPCRouter({
  latest: publicProcedure.output(z.array(zFixtureSchema)).query(async () => {
    const matches = await db.query.fixtures.findMany({
      orderBy: [desc(FixturesTable.matchDatetime)],
      limit: 10,
    })
    const teams = await db.query.teams.findMany({
      where: inArray(
        TeamsTable.id,
        matches
          .map((match) => match.team1Id ?? '')
          .concat(matches.map((match) => match.team2Id ?? ''))
      ),
    })

    const formattedMatches = await Promise.all(
      matches.map(async (match) => {
        const team1 = teams.find((team) => team.id === match.team1Id)
        const team2 = teams.find((team) => team.id === match.team2Id)
        return {
          ...match,
          team1: team1?.teamName ?? null,
          team2: team2?.teamName ?? null,
        }
      })
    )

    return formattedMatches
  }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(zFixtureSchema.optional())
    .query(async ({ input }) => {
      const match = await db.query.fixtures.findFirst({
        where: eq(FixturesTable.id, input.id),
      })
      return match
    }),
  createFixture: adminProcedure
    .input(
      z.object({
        matchDatetime: z.date(),
        team1Id: z.string(),
        team2Id: z.string(),
        leagueId: z.string(),
        score1: z.number().optional().default(0),
        score2: z.number().optional().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const match = await db.insert(FixturesTable).values({
        ...input,
      })
      return match
    }),
  updateFixture: adminProcedure
    .input(
      z.object({
        id: z.string(),
        matchDatetime: z.date().optional(),
        team1Id: z.string().optional(),
        team2Id: z.string().optional(),
        leagueId: z.string().optional(),
        score1: z.number().optional(),
        score2: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const match = await db
        .update(FixturesTable)
        .set({ ...input })
        .where(eq(FixturesTable.id, input.id))
      return match
    }),
  updateFixtures: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(FixturesTable).where(eq(FixturesTable.id, input.id))
      return { success: true }
    }),
})
