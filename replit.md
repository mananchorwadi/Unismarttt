# University Management System

## Overview

This is a comprehensive university management system built with modern web technologies. The application provides role-based access for students and faculty members, featuring course management, assignment tracking, messaging, scheduling, and attendance monitoring capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom theme system
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Management**: Express sessions with memory store fallback
- **Password Security**: Node.js crypto module with scrypt hashing
- **API Design**: RESTful endpoints with JSON responses

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with connection pooling
- **Migrations**: Drizzle Kit for schema management
- **Connection**: postgres-js driver for efficient PostgreSQL connections

## Key Components

### Authentication System
- **Session-based authentication** using Passport.js local strategy
- **Role-based access control** with student and faculty roles
- **University ID-based login** with format validation (F-XXXXX for faculty, S-XXXXX for students)
- **Password hashing** using scrypt with salt for security
- **Protected routes** with authentication middleware

### User Management
- **User registration** with role-specific validation
- **Profile management** with personal information updates
- **Session persistence** across browser sessions
- **Logout functionality** with session cleanup

### Database Schema
- **Users table** with role-based fields (student/faculty)
- **University ID uniqueness** constraint
- **Email validation** and uniqueness
- **Timestamp tracking** for user creation

### UI/UX Design
- **Responsive design** with mobile-first approach
- **Dark/light theme** support with system preference detection
- **Accessible components** using Radix UI primitives
- **Professional styling** with custom color scheme
- **Loading states** and error handling

## Data Flow

### Authentication Flow
1. User submits credentials (university ID + password)
2. Server validates credentials against database
3. Passport.js creates authenticated session
4. Client receives user data and redirects to dashboard
5. Protected routes verify session on each request

### API Communication
1. Client makes requests with credentials included
2. Server validates session and authorization
3. Database queries executed through Drizzle ORM
4. Response data formatted and sent to client
5. Client updates UI state with TanStack Query

### Role-Based Navigation
1. User role determined from session data
2. Navigation menu filtered based on permissions
3. Route protection enforced on both client and server
4. Faculty and student interfaces customized accordingly

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full type safety across the application
- **Vite**: Development server and build optimization
- **Express**: Web framework for API endpoints

### Database Dependencies
- **Drizzle ORM**: Type-safe database operations
- **postgres-js**: PostgreSQL driver
- **@neondatabase/serverless**: Serverless PostgreSQL support

### Authentication Dependencies
- **Passport.js**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store (configured but using memory store)

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: `npm run build` creates optimized bundles
- **Type Checking**: `npm run check` validates TypeScript
- **Database**: `npm run db:push` applies schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Secret key for session encryption
- **NODE_ENV**: Environment mode (development/production)

### Production Deployment
- Frontend built to `dist/public` directory
- Backend bundled with esbuild for Node.js
- Static files served by Express in production
- Database migrations run on deployment

## Changelog

- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.