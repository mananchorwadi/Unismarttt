import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./components/theme-provider";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { useAuth } from "./hooks/use-auth";

// Placeholder page components until we create the actual pages
function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <DashLayout title={title} description={description}>
      <div className="p-8 text-center border rounded-lg bg-background">
        <p className="text-muted-foreground">This page is coming soon...</p>
      </div>
    </DashLayout>
  );
}

function CoursesPage() {
  return <PlaceholderPage title="Courses" description="View and manage your courses" />;
}

function GradesPage() {
  return <PlaceholderPage title="Grades" description="View your academic performance" />;
}

function SchedulePage() {
  return <PlaceholderPage title="Schedule" description="View your weekly schedule" />;
}

function AssignmentsPage() {
  return <PlaceholderPage title="Assignments" description="Manage your assignments" />;
}

function MessagesPage() {
  return <PlaceholderPage title="Messages" description="Communicate with students and faculty" />;
}

function SettingsPage() {
  return <PlaceholderPage title="Settings" description="Manage your account settings" />;
}

function ClassesPage() {
  return <PlaceholderPage title="Classes" description="Manage your classes" />;
}

function StudentsPage() {
  return <PlaceholderPage title="Students" description="View and manage your students" />;
}

function AttendancePage() {
  return <PlaceholderPage title="Smart Attendance" description="AI-powered attendance tracking" />;
}

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Student & Faculty Routes */}
      <ProtectedRoute path="/schedule" component={SchedulePage} />
      <ProtectedRoute path="/assignments" component={AssignmentsPage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      
      {/* Student Routes */}
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/grades" component={GradesPage} />
      
      {/* Faculty Routes */}
      <ProtectedRoute path="/classes" component={ClassesPage} />
      <ProtectedRoute path="/students" component={StudentsPage} />
      <ProtectedRoute path="/attendance" component={AttendancePage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="university-theme">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
