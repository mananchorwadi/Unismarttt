import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Users, Calendar, FileText, GraduationCap, Clock, Bell
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const isFaculty = user.role === ROLES.FACULTY;
  
  return (
    <DashLayout 
      title="Dashboard" 
      description={`Welcome back, ${user.fullName}!`}
    >
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date().toLocaleDateString()}
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFaculty ? "Classes" : "Courses"}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isFaculty ? 5 : 8}</div>
            <p className="text-xs text-muted-foreground">
              {isFaculty ? "+1 from last semester" : "2 assignments due this week"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFaculty ? "Students" : "Attendance"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isFaculty ? 143 : "96%"}</div>
            <p className="text-xs text-muted-foreground">
              {isFaculty ? "Across all classes" : "Last 30 days"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFaculty ? "Assignments" : "Current GPA"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isFaculty ? 15 : "3.8"}</div>
            <p className="text-xs text-muted-foreground">
              {isFaculty ? "7 need grading" : "Up 0.2 from last semester"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFaculty ? "Office Hours" : "Credits"}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isFaculty ? "3hrs" : 45}</div>
            <p className="text-xs text-muted-foreground">
              {isFaculty ? "This week" : "15 more needed to graduate"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isFaculty ? (
            <>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </>
          )}
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                You have {isFaculty ? 5 : 3} unread notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Notifications list */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <Bell className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isFaculty 
                        ? "Grade submission deadline approaching" 
                        : "New assignment posted in Advanced Mathematics"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isFaculty 
                        ? "Please submit all grades by Friday, 5:00 PM." 
                        : "Due date: Next Monday by 11:59 PM"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isFaculty 
                        ? "Faculty meeting scheduled" 
                        : "Registration for next semester opens soon"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isFaculty 
                        ? "Tomorrow at 2:00 PM in Room B204" 
                        : "Mark your calendar for October 15th at 9:00 AM"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isFaculty 
                        ? "New curriculum guidelines available" 
                        : "Scholarship application deadline approaching"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isFaculty 
                        ? "Please review the updated guidelines for the upcoming term." 
                        : "Submit your application by November 1st for consideration."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value={isFaculty ? "classes" : "courses"} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isFaculty ? "Your Classes" : "Your Courses"}</CardTitle>
              <CardDescription>
                {isFaculty 
                  ? "Manage your classes and course materials." 
                  : "View details and materials for your enrolled courses."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isFaculty 
                  ? "You are currently teaching 5 classes this semester." 
                  : "You are currently enrolled in 8 courses this semester."
                }
              </p>
              
              <div className="rounded-md border">
                <div className="p-4 font-medium">
                  {isFaculty ? "Introduction to Computer Science" : "Advanced Mathematics"}
                </div>
                <div className="p-4 border-t text-sm">
                  {isFaculty ? "Monday, Wednesday, Friday - 10:00 AM" : "Credits: 3 - Room: A101"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value={isFaculty ? "students" : "grades"} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isFaculty ? "Student Management" : "Grade Overview"}</CardTitle>
              <CardDescription>
                {isFaculty 
                  ? "View and manage student information and performance." 
                  : "Monitor your academic performance across all courses."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isFaculty 
                  ? "You have 143 students across all your classes." 
                  : "Your current semester GPA is 3.8/4.0"
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Calendar</CardTitle>
              <CardDescription>
                View important dates and events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The calendar view will show all your scheduled classes, assignments, exams, and university events.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashLayout>
  );
}
