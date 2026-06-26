import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  History,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileCheck
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
export default function GradesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("current");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const courses = [
    {
      id: "cs101",
      name: "Introduction to Computer Science",
      code: "CS 101",
      instructor: "Dr. Michael Reynolds",
      semester: "Spring 2025",
      credits: 3,
      grade: "A",
      percentage: 93.5,
      status: "active"
    },
    {
      id: "cs205",
      name: "Data Structures and Algorithms",
      code: "CS 205",
      instructor: "Dr. Sarah Connor",
      semester: "Spring 2025",
      credits: 3,
      grade: "A-",
      percentage: 91.2,
      status: "active"
    },
    {
      id: "math202",
      name: "Advanced Calculus",
      code: "MATH 202",
      instructor: "Dr. James Wilson",
      semester: "Spring 2025",
      credits: 4,
      grade: "B+",
      percentage: 88.7,
      status: "active"
    },
    {
      id: "eng101",
      name: "English Composition",
      code: "ENG 101",
      instructor: "Prof. Emily Bronte",
      semester: "Spring 2025",
      credits: 3,
      grade: "A",
      percentage: 94.1,
      status: "active"
    },
    {
      id: "cs210",
      name: "Introduction to Software Engineering",
      code: "CS 210",
      instructor: "Dr. Robert Martin",
      semester: "Fall 2024",
      credits: 3,
      grade: "A+",
      percentage: 97.5,
      status: "completed"
    },
    {
      id: "phys101",
      name: "Introduction to Physics",
      code: "PHYS 101",
      instructor: "Dr. Richard Feynman",
      semester: "Fall 2024",
      credits: 4,
      grade: "B",
      percentage: 85.3,
      status: "completed"
    }
  ];
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === "all" || selectedSemester === "current" && course.status === "active" || selectedSemester === "past" && course.status === "completed";
    return matchesSearch && matchesSemester;
  });
  const calculateGPA = (courses2, onlyCurrent = false) => {
    const relevantCourses = onlyCurrent ? courses2.filter((c) => c.status === "active") : courses2;
    if (relevantCourses.length === 0) return 0;
    const gradePoints = {
      "A+": 4,
      "A": 4,
      "A-": 3.7,
      "B+": 3.3,
      "B": 3,
      "B-": 2.7,
      "C+": 2.3,
      "C": 2,
      "C-": 1.7,
      "D+": 1.3,
      "D": 1,
      "D-": 0.7,
      "F": 0
    };
    let totalPoints = 0;
    let totalCredits = 0;
    relevantCourses.forEach((course) => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });
    return totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2));
  };
  const currentGPA = calculateGPA(filteredCourses, true);
  const cumulativeGPA = calculateGPA(filteredCourses);
  const gradeDistribution = {
    A: filteredCourses.filter((c) => c.grade.startsWith("A")).length,
    B: filteredCourses.filter((c) => c.grade.startsWith("B")).length,
    C: filteredCourses.filter((c) => c.grade.startsWith("C")).length,
    D: filteredCourses.filter((c) => c.grade.startsWith("D")).length,
    F: filteredCourses.filter((c) => c.grade === "F").length
  };
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const assignments = [
    { id: 1, name: "Assignment 1", category: "Homework", weight: 10, score: 92, maxScore: 100, status: "graded" },
    { id: 2, name: "Quiz 1", category: "Quiz", weight: 5, score: 85, maxScore: 100, status: "graded" },
    { id: 3, name: "Midterm Exam", category: "Exam", weight: 25, score: 88, maxScore: 100, status: "graded" },
    { id: 4, name: "Assignment 2", category: "Homework", weight: 10, score: 94, maxScore: 100, status: "graded" },
    { id: 5, name: "Quiz 2", category: "Quiz", weight: 5, score: 90, maxScore: 100, status: "graded" },
    { id: 6, name: "Project", category: "Project", weight: 20, score: null, maxScore: 100, status: "pending" },
    { id: 7, name: "Final Exam", category: "Exam", weight: 25, score: null, maxScore: 100, status: "upcoming" }
  ];
  const categoryAverages = assignments.reduce((acc, curr) => {
    if (curr.score === null) return acc;
    if (!acc[curr.category]) {
      acc[curr.category] = { total: 0, count: 0, sum: 0 };
    }
    acc[curr.category].sum += curr.score;
    acc[curr.category].count += 1;
    acc[curr.category].total = acc[curr.category].sum / acc[curr.category].count;
    return acc;
  }, {});
  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    if (grade.startsWith("D")) return "text-orange-600";
    return "text-red-600";
  };
  const gradingScale = [
    { grade: "A+", range: "97-100", gpa: 4 },
    { grade: "A", range: "93-96", gpa: 4 },
    { grade: "A-", range: "90-92", gpa: 3.7 },
    { grade: "B+", range: "87-89", gpa: 3.3 },
    { grade: "B", range: "83-86", gpa: 3 },
    { grade: "B-", range: "80-82", gpa: 2.7 },
    { grade: "C+", range: "77-79", gpa: 2.3 },
    { grade: "C", range: "73-76", gpa: 2 },
    { grade: "C-", range: "70-72", gpa: 1.7 },
    { grade: "D+", range: "67-69", gpa: 1.3 },
    { grade: "D", range: "63-66", gpa: 1 },
    { grade: "D-", range: "60-62", gpa: 0.7 },
    { grade: "F", range: "0-59", gpa: 0 }
  ];
  const gpaTrend = [
    { semester: "Fall 2023", gpa: 3.5 },
    { semester: "Spring 2024", gpa: 3.65 },
    { semester: "Fall 2024", gpa: 3.7 },
    { semester: "Spring 2025", gpa: currentGPA }
  ];
  return <DashLayout
    title="My Grades"
    description="View and track your academic performance"
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
            <Download className="mr-2 h-4 w-4" />
            Export Transcript
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader className="border-b pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <CardTitle>Course Grades</CardTitle>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground mr-2">Current GPA:</span>
                    <span className="font-bold text-green-600">{currentGPA.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground mr-2">Cumulative GPA:</span>
                    <span className="font-bold text-blue-600">{cumulativeGPA.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? filteredCourses.map((course) => <TableRow
    key={course.id}
    onClick={() => setSelectedCourseId(course.id)}
    className={`cursor-pointer hover:bg-muted/50 ${selectedCourseId === course.id ? "bg-muted/50" : ""}`}
  >
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>{course.semester}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>
                          <span className={`font-bold ${getGradeColor(course.grade)}`}>
                            {course.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={course.percentage} className="w-16 h-2" />
                            <span>{course.percentage.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>) : <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No course grades found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Course Details: {selectedCourse.name}</CardTitle>
              <CardDescription>
                {selectedCourse.code} • {selectedCourse.instructor} • {selectedCourse.semester}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <p className="text-sm text-muted-foreground mb-1">Current Grade</p>
                    <p className={`text-3xl font-bold ${getGradeColor(selectedCourse.grade)}`}>
                      {selectedCourse.grade}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedCourse.percentage.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <p className="text-sm text-muted-foreground mb-1">Assignments</p>
                    <div className="flex gap-1 items-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-lg font-semibold">
                        {assignments.filter((a) => a.status === "graded").length}/
                        {assignments.length}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <p className="text-sm text-muted-foreground mb-1">Exams</p>
                    <div className="flex gap-1 items-center">
                      <p className="text-lg font-semibold">
                        {assignments.filter((a) => a.category === "Exam" && a.status === "graded").length}/
                        {assignments.filter((a) => a.category === "Exam").length}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <p className="text-sm text-muted-foreground mb-1">Credits</p>
                    <p className="text-2xl font-bold">
                      {selectedCourse.credits}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Credit Hours
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="assignments">
                <TabsList className="mb-4">
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="scale">Grading Scale</TabsTrigger>
                </TabsList>
                
                <TabsContent value="assignments" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Contribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{assignment.category}</Badge>
                          </TableCell>
                          <TableCell>{assignment.weight}%</TableCell>
                          <TableCell>
                            {assignment.score !== null ? `${assignment.score}/${assignment.maxScore}` : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={assignment.status === "graded" ? "default" : assignment.status === "pending" ? "secondary" : "outline"}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {assignment.score !== null ? `${(assignment.score / assignment.maxScore * assignment.weight).toFixed(1)}%` : "-"}
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="categories" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Category Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Weight</TableHead>
                              <TableHead>Average</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Homework</TableCell>
                              <TableCell>20%</TableCell>
                              <TableCell>{categoryAverages["Homework"]?.total.toFixed(1) || "-"}%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Quiz</TableCell>
                              <TableCell>10%</TableCell>
                              <TableCell>{categoryAverages["Quiz"]?.total.toFixed(1) || "-"}%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Exam</TableCell>
                              <TableCell>50%</TableCell>
                              <TableCell>{categoryAverages["Exam"]?.total.toFixed(1) || "-"}%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Project</TableCell>
                              <TableCell>20%</TableCell>
                              <TableCell>{categoryAverages["Project"]?.total.toFixed(1) || "-"}%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Completion Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Overall Progress</span>
                            <span className="text-sm font-medium">
                              {Math.round(assignments.filter((a) => a.status === "graded").length / assignments.length * 100)}%
                            </span>
                          </div>
                          <Progress
    value={assignments.filter((a) => a.status === "graded").length / assignments.length * 100}
    className="h-2"
  />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Card>
                            <CardContent className="p-3 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Completed</p>
                              <p className="text-lg font-semibold">{assignments.filter((a) => a.status === "graded").length}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3 text-center">
                              <HelpCircle className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Pending</p>
                              <p className="text-lg font-semibold">{assignments.filter((a) => a.status === "pending").length}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3 text-center">
                              <AlertCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Upcoming</p>
                              <p className="text-lg font-semibold">{assignments.filter((a) => a.status === "upcoming").length}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="scale" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">University Grading Scale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Letter Grade</TableHead>
                            <TableHead>Percentage Range</TableHead>
                            <TableHead>GPA Points</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gradingScale.map((grade, index) => <TableRow key={index}>
                              <TableCell className="font-medium">{grade.grade}</TableCell>
                              <TableCell>{grade.range}%</TableCell>
                              <TableCell>{grade.gpa.toFixed(1)}</TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>GPA Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">Current GPA</h3>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+0.1</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-muted rounded-md p-6 text-center">
                  <p className="text-5xl font-bold text-primary mb-2">{currentGPA.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">out of 4.00</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">GPA by Semester</h4>
                  <div className="space-y-2">
                    {gpaTrend.map((item, index) => <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.semester}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${index > 0 && item.gpa > gpaTrend[index - 1].gpa ? "text-green-600" : index > 0 && item.gpa < gpaTrend[index - 1].gpa ? "text-red-600" : ""}`}>
                            {item.gpa.toFixed(2)}
                          </span>
                          {index > 0 && (item.gpa > gpaTrend[index - 1].gpa ? <TrendingUp className="h-3 w-3 text-green-500" /> : item.gpa < gpaTrend[index - 1].gpa ? <TrendingDown className="h-3 w-3 text-red-500" /> : null)}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-base font-medium">Grade Distribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">A Grades</span>
                    <span className="text-sm font-medium">{gradeDistribution.A}</span>
                  </div>
                  <Progress value={gradeDistribution.A / filteredCourses.length * 100} className="h-2 bg-muted" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">B Grades</span>
                    <span className="text-sm font-medium">{gradeDistribution.B}</span>
                  </div>
                  <Progress value={gradeDistribution.B / filteredCourses.length * 100} className="h-2 bg-muted" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">C Grades</span>
                    <span className="text-sm font-medium">{gradeDistribution.C}</span>
                  </div>
                  <Progress value={gradeDistribution.C / filteredCourses.length * 100} className="h-2 bg-muted" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">D Grades</span>
                    <span className="text-sm font-medium">{gradeDistribution.D}</span>
                  </div>
                  <Progress value={gradeDistribution.D / filteredCourses.length * 100} className="h-2 bg-muted" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">F Grades</span>
                    <span className="text-sm font-medium">{gradeDistribution.F}</span>
                  </div>
                  <Progress value={gradeDistribution.F / filteredCourses.length * 100} className="h-2 bg-muted" />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" className="w-full">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Generate Full Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>;
}
