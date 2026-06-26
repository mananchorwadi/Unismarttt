import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@shared/schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function LoginForm({ activeRole, onRoleChange }) {
  const { loginMutation, forgotPasswordMutation } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      universityId: "",
      password: "",
      role: activeRole,
    },
  });

  const handleRoleTabClick = (role) => {
    onRoleChange(role);
    form.setValue("role", role);
    form.setValue("universityId", "");
    form.clearErrors();
  };

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (forgotPasswordEmail) {
      forgotPasswordMutation.mutate({ email: forgotPasswordEmail });
      setForgotPasswordDialogOpen(false);
    }
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

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {loginMutation.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginMutation.error.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            <Dialog open={forgotPasswordDialogOpen} onOpenChange={setForgotPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm font-medium text-primary dark:text-primary p-0">
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword}>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Reset Password
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
