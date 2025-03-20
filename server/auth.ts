import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import { storage, comparePasswords, hashPassword } from "./storage";
import { User as SelectUser, loginUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "university_management_system_secret_key";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "university_management_secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = loginUserSchema.extend({
        fullName: loginUserSchema.shape.username,
        email: loginUserSchema.shape.username,
      }).parse(req.body);

      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password),
      });

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          user: userWithoutPassword,
          token 
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  app.post("/api/login", async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = loginUserSchema.parse(req.body);

      const user = await storage.getUserByUsername(validatedData.username);
      
      // Check if user exists and role matches
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.role !== validatedData.role) {
        return res.status(401).json({ message: `Invalid role. You are not a ${validatedData.role}` });
      }
      
      // Verify password
      if (!(await comparePasswords(validatedData.password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      // Login through passport
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({ 
          user: userWithoutPassword,
          token 
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from user object
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    
    res.json(userWithoutPassword);
  });

  // Endpoint to request password reset
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { username, role } = req.body;
      
      if (!username || !role) {
        return res.status(400).json({ message: "Username and role are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.role !== role) {
        // Don't reveal if user exists for security reasons
        return res.status(200).json({ message: "If your account exists, a password reset link has been sent to your email" });
      }
      
      // In a real app, you would send an email with a reset link
      // For this demo, we'll just return a success message
      
      res.status(200).json({ 
        message: "If your account exists, a password reset link has been sent to your email",
        // In a real app, don't return the following information
        note: "This is just a demo - no actual email is sent"
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  });
}
