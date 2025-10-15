-- Migration to create user_usage table
CREATE TABLE IF NOT EXISTS "user_usage" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "current_usage" integer DEFAULT 0 NOT NULL,
    "usage_limit" integer DEFAULT 100 NOT NULL,
    "last_updated" timestamp DEFAULT now() NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "user_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS "user_usage_user_id_idx" ON "user_usage" ("user_id");