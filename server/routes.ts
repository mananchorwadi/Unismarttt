import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { userRoles } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get students list (faculty only)
  app.get("/api/students", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user;
    if (user?.role !== userRoles.FACULTY) {
      return res.status(403).json({ message: "Faculty access only" });
    }

    try {
      const students = await storage.getAllUsersByRole(userRoles.STUDENT);
      // Strip out passwords for security
      const sanitizedStudents = students.map(student => {
        const { password, ...rest } = student;
        return rest;
      });
      
      res.json(sanitizedStudents);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve students" });
    }
  });

  // Get faculty list (for student dashboard)
  app.get("/api/faculty", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const faculty = await storage.getAllUsersByRole(userRoles.FACULTY);
      // Strip out passwords for security
      const sanitizedFaculty = faculty.map(f => {
        const { password, ...rest } = f;
        return rest;
      });
      
      res.json(sanitizedFaculty);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve faculty" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
