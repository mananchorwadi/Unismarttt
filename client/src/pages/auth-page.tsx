import { useEffect } from "react";
import { useLocation } from "wouter";
import { Planet } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Form section */}
        <div className="lg:order-2">
          <AuthForm />
        </div>

        {/* Hero section */}
        <div className="lg:order-1 text-center lg:text-left">
          <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-full mb-6">
            <Planet className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-slate-900 dark:text-slate-50">
            Cosmic Campus
          </h1>
          <p className="text-xl lg:text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            University Management System
          </p>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto lg:mx-0">
            A comprehensive platform for faculty and students to manage courses, submissions, and academic progress in an intuitive and secure environment.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 max-w-md mx-auto lg:mx-0">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Faculty Portal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage courses, students, and academic records</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Student Portal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Access courses, assignments, and track progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
