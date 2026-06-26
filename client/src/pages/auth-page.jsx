import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [activeRole, setActiveRole] = useState("student");

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-primary dark:text-white">UniSmart: University Management System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-center text-primary dark:text-white mb-8">University Portal</h2>
                  <Tabs defaultValue="login" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TabsContent value="login" className="mt-6">
                          <LoginForm activeRole={activeRole} onRoleChange={handleRoleChange} />
                        </TabsContent>
                        <TabsContent value="register" className="mt-6">
                          <RegisterForm activeRole={activeRole} onRoleChange={handleRoleChange} />
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </Tabs>
                </div>
              </div>
            </div>

            <div className="hidden md:block bg-primary text-white p-8 rounded-xl shadow-md">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Welcome to the University Management System</h2>
                <p className="text-lg">Our platform provides a seamless experience for students and faculty to manage their university activities.</p>
                <div className="space-y-4 mt-8">
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-lg">Streamlined Access</h3>
                      <p className="opacity-90">Role-based authentication ensures you see only what's relevant to you.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-lg">Secure & Simple</h3>
                      <p className="opacity-90">Your data is protected with industry-standard security measures.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-lg">Comprehensive Management</h3>
                      <p className="opacity-90">Complete tools for managing university resources and activities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © 2025 University Management System
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
