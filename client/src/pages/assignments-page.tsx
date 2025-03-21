import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, Upload, Download, Filter, Calendar, CheckCircle,
  Book, MoreHorizontal, Plus, FileUp, Edit, Trash, Eye, 
  ClipboardCheck, Clock, AlertCircle, BookOpen, ExternalLink, FileText
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [viewAssignment, setViewAssignment] = useState<string | null>(null);
  
  if (!user) return null;
  
  const isFaculty = user.role === ROLES.FACULTY;
  
  // Mock courses data
  const courses = [
    { id: "cs101", name: "Introduction to Computer Science", code: "CS 101" },
    { id: "cs205", name: "Data Structures and Algorithms", code: "CS 205" },
    { id: "math202", name: "Advanced Calculus", code: "MATH 202" },
    { id: "eng101", name: "English Composition", code: "ENG 101" },
  ];
  
  // Mock assignments data
  const assignmentsData = [
    { 
      id: "a1", 
      title: "Programming Basics", 
      courseId: "cs101", 
      courseName: "Introduction to Computer Science",
      dueDate: "2025-03-25T23:59:00",
      dateCreated: "2025-03-10T10:00:00",
      maxPoints: 100,
      status: isFaculty ? "active" : "pending",
      description: "Implement basic programming concepts in Python including variables, data types, and control structures.",
      attachments: ["assignment1.pdf"],
      submissions: isFaculty ? 28 : null,
      submissionDate: isFaculty ? null : null,
      grade: isFaculty ? null : null,
      feedback: isFaculty ? null : null
    },
    { 
      id: "a2", 
      title: "Control Structures", 
      courseId: "cs101", 
      courseName: "Introduction to Computer Science",
      dueDate: "2025-04-05T23:59:00",
      dateCreated: "2025-03-15T14:30:00",
      maxPoints: 100,
      status: isFaculty ? "active" : "upcoming",
      description: "Implement various control structures including loops, conditional statements, and functions.",
      attachments: ["assignment2.pdf", "starter_code.py"],
      submissions: isFaculty ? 15 : null,
      submissionDate: isFaculty ? null : null,
      grade: isFaculty ? null : null,
      feedback: isFaculty ? null : null
    },
    { 
      id: "a3", 
      title: "Data Structures Implementation", 
      courseId: "cs205", 
      courseName: "Data Structures and Algorithms",
      dueDate: "2025-03-28T23:59:00",
      dateCreated: "2025-03-10T09:15:00",
      maxPoints: 150,
      status: isFaculty ? "active" : "pending",
      description: "Implement a linked list, stack, and queue data structure with appropriate methods.",
      attachments: ["ds_assignment.pdf", "test_cases.zip"],
      submissions: isFaculty ? 22 : null,
      submissionDate: isFaculty ? null : null,
      grade: isFaculty ? null : null,
      feedback: isFaculty ? null : null
    },
    { 
      id: "a4", 
      title: "Linear Algebra Problems", 
      courseId: "math202", 
      courseName: "Advanced Calculus",
      dueDate: "2025-03-18T23:59:00",
      dateCreated: "2025-03-05T11:30:00",
      maxPoints: 100,
      status: isFaculty ? "active" : "submitted",
      description: "Solve the set of linear algebra problems in the attached PDF.",
      attachments: ["calculus_problems.pdf"],
      submissions: isFaculty ? 30 : null,
      submissionDate: isFaculty ? null : "2025-03-17T14:22:00",
      grade: isFaculty ? null : "95/100",
      feedback: isFaculty ? null : "Excellent work on the matrix transformations. The eigenvalue calculations were perfect. You could improve on the vector space proofs."
    },
    { 
      id: "a5", 
      title: "Essay on Modern Literature", 
      courseId: "eng101", 
      courseName: "English Composition",
      dueDate: "2025-03-15T23:59:00",
      dateCreated: "2025-03-01T10:00:00",
      maxPoints: 100,
      status: isFaculty ? "closed" : "graded", 
      description: "Write a 1500-word essay analyzing a theme from one of the modern novels we've discussed in class.",
      attachments: ["essay_guidelines.pdf"],
      submissions: isFaculty ? 35 : null,
      submissionDate: isFaculty ? null : "2025-03-15T20:15:00",
      grade: isFaculty ? null : "88/100",
      feedback: isFaculty ? null : "Your analysis shows good insight, but could benefit from more textual evidence. The structure is clear, and your arguments are well-developed. Work on your conclusion to tie everything together more effectively."
    }
  ];
  
  // Filter assignments based on search term, status, and course
  const filteredAssignments = assignmentsData.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || assignment.status === selectedStatus;
    
    const matchesCourse = selectedCourse === "all" || assignment.courseId === selectedCourse;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });
  
  // Calculate remaining time for an assignment
  const calculateRemainingTime = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    
    if (diffTime <= 0) {
      return "Past due";
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
  };
  
  // Format due date for display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">Pending</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100/80">Submitted</Badge>;
      case 'graded':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">Graded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get selected assignment
  const selectedAssignment = viewAssignment 
    ? assignmentsData.find(a => a.id === viewAssignment) 
    : null;
  
  // Mock student submissions for faculty view
  const studentSubmissions = [
    { 
      id: 1, 
      studentName: "Alex Johnson", 
      studentId: "S-35412", 
      submissionDate: "2025-03-17T14:22:00", 
      status: "graded", 
      grade: "95/100", 
      files: ["submission.pdf", "code.py"] 
    },
    { 
      id: 2, 
      studentName: "Maria Garcia", 
      studentId: "S-35678", 
      submissionDate: "2025-03-17T16:05:00", 
      status: "graded", 
      grade: "90/100", 
      files: ["assignment1.pdf", "solution.py"] 
    },
    { 
      id: 3, 
      studentName: "James Wilson", 
      studentId: "S-36712", 
      submissionDate: "2025-03-17T23:45:00", 
      status: "graded", 
      grade: "88/100", 
      files: ["wilson_submission.zip"] 
    },
    { 
      id: 4, 
      studentName: "Sarah Ahmed", 
      studentId: "S-37845", 
      submissionDate: "2025-03-18T10:12:00", 
      status: "pending", 
      grade: null, 
      files: ["homework.pdf"] 
    },
    { 
      id: 5, 
      studentName: "David Chen", 
      studentId: "S-38921", 
      submissionDate: "2025-03-16T08:30:00", 
      status: "graded", 
      grade: "98/100", 
      files: ["solution.zip"] 
    },
  ];

  return (
    <DashLayout 
      title="Assignments" 
      description={isFaculty ? "Create and manage assignments" : "View and submit your assignments"}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {isFaculty ? (
                  <>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {isFaculty && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new assignment. Students will be notified when it's published.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input id="title" placeholder="e.g., Programming Basics Assignment" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="course">Course</Label>
                    <Select>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code}: {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter detailed instructions for the assignment..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="datetime-local" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="maxPoints">Maximum Points</Label>
                      <Input id="maxPoints" type="number" placeholder="e.g., 100" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="files">Attachments</Label>
                    <div className="border rounded-lg p-2 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to select files
                        </p>
                        <Button variant="outline" size="sm">
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload Files
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="publish" />
                    <Label htmlFor="publish">Publish immediately</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button onClick={() => setShowCreateDialog(false)}>Create Assignment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Assignment List</TabsTrigger>
            {viewAssignment && (
              <TabsTrigger value="details">Assignment Details</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>{isFaculty ? 'Submissions' : 'Status'}</TableHead>
                      {!isFaculty && <TableHead>Grade</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.length > 0 ? (
                      filteredAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell>{assignment.courseName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDueDate(assignment.dueDate)}</span>
                              {new Date(assignment.dueDate) > new Date() && (
                                <span className="text-xs text-muted-foreground">
                                  {calculateRemainingTime(assignment.dueDate)} left
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isFaculty ? (
                              <div className="flex items-center gap-2">
                                <span>{assignment.submissions}/{courses.find(c => c.id === assignment.courseId)?.id === "cs101" ? 35 : 30}</span>
                                {getStatusBadge(assignment.status)}
                              </div>
                            ) : (
                              getStatusBadge(assignment.status)
                            )}
                          </TableCell>
                          {!isFaculty && (
                            <TableCell>
                              {assignment.grade || '-'}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setViewAssignment(assignment.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {isFaculty ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Assignment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ClipboardCheck className="mr-2 h-4 w-4" />
                                      View Submissions
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download All Submissions
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem disabled={assignment.status === "closed"}>
                                      <Clock className="mr-2 h-4 w-4" />
                                      {assignment.status === "closed" ? "Reopen Assignment" : "Close Assignment"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete Assignment
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                assignment.status === "pending" && (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => setShowSubmitDialog(true)}
                                  >
                                    Submit
                                  </Button>
                                )
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={isFaculty ? 5 : 6} className="text-center py-6 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground/50 mb-2" />
                            <p>No assignments found. Try adjusting your search or filters.</p>
                            {isFaculty && (
                              <Button 
                                variant="outline" 
                                className="mt-4"
                                onClick={() => setShowCreateDialog(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Assignment
                              </Button>
                            )}
                          </div>
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
            
            {/* Submit Assignment Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Submit Assignment</DialogTitle>
                  <DialogDescription>
                    Upload your completed assignment files for submission.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Assignment</Label>
                    <div className="text-sm font-medium">
                      {assignmentsData.find(a => a.status === "pending")?.title}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <div className="text-sm">
                      {assignmentsData.find(a => a.status === "pending") 
                        ? formatDueDate(assignmentsData.find(a => a.status === "pending")!.dueDate)
                        : ""}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="comments">Comments (Optional)</Label>
                    <Textarea 
                      id="comments" 
                      placeholder="Add any comments about your submission..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="files">Upload Files</Label>
                    <div className="border rounded-lg p-2 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to select files
                        </p>
                        <Button variant="outline" size="sm">
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload Files
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="confirm" />
                    <Label htmlFor="confirm">I confirm this is my own work and I have followed the academic honesty policy</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
                  <Button onClick={() => setShowSubmitDialog(false)}>Submit Assignment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {selectedAssignment && (
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedAssignment.title}</CardTitle>
                        <CardDescription>
                          {selectedAssignment.courseName} • {formatDueDate(selectedAssignment.dueDate)}
                        </CardDescription>
                      </div>
                      <div>
                        {getStatusBadge(selectedAssignment.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Description</h3>
                      <div className="rounded-lg border p-4 bg-muted/50">
                        <p className="whitespace-pre-line">
                          {selectedAssignment.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Attachments</h3>
                      <div className="space-y-2">
                        {selectedAssignment.attachments.map((file, index) => (
                          <div key={index} className="rounded-lg border p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-500" />
                              <span>{file}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {isFaculty ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Student Submissions</h3>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download All
                          </Button>
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead>Submission Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Grade</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentSubmissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className="text-xs">
                                        {getInitials(submission.studentName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">{submission.studentName}</p>
                                      <p className="text-xs text-muted-foreground">{submission.studentId}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {new Date(submission.submissionDate).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  {submission.status === "graded" ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100/80">
                                      Graded
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Pending</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {submission.grade || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </Button>
                                    <Button 
                                      variant={submission.status === "graded" ? "outline" : "default"} 
                                      size="sm"
                                    >
                                      {submission.status === "graded" ? "Update Grade" : "Grade"}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <>
                        {selectedAssignment.status === "submitted" || selectedAssignment.status === "graded" ? (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Your Submission</h3>
                            <div className="rounded-lg border p-4 space-y-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-muted-foreground">Submitted on</p>
                                  <p className="font-medium">
                                    {selectedAssignment.submissionDate 
                                      ? new Date(selectedAssignment.submissionDate).toLocaleString() 
                                      : ""}
                                  </p>
                                </div>
                                
                                <div>
                                  {selectedAssignment.status === "graded" ? (
                                    <div className="text-right">
                                      <p className="text-sm text-muted-foreground">Grade</p>
                                      <p className="font-bold text-green-600">{selectedAssignment.grade}</p>
                                    </div>
                                  ) : (
                                    <Badge>Awaiting Grade</Badge>
                                  )}
                                </div>
                              </div>
                              
                              {selectedAssignment.status === "graded" && selectedAssignment.feedback && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Feedback</p>
                                  <div className="rounded-lg bg-muted p-3 text-sm">
                                    {selectedAssignment.feedback}
                                  </div>
                                </div>
                              )}
                              
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Submitted Files</p>
                                <div className="rounded-lg border p-3 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                                    <span>submission.pdf</span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedAssignment.status === "pending" ? (
                          <div className="flex justify-center">
                            <Button 
                              className="w-full max-w-md"
                              onClick={() => setShowSubmitDialog(true)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Submit Assignment
                            </Button>
                          </div>
                        ) : (
                          <div className="rounded-lg border p-4 flex items-center justify-center">
                            <div className="text-center py-6">
                              <Clock className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                This assignment is not yet open for submission.
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                  {isFaculty && (
                    <CardFooter className="border-t flex justify-between">
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Assignment
                      </Button>
                      <Button variant={selectedAssignment.status === "active" ? "default" : "outline"}>
                        {selectedAssignment.status === "active" ? "Close Assignment" : "Reopen Assignment"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Course</span>
                        <span className="text-sm font-medium">{selectedAssignment.courseName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedAssignment.dateCreated).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Due Date</span>
                        <span className="text-sm font-medium">
                          {formatDueDate(selectedAssignment.dueDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Points</span>
                        <span className="text-sm font-medium">{selectedAssignment.maxPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className="text-sm font-medium">{getStatusBadge(selectedAssignment.status)}</span>
                      </div>
                    </div>
                    
                    {isFaculty && (
                      <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-medium">Submission Statistics</h4>
                        
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Submitted</span>
                            <span>{selectedAssignment.submissions} of 35</span>
                          </div>
                          <Progress 
                            value={(selectedAssignment.submissions! / 35) * 100} 
                            className="h-2 mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Card>
                            <CardContent className="p-3 text-center">
                              <p className="text-xs text-muted-foreground">Graded</p>
                              <p className="text-xl font-bold text-green-600">
                                {studentSubmissions.filter(s => s.status === "graded").length}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3 text-center">
                              <p className="text-xs text-muted-foreground">Pending</p>
                              <p className="text-xl font-bold text-amber-600">
                                {studentSubmissions.filter(s => s.status === "pending").length}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="rounded-lg border p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Average Grade</span>
                            <span className="text-sm font-medium">90.2/100</span>
                          </div>
                          <Progress value={90.2} className="h-2" />
                        </div>
                      </div>
                    )}
                    
                    {new Date(selectedAssignment.dueDate) > new Date() && (
                      <div className="rounded-lg border p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-amber-500" />
                          <span className="font-medium text-sm">Time Remaining</span>
                        </div>
                        <p className="text-sm">
                          {calculateRemainingTime(selectedAssignment.dueDate)}
                        </p>
                      </div>
                    )}
                    
                    {!isFaculty && (
                      <div className="space-y-2 pt-4">
                        <h4 className="text-sm font-medium">Course Resources</h4>
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Course Materials
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Access Online Textbook
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashLayout>
  );
}