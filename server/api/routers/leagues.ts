import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure
} from '@/server/api/trpc'
import { db } from '@/server/db'
import {
  leagues as LeaguesTable,
  fixtures as FixturesTable,
  teams as TeamsTable,
} from '@/server/db/schema'
import { and, desc, eq, gt, or } from 'drizzle-orm'
import { z } from 'zod'
import { zFixtureSchema } from './fixtures'

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
  fixtures: z.array(zFixtureSchema),
})

export const leaguesRouter = createTRPCRouter({
  list: publicProcedure.output(z.array(zLeagueSchema)).query(async () => {
    const leagues = await db.query.leagues.findMany({
      orderBy: [desc(LeaguesTable.createdAt)],
      with: {
        fixtures: true,
      },
    })
    return leagues.map(
      (
        league: typeof LeaguesTable.$inferSelect & {
          fixtures: (typeof FixturesTable.$inferSelect)[]
        }
      ) => ({
        ...league,
        fixtures: league.fixtures.filter(
          (fixture) => fixture?.matchDatetime && fixture.matchDatetime > new Date()
        ),
      })
    )
  }),
  findOne: publicProcedure
    .input(
      z
        .object({
          id: z.string().optional(),
          apiTeamId: z.string().optional(),
        })
        .refine((data) => data.id ?? data.apiTeamId, {
          message: "Either 'id' or 'apiTeamId' must be provided",
        })
    )
    .output(zLeagueSchema.optional())
    .query(async ({ input }) => {
      let league: typeof LeaguesTable.$inferSelect | undefined

      if (input.id) {
        // Lookup by league ID
        league = await db.query.leagues.findFirst({
          with: { matches: true },
          where: eq(LeaguesTable.id, input.id),
        })
      } else if (input.apiTeamId) {
        // Lookup by team external ID
        const leaguesWithTeam = await db
          .select()
          .from(LeaguesTable)
          .leftJoin(FixturesTable, eq(FixturesTable.leagueId, LeaguesTable.id))
          .leftJoin(
            TeamsTable,
            or(
              eq(FixturesTable.team1Id, TeamsTable.id),
              eq(FixturesTable.team2Id, TeamsTable.id)
            )
          )
          .where(eq(TeamsTable.apiTeamId, input.apiTeamId))
          .execute()

        league = leaguesWithTeam[0]?.leagues
      }

      if (league) {
        const matches = await db.query.fixtures.findMany({
          where: and(
            eq(FixturesTable.leagueId, league.id),
            gt(FixturesTable.matchDatetime, new Date())
          ),
        })

        return {
          ...league,
          fixtures: matches,
        }
      }

      return undefined
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
