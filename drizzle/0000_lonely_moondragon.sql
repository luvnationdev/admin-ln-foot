CREATE TABLE IF NOT EXISTS "web_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "web_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_fixtures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"team1_id" uuid NOT NULL,
	"team2_id" uuid NOT NULL,
	"match_datetime" timestamp with time zone NOT NULL,
	"api_source" varchar(50),
	"api_fixture_id" varchar(255),
	"status" varchar(50),
	"score1" integer DEFAULT 0 NOT NULL,
	"score2" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_highlights" (
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
CREATE TABLE IF NOT EXISTS "web_leagues" (
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
CREATE TABLE IF NOT EXISTS "web_news_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"summary" text,
	"image_url" varchar(255),
	"source_url" varchar(255),
	"published_at" timestamp with time zone,
	"api_source" varchar(50),
	"api_article_id" varchar(255),
	"is_major_update" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_publicities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"reference_url" varchar(255),
	"image_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_sport" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "web_sport_sport_name_unique" UNIQUE("sport_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_teams" (
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
CREATE TABLE IF NOT EXISTS "web_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "web_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_fixtures" ADD CONSTRAINT "web_fixtures_league_id_web_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."web_leagues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_fixtures" ADD CONSTRAINT "web_fixtures_team1_id_web_teams_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."web_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_fixtures" ADD CONSTRAINT "web_fixtures_team2_id_web_teams_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."web_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_highlights" ADD CONSTRAINT "web_highlights_match_id_web_fixtures_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."web_fixtures"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_leagues" ADD CONSTRAINT "web_leagues_sport_id_web_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."web_sport"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_teams" ADD CONSTRAINT "web_teams_league_id_web_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."web_leagues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
