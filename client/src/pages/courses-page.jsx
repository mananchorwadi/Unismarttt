import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getInitials } from "@/lib/utils";
import {
  Search,
  BookOpen,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  ExternalLink,
  Users,
  Download,
  ArrowUpRight
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
export default function CoursesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("current");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const courses = [
    {
      id: "cs101",
      name: "Introduction to Computer Science",
      code: "CS 101",
      instructor: "Dr. Michael Reynolds",
      schedule: "Mon/Wed/Fri 10:00 AM",
      room: "H-301",
      semester: "Spring 2025",
      status: "active",
      progress: 35,
      grade: "A",
      credits: 3
    },
    {
      id: "cs205",
      name: "Data Structures and Algorithms",
      code: "CS 205",
      instructor: "Dr. Sarah Connor",
      schedule: "Tue/Thu 1:00 PM",
      room: "H-302",
      semester: "Spring 2025",
      status: "active",
      progress: 40,
      grade: "A-",
      credits: 3
    },
    {
      id: "math202",
      name: "Advanced Calculus",
      code: "MATH 202",
      instructor: "Dr. James Wilson",
      schedule: "Mon/Wed 9:00 AM",
      room: "S-101",
      semester: "Spring 2025",
      status: "active",
      progress: 30,
      grade: "B+",
      credits: 4
    },
    {
      id: "eng101",
      name: "English Composition",
      code: "ENG 101",
      instructor: "Prof. Emily Bronte",
      schedule: "Tue/Thu 11:00 AM",
      room: "A-205",
      semester: "Spring 2025",
      status: "active",
      progress: 45,
      grade: "A",
      credits: 3
    },
    {
      id: "cs210",
      name: "Introduction to Software Engineering",
      code: "CS 210",
      instructor: "Dr. Robert Martin",
      schedule: "Mon/Wed 2:00 PM",
      room: "H-201",
      semester: "Fall 2024",
      status: "completed",
      progress: 100,
      grade: "A+",
      credits: 3
    }
  ];
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === "all" || selectedSemester === "current" && course.status === "active" || selectedSemester === "past" && course.status === "completed";
    return matchesSearch && matchesSemester;
  });
  const courseDetails = courses.find((c) => c.id === "cs101");
  const courseMaterials = [
    { id: 1, title: "Introduction to Programming Concepts", type: "lecture", date: "Feb 10, 2025" },
    { id: 2, title: "Variables and Data Types", type: "lecture", date: "Feb 12, 2025" },
    { id: 3, title: "Control Structures", type: "assignment", date: "Feb 17, 2025", due: "Feb 24, 2025" },
    { id: 4, title: "Functions and Methods", type: "lecture", date: "Feb 19, 2025" },
    { id: 5, title: "Arrays and Lists", type: "lecture", date: "Feb 24, 2025" },
    { id: 6, title: "Mid-term Exam Study Guide", type: "document", date: "Mar 10, 2025" }
  ];
  const upcomingSessions = [
    { id: 1, topic: "Object-Oriented Programming", date: "Mar 1, 2025", time: "10:00 AM - 11:30 AM", room: "H-301" },
    { id: 2, topic: "Inheritance and Polymorphism", date: "Mar 3, 2025", time: "10:00 AM - 11:30 AM", room: "H-301" },
    { id: 3, topic: "Exception Handling", date: "Mar 5, 2025", time: "10:00 AM - 11:30 AM", room: "H-301" }
  ];
  const assignments = [
    {
      id: 1,
      title: "Programming Basics",
      due: "Feb 24, 2025",
      status: "submitted",
      grade: "95/100",
      feedback: "Excellent work! Your code is clean and well-documented."
    },
    {
      id: 2,
      title: "Control Structures Assignment",
      due: "Mar 10, 2025",
      status: "pending",
      grade: null,
      feedback: null
    },
    {
      id: 3,
      title: "Functions and Recursion",
      due: "Mar 20, 2025",
      status: "upcoming",
      grade: null,
      feedback: null
    }
  ];
  return <DashLayout
    title="My Courses"
    description="View and manage your enrolled courses"
  >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
    type="search"
    placeholder="Search courses..."
    className="pl-8"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
            </div>
            
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="all">All Semesters</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredCourses.map((course) => <Card
    key={course.id}
    className={`overflow-hidden hover:border-primary transition-colors cursor-pointer ${selectedCourse === course.id ? "border-primary" : ""}`}
    onClick={() => setSelectedCourse(course.id)}
  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{course.name}</CardTitle>
                          <CardDescription>{course.code}</CardDescription>
                        </div>
                        <Badge variant={course.status === "active" ? "default" : "secondary"}>
                          {course.status === "active" ? "Current" : "Completed"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-4">
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Room {course.room}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Course Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between border-t pt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <p className="font-medium">{course.grade || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Credits</p>
                          <p className="font-medium">{course.credits}</p>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Details <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
                
                {filteredCourses.length === 0 && <div className="col-span-3 py-8 text-center text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 opacity-50 mb-2" />
                    <p>No courses found. Try adjusting your search or filters.</p>
                  </div>}
              </div>
            </CardContent>
          </Card>
          
          {courseDetails && <>
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {courseDetails.code}: {courseDetails.name}
                      </CardTitle>
                      <CardDescription>
                        {courseDetails.instructor} • {courseDetails.schedule} • Room {courseDetails.room}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{courseDetails.credits} Credits</Badge>
                      <Badge variant="outline">Grade: {courseDetails.grade}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="materials">
                    <TabsList className="mb-4">
                      <TabsTrigger value="materials">Materials</TabsTrigger>
                      <TabsTrigger value="assignments">Assignments</TabsTrigger>
                      <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="materials" className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courseMaterials.map((material) => <TableRow key={material.id}>
                              <TableCell className="font-medium">{material.title}</TableCell>
                              <TableCell>
                                <Badge variant={material.type === "lecture" ? "outline" : material.type === "assignment" ? "default" : "secondary"}>
                                  {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{material.date}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="assignments" className="space-y-4">
                      <div className="space-y-4">
                        {assignments.map((assignment) => <Card key={assignment.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{assignment.title}</h3>
                                    <Badge variant={assignment.status === "submitted" ? "default" : assignment.status === "pending" ? "secondary" : "outline"}>
                                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Due: {assignment.due}
                                  </p>
                                  {assignment.grade && <p className="text-sm font-medium">
                                      Grade: {assignment.grade}
                                    </p>}
                                  {assignment.feedback && <p className="text-sm text-muted-foreground mt-2">
                                      "{assignment.feedback}"
                                    </p>}
                                </div>
                                <div className="flex items-center gap-2">
                                  {assignment.status === "upcoming" || assignment.status === "pending" ? <Button>Submit Assignment</Button> : <Button variant="outline">View Submission</Button>}
                                </div>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schedule" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Upcoming Class Sessions</h3>
                        
                        {upcomingSessions.map((session) => <Card key={session.id}>
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-medium">{session.topic}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {session.date} • {session.time} • Room {session.room}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Add to Calendar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Instructor</h3>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(courseDetails.instructor)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{courseDetails.instructor}</p>
                        <p className="text-xs text-muted-foreground">
                          Professor of Computer Science
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Course Details</h3>
                    <div className="rounded-lg border divide-y">
                      <div className="px-3 py-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Course Code</span>
                        <span className="text-sm font-medium">{courseDetails.code}</span>
                      </div>
                      <div className="px-3 py-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Credits</span>
                        <span className="text-sm font-medium">{courseDetails.credits}</span>
                      </div>
                      <div className="px-3 py-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Semester</span>
                        <span className="text-sm font-medium">{courseDetails.semester}</span>
                      </div>
                      <div className="px-3 py-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Schedule</span>
                        <span className="text-sm font-medium">{courseDetails.schedule}</span>
                      </div>
                      <div className="px-3 py-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Room</span>
                        <span className="text-sm font-medium">{courseDetails.room}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Resources</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Course Syllabus
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Online Textbook
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Class Discussion Forum
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3 bg-yellow-50 dark:bg-yellow-950/30">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Important Notice</h4>
                        <p className="text-sm text-yellow-800/80 dark:text-yellow-400/80">
                          Midterm exam scheduled for March 15th. Review session March 13th.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>}
        </div>
      </div>
    </DashLayout>;
}
