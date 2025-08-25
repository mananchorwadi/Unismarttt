import { 
  type User, 
  type InsertUser, 
  type CallbackRequest, 
  type CreateCallbackRequest,
  type Conversation,
  type Message,
  type CreateMessage,
  type CreateConversation,
  type Classroom,
  type TimetableEntry,
  type CreateClassroom,
  type CreateTimetableEntry
} from "@shared/schema";
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
let conversations: Conversation[] = [];
let conversationMembers: Array<{id: number, conversationId: number, userId: number, joinedAt: Date}> = [];
let messages: Message[] = [];
let classrooms: Classroom[] = [];
let timetable: TimetableEntry[] = [];
let nextUserId = 1;
let nextRequestId = 1;
let nextConversationId = 1;
let nextMessageId = 1;
let nextClassroomId = 1;
let nextTimetableId = 1;

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
    const faculty1: User = { ...testFaculty, id: nextUserId++, createdAt: new Date(), username: testFaculty.universityId };
    const faculty2: User = { ...testFaculty2, id: nextUserId++, createdAt: new Date(), username: testFaculty2.universityId };
    const student1: User = { ...testStudent, id: nextUserId++, createdAt: new Date(), username: testStudent.universityId };

    users.push(faculty1, faculty2, student1);
    
    // Initialize sample classrooms
    const sampleClassrooms: Classroom[] = [
      { id: nextClassroomId++, roomNo: "C101", building: "Computer Science Building", capacity: 30, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "C102", building: "Computer Science Building", capacity: 50, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "C103", building: "Computer Science Building", capacity: 40, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "M201", building: "Mathematics Building", capacity: 35, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "M202", building: "Mathematics Building", capacity: 45, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "E301", building: "Engineering Building", capacity: 60, createdAt: new Date() },
    ];
    classrooms.push(...sampleClassrooms);

    // Initialize sample timetable
    const sampleTimetable: TimetableEntry[] = [
      { id: nextTimetableId++, roomId: 1, courseName: "CS 101", facultyName: "Dr. Sarah Wilson", dayOfWeek: "Monday", startTime: "09:00", endTime: "10:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 1, courseName: "CS 205", facultyName: "Prof. Michael Brown", dayOfWeek: "Monday", startTime: "11:00", endTime: "12:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 2, courseName: "CS 301", facultyName: "Dr. Sarah Wilson", dayOfWeek: "Monday", startTime: "14:00", endTime: "15:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 1, courseName: "CS 101", facultyName: "Dr. Sarah Wilson", dayOfWeek: "Tuesday", startTime: "10:00", endTime: "11:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 3, courseName: "CS 205", facultyName: "Prof. Michael Brown", dayOfWeek: "Wednesday", startTime: "13:00", endTime: "14:30", createdAt: new Date() },
    ];
    timetable.push(...sampleTimetable);

    // Initialize sample conversations and messages
    const studentFacultyConvo: Conversation = {
      id: nextConversationId++,
      name: null,
      isGroup: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    conversations.push(studentFacultyConvo);
    
    conversationMembers.push(
      { id: 1, conversationId: studentFacultyConvo.id, userId: student1.id, joinedAt: new Date() },
      { id: 2, conversationId: studentFacultyConvo.id, userId: faculty1.id, joinedAt: new Date() }
    );

    const sampleMessages: Message[] = [
      {
        id: nextMessageId++,
        conversationId: studentFacultyConvo.id,
        senderId: student1.id,
        content: "Hello Professor, I have a question about the upcoming assignment.",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(new Date().getTime() - 3600000) // 1 hour ago
      },
      {
        id: nextMessageId++,
        conversationId: studentFacultyConvo.id,
        senderId: faculty1.id,
        content: "Of course! What would you like to know about the assignment?",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(new Date().getTime() - 3000000) // 50 minutes ago
      }
    ];
    messages.push(...sampleMessages);
    
    console.log("✓ Test data initialized: 2 faculty members and 1 student");
    console.log("  Faculty: F-12345 (Dr. Sarah Wilson), F-67890 (Prof. Michael Brown)");
    console.log("  Student: S-54321 (John Smith)");
    console.log("  Login with universityId and password: 'password123'");
    console.log("✓ Sample classrooms and timetable initialized");
    console.log("✓ Sample conversations and messages initialized");
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
  getAllUsers(): Promise<User[]>;
  createCallbackRequest(request: CreateCallbackRequest & { studentId: number }): Promise<CallbackRequest>;
  getStudentRequests(studentId: number): Promise<(CallbackRequest & { facultyName: string })[]>;
  getFacultyRequests(facultyId: number): Promise<(CallbackRequest & { studentName: string; studentUniversityId: string })[]>;
  updateRequestStatus(requestId: number, status: string): Promise<CallbackRequest | undefined>;
  
  // Messaging functionality
  createConversation(conversation: CreateConversation, creatorId: number): Promise<Conversation>;
  getUserConversations(userId: number): Promise<Array<Conversation & { lastMessage?: Message; unreadCount: number; members: User[] }>>;
  createMessage(message: CreateMessage, senderId: number): Promise<Message>;
  getConversationMessages(conversationId: number, userId: number): Promise<Array<Message & { senderName: string; senderAvatar: string }>>;
  
  // Classroom functionality  
  createClassroom(classroom: CreateClassroom): Promise<Classroom>;
  getClassrooms(): Promise<Classroom[]>;
  createTimetableEntry(entry: CreateTimetableEntry): Promise<TimetableEntry>;
  getTimetable(): Promise<Array<TimetableEntry & { roomNo: string }>>;
  getAllUsers(): Promise<User[]>;
  getFreeClassrooms(day: string, startTime: string, endTime: string): Promise<Array<Classroom & { freeUntil?: string }>>;
  
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

  async getAllUsers(): Promise<User[]> {
    return users;
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

  // Messaging functionality
  async createConversation(conversation: CreateConversation, creatorId: number): Promise<Conversation> {
    const newConversation: Conversation = {
      id: nextConversationId++,
      name: conversation.name || null,
      isGroup: conversation.isGroup || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversations.push(newConversation);

    // Add creator to conversation members
    const allMembers = Array.from(new Set([creatorId, ...conversation.members])); // Ensure creator is included and no duplicates
    
    allMembers.forEach(userId => {
      conversationMembers.push({
        id: conversationMembers.length + 1,
        conversationId: newConversation.id,
        userId: userId,
        joinedAt: new Date()
      });
    });

    return newConversation;
  }

  async getUserConversations(userId: number): Promise<Array<Conversation & { lastMessage?: Message; unreadCount: number; members: User[] }>> {
    // Get user's conversation IDs
    const userConvoIds = conversationMembers
      .filter(cm => cm.userId === userId)
      .map(cm => cm.conversationId);

    // Get conversations with additional data
    const userConversations = conversations
      .filter(conv => userConvoIds.includes(conv.id))
      .map(conv => {
        // Get last message
        const convMessages = messages
          .filter(msg => msg.conversationId === conv.id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        const lastMessage = convMessages[0];

        // Get members
        const memberIds = conversationMembers
          .filter(cm => cm.conversationId === conv.id)
          .map(cm => cm.userId);
        
        const members = users.filter(u => memberIds.includes(u.id));

        return {
          ...conv,
          lastMessage,
          unreadCount: 0, // TODO: Implement read status tracking
          members
        };
      });

    return userConversations;
  }

  async createMessage(message: CreateMessage, senderId: number): Promise<Message> {
    const newMessage: Message = {
      id: nextMessageId++,
      conversationId: message.conversationId,
      senderId: senderId,
      content: message.content,
      attachmentName: message.attachmentName || null,
      attachmentSize: message.attachmentSize || null,
      createdAt: new Date(),
    };
    messages.push(newMessage);

    // Update conversation's updatedAt timestamp
    const convIndex = conversations.findIndex(c => c.id === message.conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].updatedAt = new Date();
    }

    return newMessage;
  }

  async getConversationMessages(conversationId: number, userId: number): Promise<Array<Message & { senderName: string; senderAvatar: string }>> {
    // Verify user is member of conversation
    const isMember = conversationMembers.some(cm => 
      cm.conversationId === conversationId && cm.userId === userId
    );
    
    if (!isMember) {
      return [];
    }

    // Get messages with sender info
    const conversationMessages = messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map(msg => {
        const sender = users.find(u => u.id === msg.senderId);
        const senderName = sender ? sender.fullName : 'Unknown User';
        const senderAvatar = sender ? this.getInitials(senderName) : 'UK';
        
        return {
          ...msg,
          senderName,
          senderAvatar
        };
      });

    return conversationMessages;
  }

  // Classroom functionality
  async createClassroom(classroom: CreateClassroom): Promise<Classroom> {
    const newClassroom: Classroom = {
      id: nextClassroomId++,
      roomNo: classroom.roomNo,
      building: classroom.building || null,
      capacity: classroom.capacity || 0,
      createdAt: new Date(),
    };
    classrooms.push(newClassroom);
    return newClassroom;
  }

  async getClassrooms(): Promise<Classroom[]> {
    return [...classrooms];
  }

  async createTimetableEntry(entry: CreateTimetableEntry): Promise<TimetableEntry> {
    const newEntry: TimetableEntry = {
      id: nextTimetableId++,
      roomId: entry.roomId,
      courseName: entry.courseName,
      facultyName: entry.facultyName,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      createdAt: new Date(),
    };
    timetable.push(newEntry);
    return newEntry;
  }

  async getTimetable(): Promise<Array<TimetableEntry & { roomNo: string }>> {
    return timetable.map(entry => {
      const room = classrooms.find(r => r.id === entry.roomId);
      return {
        ...entry,
        roomNo: room ? room.roomNo : 'Unknown Room'
      };
    });
  }

  async getAllUsers(): Promise<User[]> {
    return users;
  }

  async getFreeClassrooms(day: string, startTime: string, endTime: string): Promise<Array<Classroom & { freeUntil?: string }>> {
    // Get all occupied classrooms for the given time slot
    const occupiedRoomIds = timetable
      .filter(entry => 
        entry.dayOfWeek === day &&
        this.isTimeOverlapping(entry.startTime, entry.endTime, startTime, endTime)
      )
      .map(entry => entry.roomId);

    // Get free classrooms
    const freeClassrooms = classrooms
      .filter(room => !occupiedRoomIds.includes(room.id))
      .map(room => {
        // Find next occupied slot for this room
        const nextOccupied = timetable
          .filter(entry => 
            entry.roomId === room.id && 
            entry.dayOfWeek === day && 
            entry.startTime > endTime
          )
          .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

        return {
          ...room,
          freeUntil: nextOccupied ? nextOccupied.startTime : undefined
        };
      });

    return freeClassrooms;
  }

  private isTimeOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
    // Convert time strings to minutes for easier comparison
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    return s1 < e2 && e1 > s2;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

export const memoryStorage = new MemoryStorage();