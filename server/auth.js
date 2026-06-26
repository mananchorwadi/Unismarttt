import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { storage } from "./storage.js";
import { hashPassword, comparePasswords } from "./memory-storage.js";
import { loginSchema, registerUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { formatZodError } from "./utils.js";

export function setupAuth(app) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "universityManagementSecretKey",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production"
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

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

          const user = await storage.getUserByUniversityId(universityId);

          if (!user) {
            return done(null, false, { message: "Incorrect university ID or password" });
          }

          if (user.role !== role) {
            return done(null, false, { message: `This ID is not registered as a ${role}` });
          }

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
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);

      const existingUserByUniversityId = await storage.getUserByUniversityId(validatedData.universityId);
      if (existingUserByUniversityId) {
        return res.status(400).json({ message: "University ID already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const username = validatedData.universityId.toLowerCase();

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(validatedData.password);

      const userData = {
        ...validatedData,
        username,
        password: hashedPassword
      };

      const user = await storage.createUser(userData);

      const { password, ...userWithoutPassword } = user;

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

  app.post("/api/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);

      passport.authenticate("local", (err, user, info) => {
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

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { password, ...userWithoutPassword } = req.user;

    res.json(userWithoutPassword);
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);

    res.status(200).json({
      message: "If a user with that email exists, a password reset link will be sent to their email"
    });
  });
}
