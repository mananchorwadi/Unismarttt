import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// This script will create the necessary tables in the database

async function runMigrations() {
  console.log('Running database migrations...');
  const connectionString = process.env.DATABASE_URL;
  console.log('Connection string available:', !!connectionString);
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    // For migrations, we need a new connection with SSL disabled for local development
    const migrationClient = postgres(connectionString, { max: 1 });
    
    // Create a drizzle instance using the client
    const db = drizzle(migrationClient);
    
    // Run migrations programmatically
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Migrations completed successfully');
    
    // Close the connection
    await migrationClient.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();