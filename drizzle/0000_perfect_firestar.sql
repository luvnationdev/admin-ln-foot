CREATE TABLE IF NOT EXISTS "lnfoot_ecommerce_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"summary" text,
	"price" numeric(10, 2),
	"image_url" varchar(255),
	"source_url" varchar(255),
	"ecommerce_id" varchar(255),
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid,
	"title" text,
	"description" text,
	"video_url" varchar(255),
	"thumbnail_url" varchar(255),
	"published_at" timestamp with time zone,
	"api_source" varchar(50),
	"api_highlight_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_leagues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_id" uuid,
	"league_name" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"tier" integer,
	"api_source" varchar(50),
	"api_league_id" varchar(255),
	"logo_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_matchs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"team1_id" uuid NOT NULL,
	"team2_id" uuid NOT NULL,
	"match_datetime" timestamp with time zone NOT NULL,
	"api_source" varchar(50),
	"api_match_id" varchar(255),
	"status" varchar(50),
	"score1" integer DEFAULT 0 NOT NULL,
	"score2" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_news_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"summary" text,
	"image_url" varchar(255),
	"source_url" varchar(255),
	"published_at" timestamp with time zone,
	"api_source" varchar(50),
	"api_article_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_publicities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"reference_url" varchar(255),
	"image_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_sport" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "lnfoot_sport_sport_name_unique" UNIQUE("sport_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lnfoot_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"team_name" varchar(255) NOT NULL,
	"api_source" varchar(50),
	"api_team_id" varchar(255),
	"logo_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_highlights" ADD CONSTRAINT "lnfoot_highlights_match_id_lnfoot_matchs_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."lnfoot_matchs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_leagues" ADD CONSTRAINT "lnfoot_leagues_sport_id_lnfoot_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."lnfoot_sport"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_matchs" ADD CONSTRAINT "lnfoot_matchs_league_id_lnfoot_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."lnfoot_leagues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_matchs" ADD CONSTRAINT "lnfoot_matchs_team1_id_lnfoot_teams_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."lnfoot_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_matchs" ADD CONSTRAINT "lnfoot_matchs_team2_id_lnfoot_teams_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."lnfoot_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lnfoot_teams" ADD CONSTRAINT "lnfoot_teams_league_id_lnfoot_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."lnfoot_leagues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
