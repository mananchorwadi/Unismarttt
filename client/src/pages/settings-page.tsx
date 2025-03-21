import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  User, Lock, Bell, Eye, EyeOff, Shield, FileText, 
  Camera, Upload, Save, LogOut, HelpCircle, Mail,
  Smartphone, AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  if (!user) return <div className="hidden"></div>; // Return empty div instead of null
  
  const isFaculty = user.role === ROLES.FACULTY;

  return (
    <DashLayout 
      title="Settings" 
      description="Manage your account and preferences"
    >
      <div className="space-y-6">
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="help">Help & Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="md:w-1/4 flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials(user.fullName || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" value={user.fullName || ""} />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user.email || ""} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" readOnly value={isFaculty ? "Faculty" : "Student"} />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="university-id">University ID</Label>
                        <Input id="university-id" readOnly value={user.universityId || ""} />
                      </div>
                    </div>
                    
                    {isFaculty ? (
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Select defaultValue="computerScience">
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="computerScience">Computer Science</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="program">Program</Label>
                          <Select defaultValue="computerScience">
                            <SelectTrigger id="program">
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="computerScience">Computer Science</SelectItem>
                              <SelectItem value="dataScience">Data Science</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="year">Year</Label>
                          <Select defaultValue="3">
                            <SelectTrigger id="year">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">First Year</SelectItem>
                              <SelectItem value="2">Second Year</SelectItem>
                              <SelectItem value="3">Third Year</SelectItem>
                              <SelectItem value="4">Fourth Year</SelectItem>
                              <SelectItem value="5">Graduate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="(555) 555-5555" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="alt-email">Alternative Email</Label>
                      <Input id="alt-email" type="email" placeholder="your.email@example.com" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Street Address" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" placeholder="Zip Code" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium mb-1">Change Password</h4>
                      <p className="text-sm text-muted-foreground">
                        It's a good idea to use a strong password that you're not using elsewhere
                      </p>
                    </div>
                    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Change Password</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and a new password below.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                              <Input id="current-password" type="password" />
                              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                              <Input id="new-password" type="password" />
                              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                              <Input id="confirm-password" type="password" />
                              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setShowPasswordDialog(false)}>
                            Update Password
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium mb-1">Enable Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  
                  <div className="rounded-lg border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Current Session</h4>
                          <p className="text-sm text-muted-foreground">
                            Web Browser • {navigator.platform}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-600 bg-green-50">
                          Active Now
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <Button variant="outline" className="w-full md:w-auto">
                        <Shield className="mr-2 h-4 w-4" />
                        Log Out of All Other Sessions
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Actions</h3>
                  
                  <div className="rounded-lg border border-destructive/10 p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-destructive mb-1">Log Out</h4>
                        <p className="text-sm text-muted-foreground">
                          Log out of your account on this device
                        </p>
                      </div>
                      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                        <DialogTrigger asChild>
                          <Button variant="destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Log Out</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to log out of your account?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => {
                                logoutMutation.mutate();
                                setShowLogoutDialog(false);
                              }}
                              disabled={logoutMutation.isPending}
                            >
                              {logoutMutation.isPending ? "Logging out..." : "Log Out"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="email-assignments" className="font-medium">
                          Assignments
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new assignments, due dates, and grades
                        </p>
                      </div>
                      <Switch id="email-assignments" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="email-announcements" className="font-medium">
                          Announcements
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about important announcements from your courses
                        </p>
                      </div>
                      <Switch id="email-announcements" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="email-messages" className="font-medium">
                          Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when you get new messages
                        </p>
                      </div>
                      <Switch id="email-messages" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="email-reminders" className="font-medium">
                          Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminder emails for upcoming deadlines and events
                        </p>
                      </div>
                      <Switch id="email-reminders" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="app-assignments" className="font-medium">
                          Assignments
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications for new assignments and grades
                        </p>
                      </div>
                      <Switch id="app-assignments" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="app-announcements" className="font-medium">
                          Announcements
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications for course announcements
                        </p>
                      </div>
                      <Switch id="app-announcements" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="app-messages" className="font-medium">
                          Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications for new messages
                        </p>
                      </div>
                      <Switch id="app-messages" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="app-reminders" className="font-medium">
                          Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show reminders for upcoming deadlines and events
                        </p>
                      </div>
                      <Switch id="app-reminders" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SMS Notifications</h3>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium mb-1">Enable SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive important notifications via text message
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input id="phone-number" type="tel" placeholder="(555) 555-5555" disabled />
                    </div>
                    
                    <Button variant="outline" disabled>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Verify Phone Number
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium mb-1">Color Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Switch between light, dark, or system theme
                      </p>
                    </div>
                    <ModeToggle />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Layout</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="layout">Default Layout</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger id="layout">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accessibility</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="reduced-motion" className="font-medium">
                        Reduce Motion
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch id="reduced-motion" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="high-contrast" className="font-medium">
                        High Contrast
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch id="high-contrast" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Font Size</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="x-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>
                  Get help and learn more about the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Documentation</h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">User Guide</h4>
                        <p className="text-sm text-muted-foreground">
                          Learn how to navigate and use the platform effectively
                        </p>
                      </div>
                      <Button variant="ghost" className="ml-auto">
                        View
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <HelpCircle className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">FAQs</h4>
                        <p className="text-sm text-muted-foreground">
                          Find answers to frequently asked questions
                        </p>
                      </div>
                      <Button variant="ghost" className="ml-auto">
                        View
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Mail className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Contact Support</h4>
                        <p className="text-sm text-muted-foreground">
                          Get help from our support team
                        </p>
                      </div>
                      <Button variant="ghost" className="ml-auto">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Status</h3>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <p className="font-medium">All systems operational</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Website</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">API Services</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Database</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Operational</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">About</h3>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col items-center text-center gap-2 mb-4">
                      <div className="flex items-center gap-2 font-bold text-xl">
                        <User className="h-6 w-6" />
                        UniSmart
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your Smart Gateway To Smart Campus
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Version</span>
                        <span>1.0.0</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>March 21, 2025</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Terms of Service</span>
                        <Button variant="link" className="p-0 h-auto">View</Button>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Privacy Policy</span>
                        <Button variant="link" className="p-0 h-auto">View</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashLayout>
  );
}