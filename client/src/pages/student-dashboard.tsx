import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, BookOpen, GraduationCap, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: faculty, isLoading: isLoadingFaculty } = useQuery({
    queryKey: ["/api/faculty"],
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
                <CardTitle>Student Profile</CardTitle>
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
                  <Badge className="mt-2" variant="outline">Student</Badge>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: {user?.username}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">PROGRAM</h3>
                  <p className="font-semibold">Bachelor of Science in Astronomy</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">CONTACT</h3>
                  <p className="font-semibold">{user?.email || "student@cosmiccampus.edu"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400">ACADEMIC YEAR</h3>
                  <p className="font-semibold">Year 2 • Fall Semester 2023</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tomorrow</p>
                    <p className="font-medium">Solar System Quiz</p>
                    <p className="text-sm">AST101 • 11:59 PM</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4 py-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Wed, Sep 15</p>
                    <p className="font-medium">Planetary Motion Lab</p>
                    <p className="text-sm">AST202 • 5:00 PM</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Fri, Sep 17</p>
                    <p className="font-medium">Midterm Registration</p>
                    <p className="text-sm">Before 11:59 PM</p>
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
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}</h2>
                    <p className="opacity-90">Continue your journey through the cosmic universe</p>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xl font-bold">4</p>
                        <p className="text-sm opacity-90">Courses</p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xl font-bold">8</p>
                        <p className="text-sm opacity-90">Assignments</p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xl font-bold">3.8</p>
                        <p className="text-sm opacity-90">GPA</p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xl font-bold">92%</p>
                        <p className="text-sm opacity-90">Attendance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                      Course Progress
                    </CardTitle>
                    <CardDescription>Track your academic progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Introduction to Astronomy</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Planetary Science</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <Progress value={72} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Space Exploration</span>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Astrophysics Fundamentals</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                  </CardContent>
                </Card>

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
                        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-full mr-4">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">You submitted "Solar System Research Paper"</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">3 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start pb-4 border-b border-slate-200 dark:border-slate-800">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-full mr-4">
                          <GraduationCap className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">You received a grade: 95% on "Planetary Motion Quiz"</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-2 rounded-full mr-4">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">You enrolled in "Astrophysics Fundamentals"</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled Courses</CardTitle>
                    <CardDescription>Your current semester courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Introduction to Astronomy</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST101 • 3 Credits</p>
                            <p className="text-sm mt-2">
                              {isLoadingFaculty 
                                ? "Loading instructor..." 
                                : faculty?.length 
                                  ? `Instructor: ${faculty[0]?.fullName || 'Dr. Carl Sagan'}`
                                  : "Instructor: Dr. Carl Sagan"
                              }
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                            In Progress
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Planetary Science</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST202 • 4 Credits</p>
                            <p className="text-sm mt-2">
                              {isLoadingFaculty 
                                ? "Loading instructor..." 
                                : faculty?.length > 1
                                  ? `Instructor: ${faculty[1]?.fullName || 'Dr. Neil deGrasse Tyson'}`
                                  : "Instructor: Dr. Neil deGrasse Tyson"
                              }
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                            In Progress
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Space Exploration</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST301 • 3 Credits</p>
                            <p className="text-sm mt-2">Instructor: Dr. Mae Jemison</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                            In Progress
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Astrophysics Fundamentals</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST205 • 4 Credits</p>
                            <p className="text-sm mt-2">Instructor: Dr. Brian Cox</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                            In Progress
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Assignments</CardTitle>
                    <CardDescription>Your pending and upcoming assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Solar System Quiz</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST101 • Due Tomorrow</p>
                            <p className="text-sm mt-2">Multiple choice quiz covering the inner planets</p>
                          </div>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                            Urgent
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Planetary Motion Lab</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST202 • Due Sep 15</p>
                            <p className="text-sm mt-2">Orbital mechanics simulation and report</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Upcoming
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Space Mission Analysis</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST301 • Due Oct 5</p>
                            <p className="text-sm mt-2">Research paper on a historic space mission</p>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700">
                            Upcoming
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Stellar Evolution Paper</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">AST205 • Due Oct 12</p>
                            <p className="text-sm mt-2">Research paper on the life cycle of stars</p>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700">
                            Upcoming
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grades">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>Your grades and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Current GPA</p>
                            <p className="text-2xl font-bold">3.8</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Credits Earned</p>
                            <p className="text-2xl font-bold">42</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Attendance</p>
                            <p className="text-2xl font-bold">92%</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Course Completion</p>
                            <p className="text-2xl font-bold">65%</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Current Semester Grades</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Course
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Grade
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                  Introduction to Astronomy
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                  A (93%)
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0">
                                    Excellent
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                  Planetary Science
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                  B+ (87%)
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                                    Good
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                  Space Exploration
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                  A- (90%)
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0">
                                    Excellent
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                  Astrophysics Fundamentals
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                  B (85%)
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0">
                                    Good
                                  </Badge>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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
