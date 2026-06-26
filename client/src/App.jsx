import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SchedulePage from "@/pages/schedule-page";
import AssignmentsPage from "@/pages/assignments-page";
import MessagesPage from "@/pages/messages-page-new";
import SettingsPage from "@/pages/settings-page";
import CoursesPage from "@/pages/courses-page";
import GradesPage from "@/pages/grades-page";
import ClassesPage from "@/pages/classes-page";
import StudentsPage from "@/pages/students-page";
import AttendancePage from "@/pages/attendance-page";
import RequestCallbackPage from "@/pages/request-callback-page";
import FacultyRequestsPage from "@/pages/faculty-requests-page";
import ClassroomUtilizationPage from "@/pages/classroom-utilization-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./components/theme-provider";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute component={HomePage} />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Student & Faculty Routes */}
      <Route path="/schedule" element={<ProtectedRoute component={SchedulePage} />} />
      <Route path="/assignments" element={<ProtectedRoute component={AssignmentsPage} />} />
      <Route path="/messages" element={<ProtectedRoute component={MessagesPage} />} />
      <Route path="/settings" element={<ProtectedRoute component={SettingsPage} />} />

      {/* Student Routes */}
      <Route path="/courses" element={<ProtectedRoute component={CoursesPage} />} />
      <Route path="/grades" element={<ProtectedRoute component={GradesPage} />} />
      <Route path="/classroom-utilization" element={<ProtectedRoute component={ClassroomUtilizationPage} />} />

      {/* Faculty Routes */}
      <Route path="/classes" element={<ProtectedRoute component={ClassesPage} />} />
      <Route path="/students" element={<ProtectedRoute component={StudentsPage} />} />
      <Route path="/attendance" element={<ProtectedRoute component={AttendancePage} />} />

      {/* Callback System Routes */}
      <Route path="/request-callback" element={<ProtectedRoute component={RequestCallbackPage} />} />
      <Route path="/faculty-requests" element={<ProtectedRoute component={FacultyRequestsPage} />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
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
