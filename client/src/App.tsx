import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SchedulePage from "@/pages/schedule-page";
import AssignmentsPage from "@/pages/assignments-page";
import MessagesPage from "@/pages/messages-page";
import SettingsPage from "@/pages/settings-page";
import CoursesPage from "@/pages/courses-page";
import GradesPage from "@/pages/grades-page";
import ClassesPage from "@/pages/classes-page";
import StudentsPage from "@/pages/students-page";
import AttendancePage from "@/pages/attendance-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./components/theme-provider";

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
