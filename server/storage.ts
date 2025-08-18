import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { memoryStorage, type IStorage } from "./memory-storage";

// Initialize PostgreSQL client if available
let client: any = null;
let db: any = null;

// Use memory storage only - disable PostgreSQL completely to avoid errors
console.log("Using memory storage for data persistence");
client = null;
db = null;

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = memoryStorage.sessionStore;
  }

  async getUser(id: number): Promise<User | undefined> {
    return memoryStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return memoryStorage.getUserByUsername(username);
  }

  async getUserByUniversityId(universityId: string): Promise<User | undefined> {
    return memoryStorage.getUserByUniversityId(universityId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return memoryStorage.getUserByEmail(email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return memoryStorage.createUser(insertUser);
  }

  async getFacultyList(): Promise<User[]> {
    return memoryStorage.getFacultyList();
  }

  async createCallbackRequest(request: CreateCallbackRequest & { studentId: number }): Promise<CallbackRequest> {
    return memoryStorage.createCallbackRequest(request);
  }

  async getStudentRequests(studentId: number): Promise<(CallbackRequest & { facultyName: string })[]> {
    return memoryStorage.getStudentRequests(studentId);
  }

  async getFacultyRequests(facultyId: number): Promise<(CallbackRequest & { studentName: string; studentUniversityId: string })[]> {
    return memoryStorage.getFacultyRequests(facultyId);
  }

  async updateRequestStatus(requestId: number, status: string): Promise<CallbackRequest | undefined> {
    return memoryStorage.updateRequestStatus(requestId, status);
  }
}

// Create storage instance
export const storage = new DatabaseStorage();
