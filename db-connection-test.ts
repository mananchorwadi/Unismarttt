import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// This is a simplified connection that doesn't use WebSockets
// and should work in environments where WebSockets are restricted
async function testConnection() {
  console.log('Testing database connection...');
  const connectionString = process.env.DATABASE_URL;
  console.log('Connection string available:', !!connectionString);
  
  try {
    const client = postgres(connectionString as string);
    const db = drizzle(client);
    
    // Try a simple query
    const result = await client`SELECT 1 as test`;
    console.log('Connection successful. Result:', result[0].test);
    
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();