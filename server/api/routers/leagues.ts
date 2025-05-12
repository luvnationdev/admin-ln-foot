import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import {
  fixtures as FixturesTable,
  leagues as LeaguesTable,
  teams as TeamsTable,
} from '@/server/db/schema'
import { and, desc, eq, isNull, or } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
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
    })
    return leagues.map((league) => ({ ...league, fixtures: [] }))
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
      const [league] = await getLeaguesWithFixtures(input.id ?? input.apiTeamId)
      return league
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

async function getLeaguesWithFixtures(id?: string) {
  const team1Alias = alias(TeamsTable, 'team1')
  const team2Alias = alias(TeamsTable, 'team2')

  const rows = await db
    .select({
      league: LeaguesTable,
      fixture: FixturesTable,
      team1: {
        id: team1Alias.id,
        name: team1Alias.teamName,
        logo: team1Alias.logoUrl,
      },
      team2: {
        id: team2Alias.id,
        name: team2Alias.teamName,
        logo: team2Alias.logoUrl,
      },
    })
    .from(LeaguesTable)
    .leftJoin(FixturesTable, eq(LeaguesTable.id, FixturesTable.leagueId))
    .leftJoin(team1Alias, eq(FixturesTable.team1Id, team1Alias.id))
    .leftJoin(team2Alias, eq(FixturesTable.team2Id, team2Alias.id))
    .where(
      and(
        id ? eq(LeaguesTable.id, id) : undefined,
        or(isNull(FixturesTable.matchDatetime)) // tolerate null fixtures if no join
      )
    )
    .orderBy(desc(LeaguesTable.updatedAt))

  const grouped: Record<
    string,
    typeof LeaguesTable.$inferSelect & {
      fixtures: Array<
        typeof FixturesTable.$inferSelect & {
          team1: { id: string; name: string; logo: string | null } | null
          team2: { id: string; name: string; logo: string | null } | null
        }
      >
    }
  > = {}

  for (const row of rows) {
    const leagueId = row.league.id
    if (!grouped[leagueId]) {
      grouped[leagueId] = {
        ...row.league,
        fixtures: [],
      }
    }

    if (row.fixture?.id) {
      grouped[leagueId].fixtures.push({
        ...row.fixture,
        team1: row.team1?.id ? row.team1 : null,
        team2: row.team2?.id ? row.team2 : null,
      })
    }
  }

  return Object.values(grouped)
}
