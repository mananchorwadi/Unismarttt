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
    const testFaculty1 = {
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

    const testFaculty3 = {
      universityId: "F-11111", 
      fullName: "Dr. Emily Johnson",
      email: "emily.johnson@university.edu",
      password: await hashPassword("password123"),
      role: "faculty" as const,
    };

    const testFaculty4 = {
      universityId: "F-22222", 
      fullName: "Prof. David Miller",
      email: "david.miller@university.edu",
      password: await hashPassword("password123"),
      role: "faculty" as const,
    };

    // Add test students
    const testStudent1 = {
      universityId: "S-54321",
      fullName: "John Smith",
      email: "john.smith@student.university.edu", 
      password: await hashPassword("password123"),
      role: "student" as const,
    };

    const testStudent2 = {
      universityId: "S-11111",
      fullName: "Alex Johnson",
      email: "alex.johnson@student.university.edu", 
      password: await hashPassword("password123"),
      role: "student" as const,
    };

    const testStudent3 = {
      universityId: "S-22222",
      fullName: "Maria Garcia",
      email: "maria.garcia@student.university.edu", 
      password: await hashPassword("password123"),
      role: "student" as const,
    };

    const testStudent4 = {
      universityId: "S-33333",
      fullName: "James Wilson",
      email: "james.wilson@student.university.edu", 
      password: await hashPassword("password123"),
      role: "student" as const,
    };

    const testStudent5 = {
      universityId: "S-44444",
      fullName: "Sarah Ahmed",
      email: "sarah.ahmed@student.university.edu", 
      password: await hashPassword("password123"),
      role: "student" as const,
    };

    // Create users
    const faculty1: User = { ...testFaculty1, id: nextUserId++, createdAt: new Date(), username: testFaculty1.universityId };
    const faculty2: User = { ...testFaculty2, id: nextUserId++, createdAt: new Date(), username: testFaculty2.universityId };
    const faculty3: User = { ...testFaculty3, id: nextUserId++, createdAt: new Date(), username: testFaculty3.universityId };
    const faculty4: User = { ...testFaculty4, id: nextUserId++, createdAt: new Date(), username: testFaculty4.universityId };
    const student1: User = { ...testStudent1, id: nextUserId++, createdAt: new Date(), username: testStudent1.universityId };
    const student2: User = { ...testStudent2, id: nextUserId++, createdAt: new Date(), username: testStudent2.universityId };
    const student3: User = { ...testStudent3, id: nextUserId++, createdAt: new Date(), username: testStudent3.universityId };
    const student4: User = { ...testStudent4, id: nextUserId++, createdAt: new Date(), username: testStudent4.universityId };
    const student5: User = { ...testStudent5, id: nextUserId++, createdAt: new Date(), username: testStudent5.universityId };

    users.push(faculty1, faculty2, faculty3, faculty4, student1, student2, student3, student4, student5);
    
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
    const now = new Date();
    let memberIdCounter = 1;

    // Conversation 1: Student2 (Alex) and Faculty1 (Dr. Sarah Wilson)
    const conv1: Conversation = {
      id: nextConversationId++,
      name: null,
      isGroup: false,
      createdAt: new Date(now.getTime() - 86400000), // 1 day ago
      updatedAt: new Date(now.getTime() - 1800000) // 30 minutes ago
    };
    conversations.push(conv1);
    
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv1.id, userId: student2.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv1.id, userId: faculty1.id, joinedAt: new Date() }
    );

    // Conversation 2: Student3 (Maria) and Faculty2 (Prof. Michael Brown)  
    const conv2: Conversation = {
      id: nextConversationId++,
      name: null,
      isGroup: false,
      createdAt: new Date(now.getTime() - 172800000), // 2 days ago
      updatedAt: new Date(now.getTime() - 86400000) // 1 day ago
    };
    conversations.push(conv2);
    
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv2.id, userId: student3.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv2.id, userId: faculty2.id, joinedAt: new Date() }
    );

    // Conversation 3: Student4 (James) and Faculty3 (Dr. Emily Johnson)
    const conv3: Conversation = {
      id: nextConversationId++,
      name: null,
      isGroup: false,
      createdAt: new Date(now.getTime() - 259200000), // 3 days ago
      updatedAt: new Date(now.getTime() - 259200000) // 3 days ago
    };
    conversations.push(conv3);
    
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv3.id, userId: student4.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv3.id, userId: faculty3.id, joinedAt: new Date() }
    );

    // Conversation 4: Student5 (Sarah) and Faculty4 (Prof. David Miller)
    const conv4: Conversation = {
      id: nextConversationId++,
      name: null,
      isGroup: false,
      createdAt: new Date(now.getTime() - 604800000), // 1 week ago
      updatedAt: new Date(now.getTime() - 345600000) // 4 days ago
    };
    conversations.push(conv4);
    
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv4.id, userId: student5.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv4.id, userId: faculty4.id, joinedAt: new Date() }
    );

    // Conversation 5: CS 101 Study Group
    const studyGroup: Conversation = {
      id: nextConversationId++,
      name: "CS 101 Study Group",
      isGroup: true,
      createdAt: new Date(now.getTime() - 432000000), // 5 days ago
      updatedAt: new Date(now.getTime() - 172800000) // 2 days ago
    };
    conversations.push(studyGroup);
    
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student1.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student2.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student3.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student4.id, joinedAt: new Date() }
    );

    const sampleMessages: Message[] = [
      // Messages for Conversation 1 (Alex & Dr. Sarah Wilson)
      {
        id: nextMessageId++,
        conversationId: conv1.id,
        senderId: student2.id,
        content: "Hello Professor, I have a question about the upcoming assignment.",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 3600000) // 1 hour ago
      },
      {
        id: nextMessageId++,
        conversationId: conv1.id,
        senderId: faculty1.id,
        content: "Of course, what would you like to know?",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 2700000) // 45 minutes ago
      },
      {
        id: nextMessageId++,
        conversationId: conv1.id,
        senderId: student2.id,
        content: "I'm not sure about the requirements for the final project. Could you provide more details?",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 2400000) // 40 minutes ago
      },
      {
        id: nextMessageId++,
        conversationId: conv1.id,
        senderId: faculty1.id,
        content: "The final project requires implementing a web application using the concepts we've covered in class. You'll need to include user authentication, database integration, and at least two core features. I'll send you the detailed document.",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 2100000) // 35 minutes ago
      },
      {
        id: nextMessageId++,
        conversationId: conv1.id,
        senderId: faculty1.id,
        content: "Here's the document with all the requirements. Let me know if you have any other questions.",
        attachmentName: "FinalProjectRequirements.pdf",
        attachmentSize: "245 KB",
        createdAt: new Date(now.getTime() - 1800000) // 30 minutes ago
      },

      // Messages for Conversation 2 (Maria & Prof. Michael Brown)
      {
        id: nextMessageId++,
        conversationId: conv2.id,
        senderId: student3.id,
        content: "Thank you for the feedback on my project.",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 86400000) // 1 day ago
      },

      // Messages for Conversation 3 (James & Dr. Emily Johnson)
      {
        id: nextMessageId++,
        conversationId: conv3.id,
        senderId: student4.id,
        content: "I need help with the calculus problem.",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 259200000) // 3 days ago
      },

      // Messages for Conversation 4 (Sarah & Prof. David Miller)
      {
        id: nextMessageId++,
        conversationId: conv4.id,
        senderId: student5.id,
        content: "Can we discuss my essay during office hours?",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 345600000) // 4 days ago
      },

      // Messages for Study Group
      {
        id: nextMessageId++,
        conversationId: studyGroup.id,
        senderId: student2.id,
        content: "Let's meet at the library tomorrow.",
        attachmentName: null,
        attachmentSize: null,
        createdAt: new Date(now.getTime() - 172800000) // 2 days ago
      },
    ];
    messages.push(...sampleMessages);
    
    console.log("✓ Test data initialized: 4 faculty members and 5 students");
    console.log("  Faculty: F-12345 (Dr. Sarah Wilson), F-67890 (Prof. Michael Brown), F-11111 (Dr. Emily Johnson), F-22222 (Prof. David Miller)");
    console.log("  Students: S-54321 (John Smith), S-11111 (Alex Johnson), S-22222 (Maria Garcia), S-33333 (James Wilson), S-44444 (Sarah Ahmed)");
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

    // Automatically add new users to sample conversations for demo purposes
    this.addUserToSampleConversations(user);

    return user;
  }

  private addUserToSampleConversations(newUser: User) {
    // Add new user to the CS 101 Study Group if it exists
    const studyGroupConv = conversations.find(c => c.name === "CS 101 Study Group");
    if (studyGroupConv) {
      const existingMember = conversationMembers.find(cm => 
        cm.conversationId === studyGroupConv.id && cm.userId === newUser.id
      );
      if (!existingMember) {
        conversationMembers.push({
          id: conversationMembers.length + 1,
          conversationId: studyGroupConv.id,
          userId: newUser.id,
          joinedAt: new Date()
        });
      }
    }

    // Create a sample conversation with one of the faculty members
    const availableFaculty = users.filter(u => u.role === 'faculty');
    if (availableFaculty.length > 0) {
      const randomFaculty = availableFaculty[Math.floor(Math.random() * availableFaculty.length)];
      
      // Check if conversation already exists between these users
      const existingConv = conversations.find(conv => {
        const members = conversationMembers.filter(cm => cm.conversationId === conv.id);
        return members.length === 2 && 
               members.some(m => m.userId === newUser.id) && 
               members.some(m => m.userId === randomFaculty.id);
      });

      if (!existingConv) {
        // Create new conversation
        const newConv: Conversation = {
          id: nextConversationId++,
          name: null,
          isGroup: false,
          createdAt: new Date(new Date().getTime() - Math.floor(Math.random() * 86400000)), // Random time in past day
          updatedAt: new Date(new Date().getTime() - Math.floor(Math.random() * 3600000)) // Random time in past hour
        };
        conversations.push(newConv);

        // Add members
        conversationMembers.push(
          { id: conversationMembers.length + 1, conversationId: newConv.id, userId: newUser.id, joinedAt: new Date() },
          { id: conversationMembers.length + 2, conversationId: newConv.id, userId: randomFaculty.id, joinedAt: new Date() }
        );

        // Add sample messages
        const sampleMessages = [
          `Hello ${newUser.role === 'faculty' ? 'Professor' : ''} ${newUser.fullName}, welcome to the university messaging system!`,
          `Hi! Thanks for reaching out. How can I help you today?`,
          `I wanted to introduce myself. Looking forward to working together this semester.`
        ];
        
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const isStudentSender = newUser.role === 'student';
        
        messages.push({
          id: nextMessageId++,
          conversationId: newConv.id,
          senderId: isStudentSender ? newUser.id : randomFaculty.id,
          content: randomMessage,
          attachmentName: null,
          attachmentSize: null,
          createdAt: new Date(new Date().getTime() - Math.floor(Math.random() * 3600000))
        });

        // Add a reply
        messages.push({
          id: nextMessageId++,
          conversationId: newConv.id,
          senderId: isStudentSender ? randomFaculty.id : newUser.id,
          content: "Great to meet you! Feel free to reach out if you have any questions.",
          attachmentName: null,
          attachmentSize: null,
          createdAt: new Date(new Date().getTime() - Math.floor(Math.random() * 1800000))
        });
      }
    }
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