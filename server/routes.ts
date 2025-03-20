import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

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
  
  // Additional routes can be added here for university management
  
  const httpServer = createServer(app);
  
  return httpServer;
}
