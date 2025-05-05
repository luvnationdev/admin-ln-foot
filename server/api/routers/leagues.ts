import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import {
  leagues as LeaguesTable,
  type matchs as MatchesTable,
} from '@/server/db/schema'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { zMatchSchema } from './matchs'

export const zLeagueSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  sportId: z.string().nullable(),
  leagueName: z.string(),
  country: z.string(),
  tier: z.number().nullable(),
  apiSource: z.string().nullable(),
  apiLeagueId: z.string().nullable(),
  logoUrl: z.string().nullable(),
  matches: z.array(zMatchSchema),
})

export const leaguesRouter = createTRPCRouter({
  list: publicProcedure
    .output(z.array(zLeagueSchema))
    .query(async () => {
      const leagues = await db.query.leagues.findMany({
        orderBy: [desc(LeaguesTable.createdAt)],
        with: {
          matches: true,
        },
      })
      return leagues.map(
        (
          league: typeof LeaguesTable.$inferSelect & {
            matches: (typeof MatchesTable.$inferSelect)[]
          }
        ) => ({
          ...league,
          matches: league.matches.filter(
            (match) => match?.matchDatetime && match.matchDatetime > new Date()
          ),
        })
      )
    }),
  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(zLeagueSchema.optional())
    .query(async ({ input }) => {
      const league = await db.query.leagues.findFirst({
        with: { matches: true },
        where: eq(LeaguesTable.id, input.id),
      })
      if (league) {
        return {
          ...league,
          matches: (
            league.matches as (typeof MatchesTable.$inferSelect)[]
          ).filter(
            (match) => match?.matchDatetime && match.matchDatetime > new Date()
          ),
        }
      }
    }),
  createLeague: adminProcedure
    .input(
      z.object({
        leagueName: z.string(),
        country: z.string(),
        tier: z.number().optional(),
        apiSource: z.string().optional(),
        apiLeagueId: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const league = await db.insert(LeaguesTable).values({
        ...input,
      })
      return league
    }),
  updateLeague: adminProcedure
    .input(
      z.object({
        id: z.string(),
        leagueName: z.string().optional(),
        country: z.string().optional(),
        tier: z.number().optional(),
        apiSource: z.string().optional(),
        apiLeagueId: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const league = await db
        .update(LeaguesTable)
        .set({ ...input })
        .where(eq(LeaguesTable.id, input.id))
      return league
    }),
  deleteLeague: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(LeaguesTable).where(eq(LeaguesTable.id, input.id))
      return { success: true }
    }),
})
