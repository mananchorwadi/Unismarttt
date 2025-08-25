import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  createCallbackRequestSchema, 
  updateCallbackRequestSchema,
  createMessageSchema,
  createConversationSchema,
  createClassroomSchema,
  createTimetableSchema,
  getFreeClassroomsSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { formatZodError } from "./utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Get user profile (legacy endpoint for frontend compatibility)
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    
    res.json(userWithoutPassword);
  });

  // Get user profile
  app.get("/api/profile", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    
    res.json(userWithoutPassword);
  });

  // Get faculty list for dropdown
  app.get("/api/faculty", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const facultyList = await storage.getFacultyList();
      const facultyData = facultyList.map(faculty => ({
        id: faculty.id,
        fullName: faculty.fullName,
        universityId: faculty.universityId,
      }));
      res.json(facultyData);
    } catch (error) {
      console.error("Error fetching faculty list:", error);
      res.status(500).json({ message: "Failed to fetch faculty list" });
    }
  });

  // Student creates callback request
  app.post("/api/student/request-callback", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: "Only students can create callback requests" });
    }

    try {
      const validatedData = createCallbackRequestSchema.parse(req.body);
      const request = await storage.createCallbackRequest({
        ...validatedData,
        studentId: req.user.id,
      });
      
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error creating callback request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  // Get student's requests
  app.get("/api/student/requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: "Only students can view their requests" });
    }

    try {
      const requests = await storage.getStudentRequests(req.user.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching student requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Get faculty's requests
  app.get("/api/faculty/requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: "Only faculty can view assigned requests" });
    }

    try {
      const requests = await storage.getFacultyRequests(req.user.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching faculty requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Faculty updates request status
  app.put("/api/faculty/request/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: "Only faculty can update request status" });
    }

    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      const validatedData = updateCallbackRequestSchema.parse(req.body);
      const updatedRequest = await storage.updateRequestStatus(requestId, validatedData.status);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error updating request status:", error);
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  // MESSAGING API ROUTES

  // Get user's conversations
  app.get("/api/conversations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const conversations = await storage.getUserConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = createConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData, req.user.id);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Get conversation messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const conversationId = parseInt(req.params.id);
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const messages = await storage.getConversationMessages(conversationId, req.user.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message
  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = createMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData, req.user.id);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // CLASSROOM UTILIZATION API ROUTES

  // Get all classrooms
  app.get("/api/classrooms", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const classrooms = await storage.getClassrooms();
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  // Create new classroom (admin/faculty only)
  app.post("/api/classrooms", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: "Only faculty can create classrooms" });
    }

    try {
      const validatedData = createClassroomSchema.parse(req.body);
      const classroom = await storage.createClassroom(validatedData);
      res.status(201).json(classroom);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error creating classroom:", error);
      res.status(500).json({ message: "Failed to create classroom" });
    }
  });

  // Get timetable
  app.get("/api/timetable", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const timetable = await storage.getTimetable();
      res.json(timetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(500).json({ message: "Failed to fetch timetable" });
    }
  });

  // Add timetable entry (faculty only)
  app.post("/api/timetable", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: "Only faculty can add timetable entries" });
    }

    try {
      const validatedData = createTimetableSchema.parse(req.body);
      const entry = await storage.createTimetableEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error creating timetable entry:", error);
      res.status(500).json({ message: "Failed to create timetable entry" });
    }
  });

  // Get free classrooms (student feature)
  app.get("/api/free-classrooms", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: "Only students can check free classrooms" });
    }

    try {
      const { day, startTime, endTime } = req.query;
      
      // If no day specified, use current day
      const currentDay = day as string || new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      const validatedData = getFreeClassroomsSchema.parse({
        day: currentDay,
        startTime,
        endTime
      });
      
      const freeClassrooms = await storage.getFreeClassrooms(
        validatedData.day || currentDay,
        validatedData.startTime,
        validatedData.endTime
      );
      
      res.json(freeClassrooms);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      console.error("Error fetching free classrooms:", error);
      res.status(500).json({ message: "Failed to fetch free classrooms" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
