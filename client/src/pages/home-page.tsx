import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { userRoles } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FacultyDashboard from "./faculty-dashboard";
import StudentDashboard from "./student-dashboard";

export default function HomePage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user && !isLoading) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Cosmic Campus</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-700 dark:text-slate-300 hidden md:inline-block">
              Welcome, {user?.fullName || user?.username}
            </span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Sign out"
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard based on role */}
      {user.role === userRoles.FACULTY ? (
        <FacultyDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
}
