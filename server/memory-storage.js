import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const MemoryStore = createMemoryStore(session);

let users = [];
let callbackRequests = [];
let conversations = [];
let conversationMembers = [];
let messages = [];
let classrooms = [];
let timetable = [];
let nextUserId = 1;
let nextRequestId = 1;
let nextConversationId = 1;
let nextMessageId = 1;
let nextClassroomId = 1;
let nextTimetableId = 1;

async function initializeTestData() {
  if (users.length === 0) {
    const testFaculty1 = {
      universityId: "F-12345",
      fullName: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      password: await hashPassword("password123"),
      role: "faculty",
    };

    const testFaculty2 = {
      universityId: "F-67890",
      fullName: "Prof. Michael Brown",
      email: "michael.brown@university.edu",
      password: await hashPassword("password123"),
      role: "faculty",
    };

    const testFaculty3 = {
      universityId: "F-11111",
      fullName: "Dr. Emily Johnson",
      email: "emily.johnson@university.edu",
      password: await hashPassword("password123"),
      role: "faculty",
    };

    const testFaculty4 = {
      universityId: "F-22222",
      fullName: "Prof. David Miller",
      email: "david.miller@university.edu",
      password: await hashPassword("password123"),
      role: "faculty",
    };

    const testStudent1 = {
      universityId: "S-54321",
      fullName: "John Smith",
      email: "john.smith@student.university.edu",
      password: await hashPassword("password123"),
      role: "student",
    };

    const testStudent2 = {
      universityId: "S-11111",
      fullName: "Alex Johnson",
      email: "alex.johnson@student.university.edu",
      password: await hashPassword("password123"),
      role: "student",
    };

    const testStudent3 = {
      universityId: "S-22222",
      fullName: "Maria Garcia",
      email: "maria.garcia@student.university.edu",
      password: await hashPassword("password123"),
      role: "student",
    };

    const testStudent4 = {
      universityId: "S-33333",
      fullName: "James Wilson",
      email: "james.wilson@student.university.edu",
      password: await hashPassword("password123"),
      role: "student",
    };

    const testStudent5 = {
      universityId: "S-44444",
      fullName: "Sarah Ahmed",
      email: "sarah.ahmed@student.university.edu",
      password: await hashPassword("password123"),
      role: "student",
    };

    const faculty1 = { ...testFaculty1, id: nextUserId++, createdAt: new Date(), username: testFaculty1.universityId };
    const faculty2 = { ...testFaculty2, id: nextUserId++, createdAt: new Date(), username: testFaculty2.universityId };
    const faculty3 = { ...testFaculty3, id: nextUserId++, createdAt: new Date(), username: testFaculty3.universityId };
    const faculty4 = { ...testFaculty4, id: nextUserId++, createdAt: new Date(), username: testFaculty4.universityId };
    const student1 = { ...testStudent1, id: nextUserId++, createdAt: new Date(), username: testStudent1.universityId };
    const student2 = { ...testStudent2, id: nextUserId++, createdAt: new Date(), username: testStudent2.universityId };
    const student3 = { ...testStudent3, id: nextUserId++, createdAt: new Date(), username: testStudent3.universityId };
    const student4 = { ...testStudent4, id: nextUserId++, createdAt: new Date(), username: testStudent4.universityId };
    const student5 = { ...testStudent5, id: nextUserId++, createdAt: new Date(), username: testStudent5.universityId };

    users.push(faculty1, faculty2, faculty3, faculty4, student1, student2, student3, student4, student5);

    const sampleClassrooms = [
      { id: nextClassroomId++, roomNo: "C101", building: "Computer Science Building", capacity: 30, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "C102", building: "Computer Science Building", capacity: 50, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "C103", building: "Computer Science Building", capacity: 40, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "M201", building: "Mathematics Building", capacity: 35, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "M202", building: "Mathematics Building", capacity: 45, createdAt: new Date() },
      { id: nextClassroomId++, roomNo: "E301", building: "Engineering Building", capacity: 60, createdAt: new Date() },
    ];
    classrooms.push(...sampleClassrooms);

    const sampleTimetable = [
      { id: nextTimetableId++, roomId: 1, courseName: "CS 101", facultyName: "Dr. Sarah Wilson", dayOfWeek: "Monday", startTime: "09:00", endTime: "10:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 1, courseName: "CS 205", facultyName: "Prof. Michael Brown", dayOfWeek: "Monday", startTime: "11:00", endTime: "12:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 2, courseName: "CS 301", facultyName: "Dr. Sarah Wilson", dayOfWeek: "Monday", startTime: "14:00", endTime: "15:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 1, courseName: "CS 101", facultyName: "Dr. Sarah Wilson", dayOfWeek: "Tuesday", startTime: "10:00", endTime: "11:30", createdAt: new Date() },
      { id: nextTimetableId++, roomId: 3, courseName: "CS 205", facultyName: "Prof. Michael Brown", dayOfWeek: "Wednesday", startTime: "13:00", endTime: "14:30", createdAt: new Date() },
    ];
    timetable.push(...sampleTimetable);

    const now = new Date();
    let memberIdCounter = 1;

    const conv1 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 86400000), updatedAt: new Date(now.getTime() - 1800000) };
    conversations.push(conv1);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv1.id, userId: student2.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv1.id, userId: faculty1.id, joinedAt: new Date() }
    );

    const conv2 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 172800000), updatedAt: new Date(now.getTime() - 86400000) };
    conversations.push(conv2);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv2.id, userId: student3.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv2.id, userId: faculty2.id, joinedAt: new Date() }
    );

    const conv3 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 259200000), updatedAt: new Date(now.getTime() - 259200000) };
    conversations.push(conv3);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv3.id, userId: student4.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv3.id, userId: faculty3.id, joinedAt: new Date() }
    );

    const conv4 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 604800000), updatedAt: new Date(now.getTime() - 345600000) };
    conversations.push(conv4);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv4.id, userId: student5.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv4.id, userId: faculty4.id, joinedAt: new Date() }
    );

    const studyGroup = { id: nextConversationId++, name: "CS 101 Study Group", isGroup: true, createdAt: new Date(now.getTime() - 432000000), updatedAt: new Date(now.getTime() - 172800000) };
    conversations.push(studyGroup);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student1.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student2.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student3.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: studyGroup.id, userId: student4.id, joinedAt: new Date() }
    );

    const conv6 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 518400000), updatedAt: new Date(now.getTime() - 7200000) };
    conversations.push(conv6);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv6.id, userId: student1.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv6.id, userId: faculty2.id, joinedAt: new Date() }
    );

    const conv7 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 1209600000), updatedAt: new Date(now.getTime() - 900000) };
    conversations.push(conv7);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv7.id, userId: student2.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv7.id, userId: faculty3.id, joinedAt: new Date() }
    );

    const advancedGroup = { id: nextConversationId++, name: "CS 205 Advanced Group", isGroup: true, createdAt: new Date(now.getTime() - 1036800000), updatedAt: new Date(now.getTime() - 43200000) };
    conversations.push(advancedGroup);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: advancedGroup.id, userId: student3.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: advancedGroup.id, userId: student4.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: advancedGroup.id, userId: student5.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: advancedGroup.id, userId: faculty2.id, joinedAt: new Date() }
    );

    const conv9 = { id: nextConversationId++, name: null, isGroup: false, createdAt: new Date(now.getTime() - 777600000), updatedAt: new Date(now.getTime() - 21600000) };
    conversations.push(conv9);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: conv9.id, userId: student5.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: conv9.id, userId: faculty1.id, joinedAt: new Date() }
    );

    const mathGroup = { id: nextConversationId++, name: "Math Study Group", isGroup: true, createdAt: new Date(now.getTime() - 864000000), updatedAt: new Date(now.getTime() - 3600000) };
    conversations.push(mathGroup);
    conversationMembers.push(
      { id: memberIdCounter++, conversationId: mathGroup.id, userId: student1.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: mathGroup.id, userId: student4.id, joinedAt: new Date() },
      { id: memberIdCounter++, conversationId: mathGroup.id, userId: student5.id, joinedAt: new Date() }
    );

    const sampleMessages = [
      { id: nextMessageId++, conversationId: conv1.id, senderId: student2.id, content: "Hello Professor, I have a question about the upcoming assignment.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 3600000) },
      { id: nextMessageId++, conversationId: conv1.id, senderId: faculty1.id, content: "Of course, what would you like to know?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 2700000) },
      { id: nextMessageId++, conversationId: conv1.id, senderId: student2.id, content: "I'm not sure about the requirements for the final project. Could you provide more details?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 2400000) },
      { id: nextMessageId++, conversationId: conv1.id, senderId: faculty1.id, content: "The final project requires implementing a web application using the concepts we've covered in class. You'll need to include user authentication, database integration, and at least two core features. I'll send you the detailed document.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 2100000) },
      { id: nextMessageId++, conversationId: conv1.id, senderId: faculty1.id, content: "Here's the document with all the requirements. Let me know if you have any other questions.", attachmentName: "FinalProjectRequirements.pdf", attachmentSize: "245 KB", createdAt: new Date(now.getTime() - 1800000) },
      { id: nextMessageId++, conversationId: conv2.id, senderId: student3.id, content: "Thank you for the feedback on my project.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 86400000) },
      { id: nextMessageId++, conversationId: conv3.id, senderId: student4.id, content: "I need help with the calculus problem.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 259200000) },
      { id: nextMessageId++, conversationId: conv4.id, senderId: student5.id, content: "Can we discuss my essay during office hours?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 345600000) },
      { id: nextMessageId++, conversationId: studyGroup.id, senderId: student2.id, content: "Let's meet at the library tomorrow.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 172800000) },
      { id: nextMessageId++, conversationId: conv6.id, senderId: student1.id, content: "Professor, I'm struggling with the data structures assignment. Could we schedule a meeting?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 86400000) },
      { id: nextMessageId++, conversationId: conv6.id, senderId: faculty2.id, content: "Of course! How about tomorrow at 2 PM in my office?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 7200000) },
      { id: nextMessageId++, conversationId: conv7.id, senderId: faculty3.id, content: "Alex, I've reviewed your midterm exam. Great work overall!", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 1800000) },
      { id: nextMessageId++, conversationId: conv7.id, senderId: student2.id, content: "Thank you! I was worried about question 3. Any areas I should focus on for the final?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 900000) },
      { id: nextMessageId++, conversationId: advancedGroup.id, senderId: faculty2.id, content: "Don't forget about the algorithm optimization project due next week!", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 86400000) },
      { id: nextMessageId++, conversationId: advancedGroup.id, senderId: student3.id, content: "I've been working on the binary tree implementation. Almost done!", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 43200000) },
      { id: nextMessageId++, conversationId: conv9.id, senderId: student5.id, content: "Hi Dr. Wilson! I have some questions about the research project proposal.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 172800000) },
      { id: nextMessageId++, conversationId: conv9.id, senderId: faculty1.id, content: "I'd be happy to help! I've attached some reference papers that might be useful.", attachmentName: "ResearchReferences.zip", attachmentSize: "2.1 MB", createdAt: new Date(now.getTime() - 21600000) },
      { id: nextMessageId++, conversationId: mathGroup.id, senderId: student4.id, content: "Anyone free to study for the calculus exam this weekend?", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 7200000) },
      { id: nextMessageId++, conversationId: mathGroup.id, senderId: student1.id, content: "I'm in! Saturday afternoon works for me.", attachmentName: null, attachmentSize: null, createdAt: new Date(now.getTime() - 3600000) },
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

initializeTestData();

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export class MemoryStorage {
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id) {
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username) {
    return users.find(user => user.username === username);
  }

  async getUserByUniversityId(universityId) {
    return users.find(user => user.universityId === universityId);
  }

  async getUserByEmail(email) {
    return users.find(user => user.email === email);
  }

  async createUser(insertUser) {
    const user = {
      ...insertUser,
      id: nextUserId++,
      createdAt: new Date(),
    };
    users.push(user);
    this.addUserToSampleConversations(user);
    return user;
  }

  addUserToSampleConversations(newUser) {
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

    const availableFaculty = users.filter(u => u.role === 'faculty');
    if (availableFaculty.length > 0) {
      const randomFaculty = availableFaculty[Math.floor(Math.random() * availableFaculty.length)];

      const existingConv = conversations.find(conv => {
        const members = conversationMembers.filter(cm => cm.conversationId === conv.id);
        return members.length === 2 &&
               members.some(m => m.userId === newUser.id) &&
               members.some(m => m.userId === randomFaculty.id);
      });

      if (!existingConv) {
        const newConv = {
          id: nextConversationId++,
          name: null,
          isGroup: false,
          createdAt: new Date(new Date().getTime() - Math.floor(Math.random() * 86400000)),
          updatedAt: new Date(new Date().getTime() - Math.floor(Math.random() * 3600000))
        };
        conversations.push(newConv);

        conversationMembers.push(
          { id: conversationMembers.length + 1, conversationId: newConv.id, userId: newUser.id, joinedAt: new Date() },
          { id: conversationMembers.length + 2, conversationId: newConv.id, userId: randomFaculty.id, joinedAt: new Date() }
        );

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

  async getFacultyList() {
    return users.filter(user => user.role === 'faculty');
  }

  async getAllUsers() {
    return users;
  }

  async createCallbackRequest(request) {
    const newRequest = {
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

  async getStudentRequests(studentId) {
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

  async getFacultyRequests(facultyId) {
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

  async updateRequestStatus(requestId, status) {
    const requestIndex = callbackRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return undefined;

    callbackRequests[requestIndex].status = status;
    return callbackRequests[requestIndex];
  }

  async createConversation(conversation, creatorId) {
    const newConversation = {
      id: nextConversationId++,
      name: conversation.name || null,
      isGroup: conversation.isGroup || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversations.push(newConversation);

    const allMembers = Array.from(new Set([creatorId, ...conversation.members]));

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

  async getUserConversations(userId) {
    const userConvoIds = conversationMembers
      .filter(cm => cm.userId === userId)
      .map(cm => cm.conversationId);

    const userConversations = conversations
      .filter(conv => userConvoIds.includes(conv.id))
      .map(conv => {
        const convMessages = messages
          .filter(msg => msg.conversationId === conv.id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const lastMessage = convMessages[0];

        const memberIds = conversationMembers
          .filter(cm => cm.conversationId === conv.id)
          .map(cm => cm.userId);

        const members = users.filter(u => memberIds.includes(u.id));

        return {
          ...conv,
          lastMessage,
          unreadCount: 0,
          members
        };
      });

    return userConversations;
  }

  async createMessage(message, senderId) {
    const newMessage = {
      id: nextMessageId++,
      conversationId: message.conversationId,
      senderId: senderId,
      content: message.content,
      attachmentName: message.attachmentName || null,
      attachmentSize: message.attachmentSize || null,
      createdAt: new Date(),
    };
    messages.push(newMessage);

    const convIndex = conversations.findIndex(c => c.id === message.conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].updatedAt = new Date();
    }

    return newMessage;
  }

  async getConversationMessages(conversationId, userId) {
    const isMember = conversationMembers.some(cm =>
      cm.conversationId === conversationId && cm.userId === userId
    );

    if (!isMember) {
      return [];
    }

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

  async createClassroom(classroom) {
    const newClassroom = {
      id: nextClassroomId++,
      roomNo: classroom.roomNo,
      building: classroom.building || null,
      capacity: classroom.capacity || 0,
      createdAt: new Date(),
    };
    classrooms.push(newClassroom);
    return newClassroom;
  }

  async getClassrooms() {
    return [...classrooms];
  }

  async createTimetableEntry(entry) {
    const newEntry = {
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

  async getTimetable() {
    return timetable.map(entry => {
      const room = classrooms.find(r => r.id === entry.roomId);
      return {
        ...entry,
        roomNo: room ? room.roomNo : 'Unknown Room'
      };
    });
  }

  async getAllUsers() {
    return users;
  }

  async getFreeClassrooms(day, startTime, endTime) {
    const occupiedRoomIds = timetable
      .filter(entry =>
        entry.dayOfWeek === day &&
        this.isTimeOverlapping(entry.startTime, entry.endTime, startTime, endTime)
      )
      .map(entry => entry.roomId);

    const freeClassrooms = classrooms
      .filter(room => !occupiedRoomIds.includes(room.id))
      .map(room => {
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

  isTimeOverlapping(start1, end1, start2, end2) {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    return s1 < e2 && e1 > s2;
  }

  getInitials(name) {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

export const memoryStorage = new MemoryStorage();
