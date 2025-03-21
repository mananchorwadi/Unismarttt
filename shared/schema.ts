import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty'
} as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: [ROLES.STUDENT, ROLES.FACULTY] }).notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  universityId: text("university_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  fullName: true,
  email: true,
  universityId: true,
});

// Add validation for user registration
export const registerUserSchema = insertUserSchema
  .omit({ username: true }) // Remove username from required fields
  .extend({
    universityId: z.string()
      .refine(val => {
        // Faculty IDs must match F-XXXXX pattern
        // Student IDs must match S-XXXXX pattern
        const facultyPattern = /^F-\d{5}$/;
        const studentPattern = /^S-\d{5}$/;
        return facultyPattern.test(val) || studentPattern.test(val);
      }, "University ID must be in format F-XXXXX (faculty) or S-XXXXX (student)"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Please provide a valid email address"),
    role: z.enum([ROLES.FACULTY, ROLES.STUDENT])
  });

// Login schema
export const loginSchema = z.object({
  universityId: z.string()
    .refine(val => {
      const facultyPattern = /^F-\d{5}$/;
      const studentPattern = /^S-\d{5}$/;
      return facultyPattern.test(val) || studentPattern.test(val);
    }, "University ID must be in format F-XXXXX (faculty) or S-XXXXX (student)"),
  password: z.string().min(1, "Password is required"),
  role: z.enum([ROLES.FACULTY, ROLES.STUDENT])
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address")
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type User = typeof users.$inferSelect;
