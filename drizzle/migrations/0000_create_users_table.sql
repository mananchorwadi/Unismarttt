-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "username" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "role" text NOT NULL CHECK ("role" IN ('student', 'faculty')),
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "university_id" text NOT NULL UNIQUE,
  "created_at" timestamp DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "users_university_id_idx" ON "users" ("university_id");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");