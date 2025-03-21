import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  Camera, Check, ChevronDown, Calendar as CalendarIcon, Clock, 
  Download, FileText, Search, Users, X, BarChart3
} from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognitionProgress, setRecognitionProgress] = useState(0);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceMode, setAttendanceMode] = useState<"manual" | "auto">("auto");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);

  type AttendanceRecord = {
    id: number;
    name: string;
    studentId: string;
    status: "present" | "absent" | "late";
    timeIn?: string;
    verificationMethod: "face" | "manual" | "pending";
  };

  // Mock class data
  const classes = [
    { id: "cs101", name: "Introduction to Computer Science", students: 35, schedule: "Mon/Wed/Fri 10:00 AM" },
    { id: "math202", name: "Advanced Calculus", students: 28, schedule: "Tue/Thu 1:00 PM" },
    { id: "eng101", name: "English Composition", students: 42, schedule: "Mon/Wed 3:00 PM" },
  ];

  // Mock student data for the selected class
  const mockStudents = [
    { id: 1, name: "Alex Johnson", studentId: "S-35412", status: "present", timeIn: "10:02 AM", verificationMethod: "face" },
    { id: 2, name: "Maria Garcia", studentId: "S-35678", status: "present", timeIn: "9:58 AM", verificationMethod: "face" },
    { id: 3, name: "James Wilson", studentId: "S-36712", status: "late", timeIn: "10:15 AM", verificationMethod: "face" },
    { id: 4, name: "Sarah Ahmed", studentId: "S-37845", status: "absent", verificationMethod: "manual" },
    { id: 5, name: "David Chen", studentId: "S-38921", status: "present", timeIn: "10:05 AM", verificationMethod: "face" },
    { id: 6, name: "Olivia Brown", studentId: "S-39056", status: "present", timeIn: "10:01 AM", verificationMethod: "face" },
    { id: 7, name: "Michael Smith", studentId: "S-40123", status: "absent", verificationMethod: "manual" },
    { id: 8, name: "Emma Davis", studentId: "S-40789", status: "present", timeIn: "9:59 AM", verificationMethod: "face" },
  ];

  useEffect(() => {
    // Initialize with mock data when a class is selected
    if (selectedClass) {
      setAttendanceData(mockStudents as AttendanceRecord[]);
    } else {
      setAttendanceData([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    // Handle camera activation/deactivation
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          setCameraActive(false);
        });
    } else if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  // Simulate face recognition process
  const startRecognition = () => {
    if (!selectedClass) return;
    
    setRecognizing(true);
    setRecognitionProgress(0);

    const interval = setInterval(() => {
      setRecognitionProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setRecognizing(false);
            setRecognitionProgress(100);
            // In a real app, this would update the attendance data from the API
            // For this demo, we'll just use our mock data which is already "recognized"
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const toggleAttendance = (studentId: number, status: "present" | "absent" | "late") => {
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { 
              ...student, 
              status, 
              timeIn: status === "absent" ? undefined : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              verificationMethod: "manual" 
            }
          : student
      )
    );
  };

  const attendanceStats = {
    present: attendanceData.filter(s => s.status === "present").length,
    late: attendanceData.filter(s => s.status === "late").length,
    absent: attendanceData.filter(s => s.status === "absent").length,
    total: attendanceData.length
  };

  const presentPercentage = attendanceData.length ? 
    Math.round(((attendanceStats.present + attendanceStats.late) / attendanceData.length) * 100) : 0;

  return (
    <DashLayout 
      title="Smart Attendance" 
      description="AI-powered attendance tracking system"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>
              Track attendance for your classes with AI facial recognition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 space-y-2">
                  <Label htmlFor="class-select">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/2 space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? formatDate(selectedDate) : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {selectedClass && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="ai-toggle">AI Facial Recognition</Label>
                      <Switch 
                        id="ai-toggle" 
                        checked={aiEnabled}
                        onCheckedChange={setAiEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setAttendanceMode(attendanceMode === "auto" ? "manual" : "auto")}
                      >
                        {attendanceMode === "auto" ? "Switch to Manual" : "Switch to Auto"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.print()}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  {attendanceMode === "auto" && aiEnabled && (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full md:w-2/5 aspect-video bg-muted rounded-lg overflow-hidden relative">
                          {cameraActive ? (
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Camera className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          
                          {recognizing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center space-y-2 p-4 rounded-lg">
                                <p className="text-white font-medium">Recognizing Students</p>
                                <Progress value={recognitionProgress} />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full md:w-3/5 space-y-4">
                          <h3 className="text-lg font-semibold">
                            AI-Powered Attendance
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            The system will automatically recognize students as they enter the classroom 
                            and mark their attendance. The facial recognition system works in real-time 
                            and maintains high accuracy even in varying lighting conditions.
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => setCameraActive(!cameraActive)}
                              variant={cameraActive ? "destructive" : "default"}
                            >
                              {cameraActive ? "Stop Camera" : "Start Camera"}
                            </Button>
                            
                            {cameraActive && !recognizing && (
                              <Button onClick={startRecognition} disabled={!selectedClass}>
                                Start Recognition
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {attendanceData.length > 0 && (
                    <div className="border rounded-lg">
                      <div className="p-4 flex items-center justify-between border-b">
                        <h3 className="font-medium">
                          {classes.find(c => c.id === selectedClass)?.name} - Attendance List
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="search" 
                            placeholder="Search students..." 
                            className="pl-8 w-[200px]"
                          />
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time In</TableHead>
                            <TableHead>Verification</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendanceData.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.studentId}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === "present" 
                                    ? "bg-green-100 text-green-800" 
                                    : student.status === "late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {student.timeIn || "-"}
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  student.verificationMethod === "face" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {student.verificationMethod === "face" ? "AI" : "Manual"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => toggleAttendance(student.id, "present")}
                                    className={student.status === "present" ? "text-green-600" : ""}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => toggleAttendance(student.id, "late")}
                                    className={student.status === "late" ? "text-yellow-600" : ""}
                                  >
                                    <Clock className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => toggleAttendance(student.id, "absent")}
                                    className={student.status === "absent" ? "text-red-600" : ""}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
            <CardDescription>
              {selectedClass 
                ? `${formatDate(selectedDate)}`
                : "Select a class to view stats"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedClass ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Attendance</span>
                    <span className="text-sm font-medium">{presentPercentage}%</span>
                  </div>
                  <Progress value={presentPercentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm text-muted-foreground">Present</p>
                      <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm text-muted-foreground">Late</p>
                      <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm text-muted-foreground">Absent</p>
                      <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h4 className="text-sm font-medium">Class Information</h4>
                  <div className="rounded-lg border divide-y">
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-muted-foreground">Class</span>
                      <span className="text-sm font-medium">
                        {classes.find(c => c.id === selectedClass)?.name}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-muted-foreground">Students</span>
                      <span className="text-sm font-medium">
                        {classes.find(c => c.id === selectedClass)?.students}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-muted-foreground">Schedule</span>
                      <span className="text-sm font-medium">
                        {classes.find(c => c.id === selectedClass)?.schedule}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">Select a class to view attendance statistics</p>
                </div>
              </div>
            )}
          </CardContent>
          {selectedClass && (
            <CardFooter>
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Attendance Report
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </DashLayout>
  );
}