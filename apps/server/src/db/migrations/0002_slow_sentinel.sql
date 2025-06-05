CREATE TYPE "public"."role" AS ENUM('agent', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'agent' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "review_notes" text;