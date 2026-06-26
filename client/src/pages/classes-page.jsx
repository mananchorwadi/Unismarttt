import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Plus,
  Download,
  Calendar,
  Edit,
  Trash2,
  Users,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
export default function ClassesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("current");
  const classes = [
    {
      id: "cs101",
      name: "Introduction to Computer Science",
      code: "CS 101",
      students: 35,
      schedule: "Mon/Wed/Fri 10:00 AM",
      room: "H-301",
      semester: "Spring 2025",
      status: "active"
    },
    {
      id: "cs205",
      name: "Data Structures and Algorithms",
      code: "CS 205",
      students: 28,
      schedule: "Tue/Thu 1:00 PM",
      room: "H-302",
      semester: "Spring 2025",
      status: "active"
    },
    {
      id: "math202",
      name: "Advanced Calculus",
      code: "MATH 202",
      students: 30,
      schedule: "Mon/Wed 9:00 AM",
      room: "S-101",
      semester: "Spring 2025",
      status: "active"
    },
    {
      id: "cs305",
      name: "Database Systems",
      code: "CS 305",
      students: 25,
      schedule: "Tue/Thu 3:00 PM",
      room: "H-205",
      semester: "Fall 2024",
      status: "completed"
    }
  ];
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || cls.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === "all" || selectedSemester === "current" && cls.status === "active" || selectedSemester === "past" && cls.status === "completed";
    return matchesSearch && matchesSemester;
  });
  const materials = [
    { id: 1, title: "Introduction to Programming Concepts", type: "lecture", date: "Feb 10, 2025" },
    { id: 2, title: "Variables and Data Types", type: "lecture", date: "Feb 12, 2025" },
    { id: 3, title: "Control Structures - Assignment", type: "assignment", date: "Feb 17, 2025", due: "Feb 24, 2025" },
    { id: 4, title: "Functions and Methods", type: "lecture", date: "Feb 19, 2025" },
    { id: 5, title: "Arrays and Lists", type: "lecture", date: "Feb 24, 2025" },
    { id: 6, title: "Mid-term Exam", type: "exam", date: "Mar 15, 2025" }
  ];
  const upcomingSessions = [
    { id: 1, topic: "Object-Oriented Programming", date: "Mar 1, 2025", time: "10:00 AM - 11:30 AM", room: "H-301" },
    { id: 2, topic: "Inheritance and Polymorphism", date: "Mar 3, 2025", time: "10:00 AM - 11:30 AM", room: "H-301" },
    { id: 3, topic: "Exception Handling", date: "Mar 5, 2025", time: "10:00 AM - 11:30 AM", room: "H-301" }
  ];
  return <DashLayout
    title="Classes"
    description="Manage your classes and course materials"
  >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
    type="search"
    placeholder="Search classes..."
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
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Create a new class for the current semester.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class-name">Class Name</Label>
                    <Input id="class-name" placeholder="e.g., Introduction to Computer Science" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="class-code">Class Code</Label>
                    <Input id="class-code" placeholder="e.g., CS 101" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="class-schedule">Schedule</Label>
                      <Select>
                        <SelectTrigger id="class-schedule">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mon-wed-fri">Mon/Wed/Fri</SelectItem>
                          <SelectItem value="tue-thu">Tue/Thu</SelectItem>
                          <SelectItem value="mon-wed">Mon/Wed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="class-time">Time</Label>
                      <Select>
                        <SelectTrigger id="class-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9am">9:00 AM</SelectItem>
                          <SelectItem value="10am">10:00 AM</SelectItem>
                          <SelectItem value="11am">11:00 AM</SelectItem>
                          <SelectItem value="1pm">1:00 PM</SelectItem>
                          <SelectItem value="2pm">2:00 PM</SelectItem>
                          <SelectItem value="3pm">3:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="class-room">Room</Label>
                    <Input id="class-room" placeholder="e.g., H-301" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={() => setShowAddDialog(false)}>Create Class</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Class List</TabsTrigger>
            <TabsTrigger value="details">Class Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.length > 0 ? filteredClasses.map((cls) => <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell>{cls.code}</TableCell>
                          <TableCell>{cls.students}</TableCell>
                          <TableCell>{cls.schedule}</TableCell>
                          <TableCell>{cls.room}</TableCell>
                          <TableCell>{cls.semester}</TableCell>
                          <TableCell>
                            <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                              {cls.status === "active" ? "Active" : "Completed"}
                            </Badge>
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
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Class
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Students
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Materials
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Class
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>) : <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No classes found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>}
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
                      <PaginationLink href="#">3</PaginationLink>
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
                <CardTitle>CS 101: Introduction to Computer Science</CardTitle>
                <CardDescription>
                  Spring 2025 • Mon/Wed/Fri 10:00 AM • Room H-301
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Students</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">35</div>
                      <p className="text-xs text-muted-foreground">
                        Enrolled in this class
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Assignments</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">
                        3 need grading
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        Lecture notes and slides
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Completion</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">35%</div>
                      <p className="text-xs text-muted-foreground">
                        Of course completed
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Course Materials</h3>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Material
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material) => <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.title}</TableCell>
                          <TableCell>
                            <Badge variant={material.type === "lecture" ? "outline" : material.type === "assignment" ? "default" : "destructive"}>
                              {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{material.date}</TableCell>
                          <TableCell>{material.due || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
                <CardDescription>
                  Upcoming classes and sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label>Class</Label>
                    <Select defaultValue="cs101">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs101">CS 101: Introduction to Computer Science</SelectItem>
                        <SelectItem value="cs205">CS 205: Data Structures and Algorithms</SelectItem>
                        <SelectItem value="math202">MATH 202: Advanced Calculus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex gap-2">
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Calendar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Upcoming Sessions</h3>
                  
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
                            <FileText className="mr-2 h-4 w-4" />
                            Materials
                          </Button>
                          <Button size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>)}
                  
                  <div className="flex justify-center">
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashLayout>;
}
