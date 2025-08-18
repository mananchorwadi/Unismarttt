# Complete University Management System Recreation Prompt

## Project Overview

Create a comprehensive University Management System with advanced role-based authentication featuring secure student and faculty interactions. This is a full-stack TypeScript application with a modern React frontend, Express backend, and complete Student-Faculty Request Callback system.

## Core Architecture Requirements

### Tech Stack Foundation
- **Frontend**: React 18.3+ with TypeScript and Vite as build tool
- **Backend**: Node.js with Express.js framework (TypeScript ES modules)
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations
- **Authentication**: Passport.js local strategy with session-based auth
- **State Management**: TanStack Query v5 for server state
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with Radix UI primitives
- **UI Components**: shadcn/ui component system

### Visual Design Theme
```json
{
  "variant": "professional",
  "primary": "hsl(222.2 47.4% 30%)",
  "appearance": "light", 
  "radius": 0.5
}
```
- Professional dark blue color scheme
- Clean, modern interface with rounded corners (0.5rem radius)
- Responsive grid-based layout for mobile, tablet, desktop
- Consistent spacing and typography using Tailwind classes

## Database Schema & Data Models

### Users Table (PostgreSQL)
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // scrypt hashed with salt
  role: text("role", { enum: ['student', 'faculty'] }).notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  universityId: text("university_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Callback Requests Table (PostgreSQL)
```typescript
export const callbackRequests = pgTable("callback_requests", {
  id: serial("id").primaryKey(),
  studentId: serial("student_id").references(() => users.id),
  facultyId: serial("faculty_id").references(() => users.id),
  subject: text("subject").notNull(),
  preferredTime: timestamp("preferred_time").notNull(),
  status: text("status", { enum: ['Pending', 'Accepted', 'Rejected', 'Completed'] }).default('Pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Authentication System

### University ID Format Validation
- **Faculty IDs**: F-XXXXX (e.g., F-12345)
- **Student IDs**: S-XXXXX (e.g., S-54321)
- Strict regex validation: `/^F-\d{5}$/` for faculty, `/^S-\d{5}$/` for students

### Password Security
- Minimum 6 characters required
- Hashed using Node.js crypto.scrypt with random salt
- Session-based authentication with Passport.js local strategy

### Test Data to Include
```javascript
// Faculty accounts
{ universityId: "F-12345", password: "password123", fullName: "Dr. Sarah Wilson", email: "sarah@university.edu", role: "faculty" }
{ universityId: "F-67890", password: "password123", fullName: "Prof. Michael Brown", email: "michael@university.edu", role: "faculty" }

// Student account  
{ universityId: "S-54321", password: "password123", fullName: "John Smith", email: "john@student.edu", role: "student" }
```

## Complete API Endpoints

### Authentication Endpoints
- `POST /api/register` - User registration with role-specific validation
- `POST /api/login` - University ID + password authentication
- `POST /api/logout` - Session destruction
- `GET /api/user` - Get current authenticated user

### Callback System Endpoints
- `GET /api/faculty` - List all faculty members (for student dropdown)
- `POST /api/student/request-callback` - Create new callback request (student only)
- `GET /api/student/requests` - Fetch student's requests with faculty names
- `GET /api/faculty/requests` - Fetch faculty's requests with student details  
- `PUT /api/faculty/request/:id` - Update request status (faculty only)

## Frontend Application Structure

### Core Pages & Routes
```typescript
// Main pages with exact paths
"/login" - Login form (university ID + password + role selection)
"/register" - Registration form with role-based validation
"/dashboard" - Role-based dashboard (student vs faculty views)
"/request-callback" - Student interface for creating/tracking requests
"/faculty-requests" - Faculty interface for managing incoming requests
```

### Dashboard Layout Components
- **Sidebar Navigation**: Role-based menu items with icons
  - Students: Dashboard, Request Callback
  - Faculty: Dashboard, Requests to Me
- **Header**: User info, logout button, responsive design
- **Main Content**: Cards-based layout with proper spacing

## Student-Faculty Request Callback System

### Student Interface (`/request-callback`)
```typescript
// Two-column layout with form and requests tracker
// Left: New Request Form
- Faculty dropdown (with university IDs visible)
- Subject textarea (minimum 3 characters)
- Preferred datetime picker (future dates only)
- Submit button with loading states

// Right: My Requests Tracker  
- Status badges with icons (Pending/Accepted/Rejected/Completed)
- Faculty name and university ID display
- Request subject and preferred time
- Creation date tracking
- Real-time status updates
```

### Faculty Interface (`/faculty-requests`)
```typescript
// Status overview cards at top (4 columns)
- Pending requests count with Clock icon
- Accepted requests count with CheckCircle icon  
- Completed requests count with CheckCircle icon
- Total requests count with User icon

// Request management list below
- Student name and university ID display
- Request subject and preferred time
- Action buttons for Pending requests (Accept/Reject)
- Mark Completed button for Accepted requests
- Status badges with proper color coding
- Real-time updates after status changes
```

### Status Badge System
```typescript
const statusConfig = {
  Pending: { variant: "default", icon: <Clock className="h-3 w-3" />, color: "gray" },
  Accepted: { variant: "secondary", icon: <CheckCircle className="h-3 w-3" />, color: "blue" },
  Rejected: { variant: "destructive", icon: <XCircle className="h-3 w-3" />, color: "red" },
  Completed: { variant: "outline", icon: <CheckCircle className="h-3 w-3" />, color: "green" }
};
```

## Required Dependencies (Exact Versions)

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1", 
  "typescript": "5.6.3",
  "vite": "^5.4.14",
  "express": "^4.21.2",
  "drizzle-orm": "^0.39.1",
  "drizzle-zod": "^0.7.0",
  "postgres": "^3.4.5",
  "@tanstack/react-query": "^5.60.5",
  "wouter": "^3.3.5",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "express-session": "^1.18.1"
}
```

### UI & Styling Dependencies
```json
{
  "@radix-ui/react-select": "^2.1.2",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-dropdown-menu": "^2.1.2",
  "@radix-ui/react-toast": "^1.2.2",
  "tailwindcss": "^3.4.14",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.4",
  "lucide-react": "^0.453.0",
  "framer-motion": "^11.18.2"
}
```

### Form & Validation Dependencies
```json
{
  "react-hook-form": "^7.53.1",
  "@hookform/resolvers": "^3.9.1", 
  "zod": "^3.23.8",
  "zod-validation-error": "^3.4.0"
}
```

## Storage Implementation (Memory + PostgreSQL Fallback)

### Memory Storage for Development
```typescript
// Implement IStorage interface with in-memory data persistence
// Include callback request CRUD operations
// Maintain relationships between users and requests
// Support status updates and queries by role
```

### Database Storage for Production
```typescript
// PostgreSQL implementation using Drizzle ORM
// Proper foreign key relationships
// Transaction support for data integrity
// Connection pooling for performance
```

## Key Implementation Requirements

### TypeScript Safety
- Strict type checking throughout application
- Proper query response typing with TanStack Query generics
- Zod schema validation for all API endpoints
- Interface definitions for all data structures

### Error Handling & UX
- Loading states for all async operations (Loader2 spinner icons)
- Empty states with appropriate messages and icons  
- Form validation with real-time feedback
- Toast notifications for success/error states
- Proper error boundaries and fallbacks

### Real-time Updates
- TanStack Query cache invalidation after mutations
- Optimistic updates where appropriate
- Query refetching on window focus
- Proper loading and error states

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Grid layouts that adapt to screen size
- Touch-friendly buttons and interactions
- Proper spacing and typography scaling

## Development Scripts
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

## Specific UI Components Needed

### shadcn/ui Components
- Button, Card, Input, Label, Textarea, Select, Badge, Toast
- Dialog, DropdownMenu, Separator, Tabs, Avatar
- Form components with react-hook-form integration
- Loading skeletons and progress indicators

### Custom Components
- DashLayout (sidebar + header + main content)
- Sidebar (role-based navigation with icons)
- Header (user info + logout)
- Status badges with icons and color coding
- Request cards with proper spacing and typography

## Critical Implementation Details

### Session Configuration
```typescript
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: memoryStore, // with PostgreSQL fallback
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
```

### Query Client Setup
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});
```

### Validation Schemas
```typescript
// University ID validation
universityId: z.string().refine(val => {
  const facultyPattern = /^F-\d{5}$/;
  const studentPattern = /^S-\d{5}$/;
  return facultyPattern.test(val) || studentPattern.test(val);
}, "University ID must be in format F-XXXXX (faculty) or S-XXXXX (student)")

