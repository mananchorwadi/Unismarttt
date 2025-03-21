import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { ROLES, registerUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface RegisterFormProps {
  activeRole: "student" | "faculty";
  onRoleChange: (role: "student" | "faculty") => void;
}

export default function RegisterForm({ activeRole, onRoleChange }: RegisterFormProps) {
  const { registerMutation } = useAuth();
  
  // Form definition
  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      password: "",
      role: activeRole,
      fullName: "",
      email: "",
      universityId: "",
    },
  });
  
  // Update form values when role changes
  const handleRoleTabClick = (role: "student" | "faculty") => {
    onRoleChange(role);
    form.setValue("role", role);
  };
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof registerUserSchema>) => {
    registerMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      {/* Role Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition ${
            activeRole === "student"
              ? "border-primary text-primary dark:border-primary dark:text-primary"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
          }`}
          onClick={() => handleRoleTabClick("student")}
          type="button"
        >
          Student
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition ${
            activeRole === "faculty"
              ? "border-primary text-primary dark:border-primary dark:text-primary"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
          }`}
          onClick={() => handleRoleTabClick("faculty")}
          type="button"
        >
          Faculty
        </button>
      </div>
      
      {/* Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="universityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{activeRole === "student" ? "Student ID" : "Faculty ID"}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={`Enter your ${activeRole === "student" ? "Student" : "Faculty"} ID`} 
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Format: {activeRole === "student" ? "S-XXXXX" : "F-XXXXX"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Create a password (min. 6 characters)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Error Message */}
          {registerMutation.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {registerMutation.error.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register Account
          </Button>
        </form>
      </Form>
    </div>
  );
}
