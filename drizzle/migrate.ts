import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';

// Create a pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

// This will run migrations on the database, creating tables if they don't exist
// based on the schema definition
async function runMigrations() {
  console.log('Running migrations...');
  try {
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();