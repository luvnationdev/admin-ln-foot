import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import { matchs as MatchesTable, teams as TeamsTable } from '@/server/db/schema'
import { desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'

export const zMatchSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  apiSource: z.string().nullable(),
  leagueId: z.string(),
  team1Id: z.string(),
  team2Id: z.string(),
  matchDatetime: z.date(),
  apiMatchId: z.string().nullable(),
  status: z.string().nullable(),
  score1: z.number().default(0),
  score2: z.number().default(0),
})

export const matchsRouter = createTRPCRouter({
  latest: publicProcedure.output(z.array(zMatchSchema)).query(async () => {
    const matches = await db.query.matchs.findMany({
      orderBy: [desc(MatchesTable.matchDatetime)],
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
    .output(zMatchSchema.optional())
    .query(async ({ input }) => {
      const match = await db.query.matchs.findFirst({
        where: eq(MatchesTable.id, input.id),
      })
      return match
    }),
  createMatch: adminProcedure
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
      const match = await db.insert(MatchesTable).values({
        ...input,
      })
      return match
    }),
  updateMatch: adminProcedure
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
        .update(MatchesTable)
        .set({ ...input })
        .where(eq(MatchesTable.id, input.id))
      return match
    }),
  deleteMatch: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(MatchesTable).where(eq(MatchesTable.id, input.id))
      return { success: true }
    }),
})
