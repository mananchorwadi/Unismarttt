import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { userRoles } from "@shared/schema";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import FacultyDashboard from "@/pages/faculty-dashboard";
import StudentDashboard from "@/pages/student-dashboard";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute 
        path="/faculty" 
        component={FacultyDashboard}
        requiredRole={userRoles.FACULTY}
      />
      <ProtectedRoute 
        path="/student" 
        component={StudentDashboard}
        requiredRole={userRoles.STUDENT}
      />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
