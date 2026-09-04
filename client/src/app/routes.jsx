import { Routes, Route } from "react-router-dom";
import NotFound from "@/pages/system/not-found";
import HomePage from "@/pages/dashboard/home-page";
import AuthPage from "@/pages/auth/auth-page";
import SchedulePage from "@/pages/academics/schedule-page";
import AssignmentsPage from "@/pages/academics/assignments-page";
import MessagesPage from "@/pages/communication/messages-page";
import SettingsPage from "@/pages/settings/settings-page";
import CoursesPage from "@/pages/academics/courses-page";
import GradesPage from "@/pages/academics/grades-page";
import ClassesPage from "@/pages/faculty/classes-page";
import StudentsPage from "@/pages/faculty/students-page";
import AttendancePage from "@/pages/faculty/attendance-page";
import RequestCallbackPage from "@/pages/callbacks/request-callback-page";
import FacultyRequestsPage from "@/pages/faculty/faculty-requests-page";
import ClassroomUtilizationPage from "@/pages/student/classroom-utilization-page";
import { ProtectedRoute } from "@/lib/protected-route";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute component={HomePage} />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Student and faculty routes */}
      <Route path="/schedule" element={<ProtectedRoute component={SchedulePage} />} />
      <Route path="/assignments" element={<ProtectedRoute component={AssignmentsPage} />} />
      <Route path="/messages" element={<ProtectedRoute component={MessagesPage} />} />
      <Route path="/settings" element={<ProtectedRoute component={SettingsPage} />} />

      {/* Student routes */}
      <Route path="/courses" element={<ProtectedRoute component={CoursesPage} />} />
      <Route path="/grades" element={<ProtectedRoute component={GradesPage} />} />
      <Route
        path="/classroom-utilization"
        element={<ProtectedRoute component={ClassroomUtilizationPage} />}
      />
      <Route
        path="/request-callback"
        element={<ProtectedRoute component={RequestCallbackPage} />}
      />

      {/* Faculty routes */}
      <Route path="/classes" element={<ProtectedRoute component={ClassesPage} />} />
      <Route path="/students" element={<ProtectedRoute component={StudentsPage} />} />
      <Route path="/attendance" element={<ProtectedRoute component={AttendancePage} />} />
      <Route
        path="/faculty-requests"
        element={<ProtectedRoute component={FacultyRequestsPage} />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}