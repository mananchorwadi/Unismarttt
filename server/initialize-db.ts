import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "@shared/schema";

async function initializeDatabase() {
  console.log("Initializing database...");
  
  // Skip database initialization if no DATABASE_URL or if it's likely to fail
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found, skipping database initialization");
    return false;
  }
  
  try {
    const client = postgres(process.env.DATABASE_URL as string, {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 5,
    });
    
    // Test connection with timeout
    const testConnection = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Connection timeout")), 3000);
      client`SELECT 1`.then(() => {
        clearTimeout(timeout);
        resolve(true);
      }).catch(reject);
    });
    
    await testConnection;
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
    return true;
  } catch (error) {
    console.log("Database unavailable, using memory storage instead");
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };