import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { createCallbackRequestSchema, updateCallbackRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { formatZodError } from "./utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
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
  
  const httpServer = createServer(app);
  
  return httpServer;
}
