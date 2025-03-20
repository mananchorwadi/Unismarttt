import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { loginSchema, registerUserSchema, User as SelectUser } from "@shared/schema";
import { ZodError } from "zod";
import { formatZodError } from "./utils";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "universityManagementSecretKey",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Custom field logic for university ID
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'universityId',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, universityId, password, done) => {
        try {
          const { role } = req.body;
          
          // Check if user exists with university ID
          const user = await storage.getUserByUniversityId(universityId);
          
          if (!user) {
            return done(null, false, { message: "Incorrect university ID or password" });
          }
          
          // Check if role matches
          if (user.role !== role) {
            return done(null, false, { message: `This ID is not registered as a ${role}` });
          }
          
          // Check password
          if (!(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Incorrect university ID or password" });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // Register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate the registration data
      const userData = registerUserSchema.parse(req.body);
      
      // Check if user already exists with university ID
      const existingUserByUniversityId = await storage.getUserByUniversityId(userData.universityId);
      if (existingUserByUniversityId) {
        return res.status(400).json({ message: "University ID already exists" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Determine the username from university ID (for simplicity)
      const username = userData.universityId.toLowerCase();
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        username,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    try {
      // Validate login data
      loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: Error, user: SelectUser, info: { message: string }) => {
        if (err) {
          return next(err);
        }
        
        if (!user) {
          return res.status(401).json({ message: info?.message || "Authentication failed" });
        }
        
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          
          return res.status(200).json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: formatZodError(error) });
      }
      next(error);
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    
    res.json(userWithoutPassword);
  });

  // Forgot password endpoint
  app.post("/api/forgot-password", async (req, res) => {
    // Simple mock implementation - in a real app, this would send an email
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Check if user exists with email
    const user = await storage.getUserByEmail(email);
    
    // Always return success to prevent email enumeration
    res.status(200).json({ 
      message: "If a user with that email exists, a password reset link will be sent to their email"
    });
  });
}