// Callback request validation
subject: z.string().min(3, "Subject must be at least 3 characters"),
preferredTime: z.string().refine(
  (date) => new Date(date) > new Date(),
  "Preferred time must be in the future"
)
```

## Success Criteria

### Functional Requirements
✅ **Authentication**: Login/register with university ID format validation
✅ **Role-based Access**: Student and faculty interfaces with proper permissions
✅ **Callback System**: Complete request lifecycle (create → accept/reject → complete)
✅ **Real-time Updates**: Status changes reflect immediately on both dashboards
✅ **Data Persistence**: Memory storage with PostgreSQL fallback support
✅ **Form Validation**: Zod schemas with real-time error feedback
✅ **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Technical Requirements
✅ **Zero TypeScript Errors**: Strict type checking with proper generics
✅ **Zero Runtime Errors**: Proper error boundaries and null checks
✅ **Performance**: Optimized queries with proper caching strategies
✅ **Security**: Password hashing, session management, input validation
✅ **Code Quality**: Clean architecture with separation of concerns

### User Experience Requirements
✅ **Professional UI**: Modern design with consistent spacing and colors
✅ **Intuitive Navigation**: Clear role-based menus with proper icons
✅ **Status Clarity**: Visual badges and counters for request tracking
✅ **Loading States**: Smooth transitions with spinner indicators
✅ **Error Handling**: User-friendly messages and recovery options

## Final Notes

This system should demonstrate enterprise-level architecture with proper separation of concerns, type safety, and user experience design. The callback system is the centerpiece functionality that showcases bidirectional communication between user roles with real-time status synchronization.

The project should be immediately deployable and fully functional with the provided test accounts. All error handling should be comprehensive, and the UI should feel professional and polished throughout.

Remember to implement proper query typing with TanStack Query generics to avoid 'unknown' type errors, and ensure all Select components handle undefined values appropriately.