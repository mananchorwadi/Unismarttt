import { type User, type InsertUser, type CallbackRequest, type CreateCallbackRequest } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Memory store for sessions
const MemoryStore = createMemoryStore(session);

// In-memory storage
let users: User[] = [];
let callbackRequests: CallbackRequest[] = [];
let nextUserId = 1;
let nextRequestId = 1;

// Initialize with some test data
async function initializeTestData() {
  if (users.length === 0) {
    // Add test faculty
    const testFaculty = {
      universityId: "F-12345",
      fullName: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      password: await hashPassword("password123"),
      role: "faculty" as const,
    };
    
    const testFaculty2 = {
      universityId: "F-67890", 
      fullName: "Prof. Michael Brown",
      email: "michael.brown@university.edu",
      password: await hashPassword("password123"),
      role: "faculty" as const,
    };

    // Add test student
    const testStudent = {
      universityId: "S-54321",
      fullName: "John Smith",
      email: "john.smith@student.university.edu", 
      password: await hashPassword("password123"),
      role: "student" as const,
    };

    // Create users
    const faculty1: User = { ...testFaculty, id: nextUserId++, createdAt: new Date() };
    const faculty2: User = { ...testFaculty2, id: nextUserId++, createdAt: new Date() };
    const student1: User = { ...testStudent, id: nextUserId++, createdAt: new Date() };

    users.push(faculty1, faculty2, student1);
    
    console.log("✓ Test data initialized: 2 faculty members and 1 student");
    console.log("  Faculty: F-12345 (Dr. Sarah Wilson), F-67890 (Prof. Michael Brown)");
    console.log("  Student: S-54321 (John Smith)");
    console.log("  Login with universityId and password: 'password123'");
  }
}

// Call initialization
initializeTestData();

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByUniversityId(universityId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getFacultyList(): Promise<User[]>;
  createCallbackRequest(request: CreateCallbackRequest & { studentId: number }): Promise<CallbackRequest>;
  getStudentRequests(studentId: number): Promise<(CallbackRequest & { facultyName: string })[]>;
  getFacultyRequests(facultyId: number): Promise<(CallbackRequest & { studentName: string; studentUniversityId: string })[]>;
  updateRequestStatus(requestId: number, status: string): Promise<CallbackRequest | undefined>;
  sessionStore: session.Store;
}

export class MemoryStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return users.find(user => user.username === username);
  }

  async getUserByUniversityId(universityId: string): Promise<User | undefined> {
    return users.find(user => user.universityId === universityId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: nextUserId++,
      createdAt: new Date(),
    };
    users.push(user);
    return user;
  }

  async getFacultyList(): Promise<User[]> {
    return users.filter(user => user.role === 'faculty');
  }

  async createCallbackRequest(request: CreateCallbackRequest & { studentId: number }): Promise<CallbackRequest> {
    const newRequest: CallbackRequest = {
      id: nextRequestId++,
      studentId: request.studentId,
      facultyId: request.facultyId,
      subject: request.subject,
      preferredTime: new Date(request.preferredTime),
      status: 'Pending',
      createdAt: new Date(),
    };
    callbackRequests.push(newRequest);
    return newRequest;
  }

  async getStudentRequests(studentId: number): Promise<(CallbackRequest & { facultyName: string })[]> {
    return callbackRequests
      .filter(req => req.studentId === studentId)
      .map(req => {
        const faculty = users.find(u => u.id === req.facultyId);
        return {
          ...req,
          facultyName: faculty ? faculty.fullName : 'Unknown Faculty'
        };
      });
  }

  async getFacultyRequests(facultyId: number): Promise<(CallbackRequest & { studentName: string; studentUniversityId: string })[]> {
    return callbackRequests
      .filter(req => req.facultyId === facultyId)
      .map(req => {
        const student = users.find(u => u.id === req.studentId);
        return {
          ...req,
          studentName: student ? student.fullName : 'Unknown Student',
          studentUniversityId: student ? student.universityId : 'Unknown ID'
        };
      });
  }

  async updateRequestStatus(requestId: number, status: string): Promise<CallbackRequest | undefined> {
    const requestIndex = callbackRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return undefined;
    
    callbackRequests[requestIndex].status = status as any;
    return callbackRequests[requestIndex];
  }
}

export const memoryStorage = new MemoryStorage();