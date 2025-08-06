import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { memoryStorage, type IStorage } from "./memory-storage";

// Initialize PostgreSQL client if available
let client: any = null;
let db: any = null;

try {
  if (process.env.DATABASE_URL) {
    // Create postgres client with connection pooling and error handling
    client = postgres(process.env.DATABASE_URL as string, {
      max: 10, // Maximum number of connections
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout of 10 seconds
      prepare: false, // Disable prepared statements for better compatibility
      onnotice: () => {}, // Suppress NOTICE messages
    });

    // Initialize drizzle with the PostgreSQL client
    db = drizzle(client);
    console.log("PostgreSQL client initialized");
  }
} catch (error) {
  console.warn("PostgreSQL initialization failed, will use memory storage:", error);
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = memoryStorage.sessionStore;
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      if (!db) return memoryStorage.getUser(id);
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.warn("Database error, using memory storage:", error);
      return memoryStorage.getUser(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      if (!db) return memoryStorage.getUserByUsername(username);
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.warn("Database error, using memory storage:", error);
      return memoryStorage.getUserByUsername(username);
    }
  }

  async getUserByUniversityId(universityId: string): Promise<User | undefined> {
    try {
      if (!db) return memoryStorage.getUserByUniversityId(universityId);
      const result = await db.select().from(users).where(eq(users.universityId, universityId));
      return result[0];
    } catch (error) {
      console.warn("Database error, using memory storage:", error);
      return memoryStorage.getUserByUniversityId(universityId);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      if (!db) return memoryStorage.getUserByEmail(email);
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.warn("Database error, using memory storage:", error);
      return memoryStorage.getUserByEmail(email);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      if (!db) return memoryStorage.createUser(insertUser);
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.warn("Database error, using memory storage:", error);
      return memoryStorage.createUser(insertUser);
    }
  }
}

// Create storage instance
export const storage = new DatabaseStorage();
