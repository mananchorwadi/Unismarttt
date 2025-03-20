import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, loginUserSchema, UserRole, userRoles } from "@shared/schema";

type FormMode = "login" | "register" | "forgotPassword";

const formSchema = {
  login: loginUserSchema,
  register: insertUserSchema,
  forgotPassword: z.object({
    username: z.string().min(1, "ID is required"),
    role: z.enum([userRoles.STUDENT, userRoles.FACULTY]),
  }),
};

export function AuthForm() {
  const [mode, setMode] = useState<FormMode>("login");
  const [role, setRole] = useState<UserRole>(userRoles.STUDENT);
  const { loginMutation, registerMutation, forgotPasswordMutation } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema[typeof mode]>>({
    resolver: zodResolver(formSchema[mode]),
    defaultValues: {
      username: "",
      password: "",
      role: role,
      ...(mode === "register" ? { 
        fullName: "",
        email: ""
      } : {})
    },
  });

  // Update form values when role changes
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    form.setValue("role", newRole);
  };

  // Reset form when mode changes
  const handleModeChange = (newMode: FormMode) => {
    setMode(newMode);
    form.reset({
      username: "",
      password: "",
      role: role,
      ...(newMode === "register" ? { 
        fullName: "",
        email: "" 
      } : {})
    });
  };

  function onSubmit(values: z.infer<typeof formSchema[typeof mode]>) {
    if (mode === "login") {
      loginMutation.mutate(values as any);
    } else if (mode === "register") {
      registerMutation.mutate(values as any);
    } else if (mode === "forgotPassword") {
      forgotPasswordMutation.mutate(values as any);
    }
  }

  const isPending = loginMutation.isPending || registerMutation.isPending || forgotPasswordMutation.isPending;
  const error = loginMutation.error || registerMutation.error || forgotPasswordMutation.error;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {mode === "login" 
            ? "Sign in to your account" 
            : mode === "register" 
              ? "Create new account" 
              : "Reset your password"}
        </CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Enter your credentials to access your account" 
            : mode === "register" 
              ? "Fill out the form to create a new account" 
              : "Enter your ID to receive a password reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Role switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-md mb-6">
          <Button
            type="button"
            variant={role === userRoles.STUDENT ? "default" : "ghost"}
            className="flex-1 py-2"
            onClick={() => handleRoleChange(userRoles.STUDENT)}
          >
            Student
          </Button>
          <Button
            type="button"
            variant={role === userRoles.FACULTY ? "default" : "ghost"}
            className="flex-1 py-2"
            onClick={() => handleRoleChange(userRoles.FACULTY)}
          >
            Faculty
          </Button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{role === userRoles.STUDENT ? "Student ID" : "Faculty ID"}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter your ${role === userRoles.STUDENT ? "student" : "faculty"} ID`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field (not in forgot password mode) */}
                {mode !== "forgotPassword" && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Additional fields for registration */}
                {mode === "register" && (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "login" ? "Signing in..." : mode === "register" ? "Creating account..." : "Sending..."}
                </>
              ) : (
                <>{mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center w-full">
          {mode === "login" && (
            <>
              <Button 
                variant="link" 
                className="px-2 text-slate-500" 
                onClick={() => handleModeChange("forgotPassword")}
              >
                Forgot password?
              </Button>
              <div className="mt-2">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="px-1" 
                  onClick={() => handleModeChange("register")}
                >
                  Create one
                </Button>
              </div>
            </>
          )}
          {mode === "register" && (
            <div>
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="px-1" 
                onClick={() => handleModeChange("login")}
              >
                Sign in
              </Button>
            </div>
          )}
          {mode === "forgotPassword" && (
            <div>
              Remember your password?{" "}
              <Button 
                variant="link" 
                className="px-1" 
                onClick={() => handleModeChange("login")}
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
