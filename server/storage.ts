import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import createMemoryStore from "memorystore";

// Memory store for sessions as a fallback
const MemoryStore = createMemoryStore(session);

// Create postgres client
const client = postgres(process.env.DATABASE_URL as string);

// Initialize drizzle with the PostgreSQL client
const db = drizzle(client);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByUniversityId(universityId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Using memory store for simplicity - can be changed to PostgreSQL session store
    // if that becomes necessary, but this avoids WebSocket issues
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByUniversityId(universityId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.universityId, universityId));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
