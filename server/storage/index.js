import { memoryStorage } from "./memory-storage.js";

console.log("Using memory storage for data persistence");

export class DatabaseStorage {
  constructor() {
    this.sessionStore = memoryStorage.sessionStore;
  }

  async getUser(id) {
    return memoryStorage.getUser(id);
  }

  async getUserByUsername(username) {
    return memoryStorage.getUserByUsername(username);
  }

  async getUserByUniversityId(universityId) {
    return memoryStorage.getUserByUniversityId(universityId);
  }

  async getUserByEmail(email) {
    return memoryStorage.getUserByEmail(email);
  }

  async createUser(insertUser) {
    return memoryStorage.createUser(insertUser);
  }

  async getFacultyList() {
    return memoryStorage.getFacultyList();
  }

  async createCallbackRequest(request) {
    return memoryStorage.createCallbackRequest(request);
  }

  async getStudentRequests(studentId) {
    return memoryStorage.getStudentRequests(studentId);
  }

  async getFacultyRequests(facultyId) {
    return memoryStorage.getFacultyRequests(facultyId);
  }

  async updateRequestStatus(requestId, status) {
    return memoryStorage.updateRequestStatus(requestId, status);
  }

  async createConversation(conversation, creatorId) {
    return memoryStorage.createConversation(conversation, creatorId);
  }

  async getUserConversations(userId) {
    return memoryStorage.getUserConversations(userId);
  }

  async createMessage(message, senderId) {
    return memoryStorage.createMessage(message, senderId);
  }

  async getConversationMessages(conversationId, userId) {
    return memoryStorage.getConversationMessages(conversationId, userId);
  }

  async createClassroom(classroom) {
    return memoryStorage.createClassroom(classroom);
  }

  async getClassrooms() {
    return memoryStorage.getClassrooms();
  }

  async createTimetableEntry(entry) {
    return memoryStorage.createTimetableEntry(entry);
  }

  async getTimetable() {
    return memoryStorage.getTimetable();
  }

  async getAllUsers() {
    return memoryStorage.getAllUsers();
  }

  async getFreeClassrooms(day, startTime, endTime) {
    return memoryStorage.getFreeClassrooms(day, startTime, endTime);
  }
}

export const storage = new DatabaseStorage();
