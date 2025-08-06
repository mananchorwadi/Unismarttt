import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "@shared/schema";

async function initializeDatabase() {
  console.log("Initializing database...");
  
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const client = postgres(process.env.DATABASE_URL as string, {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    // Test connection first
    await client`SELECT 1`;
    console.log("Database connection established");
    
    // Create table if not exists
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'faculty')),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        university_id TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log("Database tables created successfully");
    await client.end();
  } catch (error) {
    console.warn("Database initialization failed, but continuing with application startup:", error);
    // Don't exit process, just log warning and continue
    return false;
  }
  
  return true;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };