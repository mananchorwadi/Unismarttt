import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

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
    // For migrations, we need a new connection
    const migrationClient = postgres(connectionString, { max: 1 });
    
    // Create a drizzle instance using the client
    const db = drizzle(migrationClient);
    
    // Get the list of migration files
    const migrationsDir = path.join(process.cwd(), 'drizzle', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure they run in order
    
    console.log('Found migration files:', migrationFiles);
    
    // Run each migration file
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the SQL statements
      await migrationClient.unsafe(sql);
      console.log(`Completed migration: ${file}`);
    }
    
    console.log('All migrations completed successfully');
    
    // Close the connection
    await migrationClient.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();