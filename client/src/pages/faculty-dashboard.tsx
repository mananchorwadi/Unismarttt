import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Users, Book, Activity } from "lucide-react";

export default function FacultyDashboard() {
  const { user } = useAuth();

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["/api/students"],
    enabled: !!user,
  });

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Sidebar */}
          <div className="col-span-1 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Profile</CardTitle>
                <CardDescription>Your academic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {user?.fullName?.split(' ').map(n => n[0]).join('') || user?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{user?.fullName}</h3>
                  <Badge className="mt-2" variant="outline">Faculty</Badge>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: {user?.username}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">DEPARTMENT</h3>
                  <p className="font-semibold">Department of Astronomy</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">CONTACT</h3>
                  <p className="font-semibold">{user?.email || "faculty@cosmiccampus.edu"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">OFFICE HOURS</h3>
                  <p className="font-semibold">Mon-Fri: 9:00 AM - 3:00 PM</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tomorrow</p>
                    <p className="font-medium">Faculty Meeting</p>
                    <p className="text-sm">9:00 AM - Hall A</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Wed, Sep 15</p>
                    <p className="font-medium">Grade Submission Deadline</p>
                    <p className="text-sm">Before 11:59 PM</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Fri, Sep 17</p>
                    <p className="font-medium">Department Conference</p>
                    <p className="text-sm">2:00 PM - Conference Hall</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-4">
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Students</p>
                        <p className="text-2xl font-bold">{isLoadingStudents ? "..." : students?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                        <Book className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Courses</p>
                        <p className="text-2xl font-bold">4</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mr-4">
                        <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Assignments</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-500" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest actions and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start pb-4 border-b border-slate-200 dark:border-slate-800">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-full mr-4">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">You uploaded a new assignment: "Solar System Research Paper"</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start pb-4 border-b border-slate-200 dark:border-slate-800">
                        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-full mr-4">
                          <Users className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">You graded 8 student submissions for "Planetary Motion Quiz"</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-2 rounded-full mr-4">
                          <Book className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">You updated the course syllabus for "Introduction to Astronomy"</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Courses</CardTitle>
                    <CardDescription>Courses you're currently teaching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Introduction to Astronomy</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST101 • 30 students enrolled</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Planetary Science</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST202 • 24 students enrolled</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Space Exploration</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST301 • 18 students enrolled</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Astrophysics Fundamentals</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST205 • 22 students enrolled</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Roster</CardTitle>
                    <CardDescription>Students enrolled in your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingStudents ? (
                      <div className="text-center py-4">
                        <div className="inline-block">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                        </div>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Loading students...</p>
                      </div>
                    ) : students?.length ? (
                      <div className="space-y-4">
                        {students.map((student: any) => (
                          <div key={student.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {student.fullName?.split(' ').map((n: string) => n[0]).join('') || student.username?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{student.fullName}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">ID: {student.username}</p>
                            </div>
                            <Badge variant="outline">Student</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                        No students found. New students will appear here once enrolled.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Assignments</CardTitle>
                    <CardDescription>Manage assignments and grades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Solar System Quiz</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST101 • Due Sep 20</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Planetary Motion Lab</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST202 • Due Sep 25</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Space Mission Analysis</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST301 • Due Oct 5</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Stellar Evolution Paper</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST205 • Due Oct 12</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
