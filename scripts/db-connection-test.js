import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function testConnection() {
  console.log('Testing database connection...');
  const connectionString = process.env.DATABASE_URL;
  console.log('Connection string available:', !!connectionString);
  
  try {
    const client = postgres(connectionString);
    const db = drizzle(client);
    
    const result = await client`SELECT 1 as test`;
    console.log('Connection successful. Result:', result[0].test);
    
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();
