import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty'
};

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

export const registerUserSchema = insertUserSchema
  .omit({ username: true })
  .extend({
    universityId: z.string()
      .refine(val => {
        const facultyPattern = /^F-\d{5}$/;
        const studentPattern = /^S-\d{5}$/;
        return facultyPattern.test(val) || studentPattern.test(val);
      }, "University ID must be in format F-XXXXX (faculty) or S-XXXXX (student)"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Please provide a valid email address"),
    role: z.enum([ROLES.FACULTY, ROLES.STUDENT])
  });

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

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address")
});

export const callbackRequests = pgTable("callback_requests", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  facultyId: integer("faculty_id").references(() => users.id),
  subject: text("subject").notNull(),
  preferredTime: timestamp("preferred_time").notNull(),
  status: text("status", { enum: ['Pending', 'Accepted', 'Rejected', 'Completed'] }).default('Pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  name: text("name"),
  isGroup: boolean("is_group").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationMembers = pgTable("conversation_members", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  userId: integer("user_id").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  senderId: integer("sender_id").references(() => users.id),
  content: text("content").notNull(),
  attachmentName: text("attachment_name"),
  attachmentSize: text("attachment_size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  roomNo: text("room_no").notNull().unique(),
  building: text("building"),
  capacity: integer("capacity").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timetable = pgTable("timetable", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => classrooms.id),
  courseName: text("course_name").notNull(),
  facultyName: text("faculty_name").notNull(),
  dayOfWeek: text("day_of_week", { enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const createCallbackRequestSchema = z.object({
  facultyId: z.number().min(1, "Faculty must be selected"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  preferredTime: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Preferred time must be in the future"
  ),
});

export const updateCallbackRequestSchema = z.object({
  status: z.enum(['Pending', 'Accepted', 'Rejected', 'Completed']),
});

export const createMessageSchema = z.object({
  conversationId: z.number().min(1, "Conversation must be selected"),
  content: z.string().min(1, "Message cannot be empty"),
  attachmentName: z.string().optional(),
  attachmentSize: z.string().optional(),
});

export const createConversationSchema = z.object({
  name: z.string().optional(),
  isGroup: z.boolean().default(false),
  members: z.array(z.number()).min(1, "At least one member must be selected"),
});

export const createClassroomSchema = z.object({
  roomNo: z.string().min(1, "Room number is required"),
  building: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
});

export const createTimetableSchema = z.object({
  roomId: z.number().min(1, "Room must be selected"),
  courseName: z.string().min(1, "Course name is required"),
  facultyName: z.string().min(1, "Faculty name is required"),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
});

export const getFreeClassroomsSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
});
