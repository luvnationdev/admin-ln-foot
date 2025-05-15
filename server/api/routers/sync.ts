import { fetchFixtures } from "@/lib/api-football";
import { db } from "@/server/db";
import {
  leagues as LeaguesTable,
  fixtures as FixturesTable,
  teams as TeamsTable,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, ghActionProcedure } from "../trpc";

export const syncRouter = createTRPCRouter({
  syncData: ghActionProcedure.mutation(async () => {
    const apiSource = "apisports";
    const fixtures = await fetchFixtures();
    console.log(fixtures);
    await Promise.all(
      fixtures.map(async (item) => {
        await db.transaction(async (tx) => {
          // League
          const apiLeagueId = item.league.id.toString();
          let league = await tx.query.leagues.findFirst({
            where: eq(LeaguesTable.apiLeagueId, apiLeagueId),
          });
          console.log({ item, league });
          if (!league) {
            await tx.insert(LeaguesTable).values({
              country: item.league.country,
              leagueName: item.league.name,
              apiLeagueId,
              apiSource,
              logoUrl: item.league.logo,
            });
            league = await tx.query.leagues.findFirst({
              where: eq(LeaguesTable.apiLeagueId, apiLeagueId),
            });
          }

          // Home Team
          const apiHomeTeamId = item.teams.home.id.toString();
          let homeTeam = await tx.query.teams.findFirst({
            where: eq(TeamsTable.apiTeamId, apiHomeTeamId),
          });
          if (!homeTeam) {
            await tx.insert(TeamsTable).values({
              apiTeamId: apiHomeTeamId,
              teamName: item.teams.home.name,
              logoUrl: item.teams.home.logo,
              apiSource,
            });
            homeTeam = await tx.query.teams.findFirst({
              where: eq(TeamsTable.apiTeamId, apiHomeTeamId),
            });
          }

          // Away Team
          const apiAwayTeamId = item.teams.away.id.toString();
          let awayTeam = await tx.query.teams.findFirst({
            where: eq(TeamsTable.apiTeamId, apiAwayTeamId),
          });
          if (!awayTeam) {
            await tx.insert(TeamsTable).values({
              apiTeamId: apiAwayTeamId,
              teamName: item.teams.away.name,
              logoUrl: item.teams.away.logo,
              apiSource,
            });
            awayTeam = await tx.query.teams.findFirst({
              where: eq(TeamsTable.apiTeamId, apiAwayTeamId),
            });
          }

          // Fixture
          const apiFixtureId = item.fixture.id.toString();
          const existingFixture = await tx.query.fixtures.findFirst({
            where: eq(FixturesTable.apiFixtureId, apiFixtureId),
          });
          if (!existingFixture) {
            await tx.insert(FixturesTable).values({
              apiSource,
              score1: item.goals.home ?? 0,
              score2: item.goals.away ?? 0,
              matchDatetime: new Date(item.fixture.date),
              apiFixtureId,
              leagueId: league!.id,
              team1Id: homeTeam!.id,
              team2Id: awayTeam!.id,
              status: item.fixture.status.short,
            });
          } else {
            await tx
              .update(FixturesTable)
              .set({
                score1: item.goals.home ?? 0,
                score2: item.goals.away ?? 0,
                status: item.fixture.status.short,
                updatedAt: new Date(),
              })
              .where(eq(FixturesTable.id, existingFixture.id));
          }
        });
      }),
    );
    return fixtures;
  }),
});
