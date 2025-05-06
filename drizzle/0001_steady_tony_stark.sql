ALTER TABLE "lnfoot_matchs" RENAME TO "lnfoot_fixtures";--> statement-breakpoint
ALTER TABLE "lnfoot_fixtures" RENAME COLUMN "api_match_id" TO "api_fixture_id";--> statement-breakpoint
ALTER TABLE "lnfoot_highlights" DROP CONSTRAINT "lnfoot_highlights_match_id_lnfoot_matchs_id_fk";
--> statement-breakpoint
ALTER TABLE "lnfoot_fixtures" DROP CONSTRAINT "lnfoot_matchs_league_id_lnfoot_leagues_id_fk";
--> statement-breakpoint
ALTER TABLE "lnfoot_fixtures" DROP CONSTRAINT "lnfoot_matchs_team1_id_lnfoot_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "lnfoot_fixtures" DROP CONSTRAINT "lnfoot_matchs_team2_id_lnfoot_teams_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_highlights" ADD CONSTRAINT "lnfoot_highlights_match_id_lnfoot_fixtures_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."lnfoot_fixtures"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_fixtures" ADD CONSTRAINT "lnfoot_fixtures_league_id_lnfoot_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."lnfoot_leagues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_fixtures" ADD CONSTRAINT "lnfoot_fixtures_team1_id_lnfoot_teams_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."lnfoot_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_fixtures" ADD CONSTRAINT "lnfoot_fixtures_team2_id_lnfoot_teams_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."lnfoot_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
