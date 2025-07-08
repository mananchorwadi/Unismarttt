import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getInitials } from "@/lib/utils";
import { 
  Search, Download, Filter, Mail, Phone, ChevronDown, MoreHorizontal,
  User, BookOpen, FileText, AlertTriangle, BarChart3
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function StudentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedPerformance, setSelectedPerformance] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  type Student = {
    id: string;
    name: string;
    email: string;
    studentId: string;
    phone: string;
    enrolledClasses: number;
    grade: string;
    attendance: number;
    performance: "excellent" | "good" | "average" | "poor";
    program: string;
    year: number;
  };

  // Mock student data
  const students: Student[] = [
    { 
      id: "s1", 
      name: "Om Joshi", 
      email: "om.j@university.edu", 
      studentId: "S-35412", 
      phone: "(555) 123-4567", 
      enrolledClasses: 5, 
      grade: "A", 
      attendance: 95, 
      performance: "excellent",
      program: "Computer Science",
      year: 3
    },
    { 
      id: "s2", 
      name: "Mohit Singh", 
      email: "m.singh@university.edu", 
      studentId: "S-35678", 
      phone: "(555) 234-5678", 
      enrolledClasses: 4, 
      grade: "A", 
      attendance: 92, 
      performance: "excellent",
      program: "Computer Science",
      year: 2
    },
    { 
      id: "s3", 
      name: "Manan chorwadi", 
      email: "c.manan@university.edu", 
      studentId: "S-36712", 
      phone: "(555) 345-6789", 
      enrolledClasses: 5, 
      grade: "A+", 
      attendance: 85, 
      performance: "good",
      program: "Mathematics",
      year: 3
    },
    { 
      id: "s4", 
      name: "Ansh Patel", 
      email: "p.Ansh@university.edu", 
      studentId: "S-37845", 
      phone: "(555) 456-7890", 
      enrolledClasses: 6, 
      grade: "C", 
      attendance: 90, 
      performance: "good",
      program: "Computer Science",
      year: 2
    },
    { 
      id: "s5", 
      name: "jitendra devra", 
      email: "d.jitu@university.edu", 
      studentId: "S-38921", 
      phone: "(555) 567-8901", 
      enrolledClasses: 5, 
      grade: "A", 
      attendance: 98, 
      performance: "excellent",
      program: "Data Science",
      year: 4
    },
    { 
      id: "s6", 
      name: "vaibhav", 
      email: "s.vaibhav@university.edu", 
      studentId: "S-39056", 
      phone: "(555) 678-9012", 
      enrolledClasses: 5, 
      grade: "B", 
      attendance: 88, 
      performance: "good",
      program: "Computer Engineering",
      year: 3
    },
    { 
      id: "s7", 
      name: "Patel Smith", 
      email: "p.smith@university.edu", 
      studentId: "S-40123", 
      phone: "(555) 789-0123", 
      enrolledClasses: 4, 
      grade: "C+", 
      attendance: 60, 
      performance: "poor",
      program: "Computer Science",
      year: 1
    }
  ];

  // Filter students based on search term, class, and performance
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === "all" || true; // In a real app, would filter by enrolled classes
    
    const matchesPerformance = 
      selectedPerformance === "all" || 
      student.performance === selectedPerformance;
    
    return matchesSearch && matchesClass && matchesPerformance;
  });

  // Mock classes for filtering
  const classes = [
    { id: "cs101", name: "CS 101: Introduction to Computer Science" },
    { id: "cs205", name: "CS 205: Data Structures and Algorithms" },
    { id: "math202", name: "MATH 202: Advanced Calculus" },
  ];

  // Helper function to render performance badge
  const renderPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: { bg: "bg-green-100", text: "text-green-800" },
      good: { bg: "bg-blue-100", text: "text-blue-800" },
      average: { bg: "bg-yellow-100", text: "text-yellow-800" },
      poor: { bg: "bg-red-100", text: "text-red-800" },
    };
    
    const style = variants[performance as keyof typeof variants] || { bg: "bg-gray-100", text: "text-gray-800" };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {performance.charAt(0).toUpperCase() + performance.slice(1)}
      </span>
    );
  };

  // Mock student details
  const studentDetails = {
    name: "Alex Johnson",
    id: "S-35412",
    email: "alex.j@university.edu",
    phone: "(555) 123-4567",
    program: "Computer Science",
    year: 3,
    advisor: "Dr. Emily Reynolds",
    enrolledClasses: [
      { code: "CS 101", name: "Introduction to Computer Science", grade: "A", attendance: 95 },
      { code: "CS 205", name: "Data Structures and Algorithms", grade: "A-", attendance: 92 },
      { code: "MATH 202", name: "Advanced Calculus", grade: "B+", attendance: 88 },
      { code: "CS 301", name: "Database Systems", grade: "A", attendance: 98 },
      { code: "CS 315", name: "Web Development", grade: "A+", attendance: 96 },
    ],
    performanceHistory: [
      { semester: "Fall 2024", gpa: 3.8, attendance: 92 },
      { semester: "Spring 2024", gpa: 3.7, attendance: 94 },
      { semester: "Fall 2023", gpa: 3.5, attendance: 90 },
    ]
  };

  return (
    <DashLayout
      title="Students"
      description="View and manage student information"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Filter by performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Student List</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedStudent}>
              Student Details
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {getInitials(student.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Year {student.year} • {student.program}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.enrolledClasses}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.attendance}%</TableCell>
                          <TableCell>
                            {renderPerformanceBadge(student.performance)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedStudent(student.id)}>
                                  <User className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  View Enrolled Classes
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Grades
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Report Issue
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                          No students found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-center border-t p-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials(studentDetails.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{studentDetails.name}</CardTitle>
                      <CardDescription>
                        {studentDetails.id} • {studentDetails.program} • Year {studentDetails.year}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{studentDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{studentDetails.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Academic Advisor</p>
                        <p className="font-medium">{studentDetails.advisor}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Academic Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Current GPA</p>
                          <p className="font-medium">3.8/4.0</p>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Attendance Rate</p>
                          <p className="font-medium">95%</p>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Assignment Completion</p>
                          <p className="font-medium">92%</p>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Performance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Semester</TableHead>
                            <TableHead>GPA</TableHead>
                            <TableHead>Attendance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentDetails.performanceHistory.map((semester, index) => (
                            <TableRow key={index}>
                              <TableCell>{semester.semester}</TableCell>
                              <TableCell>{semester.gpa}</TableCell>
                              <TableCell>{semester.attendance}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Enrolled Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class Code</TableHead>
                          <TableHead>Class Name</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentDetails.enrolledClasses.map((cls, index) => (
                          <TableRow key={index}>
                            <TableCell>{cls.code}</TableCell>
                            <TableCell>{cls.name}</TableCell>
                            <TableCell>{cls.grade}</TableCell>
                            <TableCell>{cls.attendance}%</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>
                    Student performance across all your classes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/20 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Performance chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Student Statistics</CardTitle>
                  <CardDescription>
                    Overall metrics for your students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average GPA</span>
                      <span className="text-sm font-medium">3.5/4.0</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Attendance</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Total Students</p>
                        <p className="text-2xl font-bold">142</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">At Risk</p>
                        <p className="text-2xl font-bold text-red-600">12</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium mb-2">Performance Breakdown</p>
                    <div className="grid grid-cols-2 gap-y-2">
                      <p className="text-xs text-muted-foreground">Excellent</p>
                      <p className="text-xs font-medium text-right">31%</p>
                      <p className="text-xs text-muted-foreground">Good</p>
                      <p className="text-xs font-medium text-right">45%</p>
                      <p className="text-xs text-muted-foreground">Average</p>
                      <p className="text-xs font-medium text-right">15%</p>
                      <p className="text-xs text-muted-foreground">Poor</p>
                      <p className="text-xs font-medium text-right">9%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashLayout>
  );
}