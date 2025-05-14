import { api } from '@/lib/trpc/server'
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import {
  fixtures as FixturesTable,
  teams as TeamsTable,
} from '@/server/db/schema'
import { desc, eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { type TypeOf, z } from 'zod'

const zTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().nullable(),
})
export const zFixtureSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  apiSource: z.string().nullable(),
  leagueId: z.string(),
  team1: zTeamSchema.nullable(),
  team2: zTeamSchema.nullable(),
  matchDatetime: z.date(),
  apiFixtureId: z.string().nullable(),
  status: z.string().nullable(),
  score1: z.number().default(0),
  score2: z.number().default(0),
})

export const fixturesRouter = createTRPCRouter({
  latest: publicProcedure.output(z.array(zFixtureSchema)).query(async () => {
    const leagues = await api.leagues.list()
    const fixtures = await selectFixtures()

    const { f: otherFixtures, l: localFixtures } = fixtures.reduce<{
      l: Array<TypeOf<typeof zFixtureSchema>>
      f: Array<TypeOf<typeof zFixtureSchema>>
    }>(
      (acc, cur) => {
        const isCameroonLeague = leagues.some(
          (l) =>
            l.id === cur.fixture.leagueId &&
            l.country.toLowerCase().includes('cameroon')
        )

        const fixtureData = {
          ...cur.fixture,
          team1: cur.team1,
          team2: cur.team2,
        }

        if (isCameroonLeague) {
          acc.l.push(fixtureData)
        } else {
          acc.f.push(fixtureData)
        }

        return acc
      },
      { l: [], f: [] }
    )

    return [...localFixtures, ...otherFixtures]
  }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(zFixtureSchema.nullable())
    .query(async ({ input }) => {
      const fixtures = await selectFixtures(1, input.id)
      if (fixtures.length) {
        const [{ fixture, team1, team2 }] = fixtures
        return { ...fixture, team1, team2 }
      }
      return null
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
async function selectFixtures(limit?: number, id?: string) {
  const team1Alias = alias(TeamsTable, 'team1')
  const team2Alias = alias(TeamsTable, 'team2')

  const query = db
    .select({
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
    .from(FixturesTable)
    .leftJoin(team1Alias, eq(FixturesTable.team1Id, team1Alias.id))
    .leftJoin(team2Alias, eq(FixturesTable.team2Id, team2Alias.id))
    .orderBy(desc(FixturesTable.matchDatetime))

  if (limit) {
    query.limit(limit)
  }

  if (id) {
    query.where(eq(FixturesTable.id, id))
  }

  const fixtures = await query
  return fixtures
}
